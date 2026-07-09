package main

// This file implements the MySQL wire-protocol translation that lets a Go client
// (go-sql-driver, which can't speak StarRocks' JWT auth plugin) log in as a JWT user.
//
// The MySQL login handshake is a scripted exchange of "packets". Each packet is a 4-byte
// header — 3 bytes little-endian payload length + 1 byte sequence number — followed by the
// payload. Login goes: server sends a Handshake (its capabilities), client replies with a
// HandshakeResponse (username + auth data), the server may send an AuthSwitchRequest ("use
// this other auth method"), the client answers, and the server ends with OK or ERR.
//
// The proxy speaks two different dialects on its two sides during that handshake:
//
//	Go client  ──cleartext (mysql_clear_password: the JWT sent as a "password")──▶  proxy
//	proxy      ──TLS + authentication_openid_connect_client (the JWT as auth data)──▶  StarRocks
//
// Once login succeeds it stops translating and just copies bytes both ways (see pipe).

import (
	"bytes"
	"crypto/tls"
	"encoding/binary"
	"errors"
	"io"
	"log/slog"
	"net"
	"strings"
	"sync"
	"time"
)

// MySQL capability flags — a bitfield where each bit advertises one feature. We only need
// to set/clear a handful.
const (
	clientSSL        uint32 = 0x00000800 // connection will upgrade to TLS
	clientProtocol41 uint32 = 0x00000200 // 4.1+ protocol (always on for us)
	clientSecureConn uint32 = 0x00008000 // secure-auth handshake layout
	clientPluginAuth uint32 = 0x00080000 // pluggable authentication
)

const (
	maxPacket    = 16 * 1024 * 1024        // max packet size we advertise (standard)
	nativePlugin = "mysql_native_password" // classic password plugin
	clearPlugin  = "mysql_clear_password"  // send-password-in-clear (what we ask the Go client for)
)

// ---------------------------------------------------------------------------
// Packet framing: read/write one MySQL packet over a connection.
// ---------------------------------------------------------------------------

type packetConn struct {
	conn net.Conn
}

// read returns one packet's sequence number and payload. The 3-byte little-endian length
// tells us exactly how many payload bytes follow the header.
func (p *packetConn) read() (seq byte, payload []byte, err error) {
	hdr := make([]byte, 4)
	if _, err := io.ReadFull(p.conn, hdr); err != nil {
		return 0, nil, err
	}
	length := int(uint32(hdr[0]) | uint32(hdr[1])<<8 | uint32(hdr[2])<<16)
	seq = hdr[3]
	payload = make([]byte, length)
	if _, err := io.ReadFull(p.conn, payload); err != nil {
		return 0, nil, err
	}
	return seq, payload, nil
}

// write frames payload with the 4-byte header (length + seq) and sends it.
func (p *packetConn) write(seq byte, payload []byte) error {
	pkt := make([]byte, 4+len(payload))
	pkt[0] = byte(len(payload))
	pkt[1] = byte(len(payload) >> 8)
	pkt[2] = byte(len(payload) >> 16)
	pkt[3] = seq
	copy(pkt[4:], payload)
	_, err := p.conn.Write(pkt)
	return err
}

// ---------------------------------------------------------------------------
// Pure protocol helpers (unit-tested in proxy_test.go).
// ---------------------------------------------------------------------------

// extractUsername reads the null-terminated username from a client HandshakeResponse41.
// That packet starts with a fixed 32-byte header (capabilities 4 + max_packet 4 +
// charset 1 + 23 reserved zero bytes); the username follows immediately after.
func extractUsername(handshakeResponse []byte) string {
	if len(handshakeResponse) < 33 {
		return ""
	}
	rest := handshakeResponse[32:]
	if end := bytes.IndexByte(rest, 0); end >= 0 {
		return string(rest[:end])
	}
	return string(rest)
}

// serverVersionEnd returns the index just past the NUL that terminates the server-version
// string in a HandshakeV10 packet (byte 0 is protocol_version, then the version string).
// The fixed-size fields that follow start there.
func serverVersionEnd(handshake []byte) int {
	i := 1
	for i < len(handshake) && handshake[i] != 0 {
		i++
	}
	return i + 1 // skip the NUL
}

// removeCapability clears one capability bit in a server HandshakeV10 packet. We use it to
// strip CLIENT_SSL, so the Go client sees a server that "doesn't support TLS" and stays
// cleartext — the proxy handles TLS toward StarRocks itself.
//
// After the server-version string the layout is: connection_id(4) + auth_salt(8) +
// filler(1) + capability_flags_low(2) + charset(1) + status(2) + capability_flags_high(2).
// The capability flags are historically split into a low and high 16-bit word, so we clear
// the bit from whichever word it lives in.
func removeCapability(handshake []byte, capability uint32) []byte {
	low := serverVersionEnd(handshake) + 4 + 8 + 1
	if low+2 > len(handshake) {
		return handshake
	}
	// Clear the capability's set bits from the little-endian field byte by byte (&^= clears
	// bits), avoiding any 16-bit narrowing conversion. Low word = bytes [low], [low+1].
	handshake[low] &^= byte(capability)
	handshake[low+1] &^= byte(capability >> 8)

	high := low + 2 + 1 + 2 // past capability_flags_low + charset(1) + status(2)
	if high+2 <= len(handshake) {
		// High word (bits 16-31) = bytes [high], [high+1].
		handshake[high] &^= byte(capability >> 16)
		handshake[high+1] &^= byte(capability >> 24)
	}
	return handshake
}

// charsetFromHandshake reads the charset byte StarRocks chose (it sits right after the low
// capability word), so we can echo it back in the packets we build. Defaults to utf8 (0x21).
func charsetFromHandshake(handshake []byte) byte {
	charset := serverVersionEnd(handshake) + 4 + 8 + 1 + 2
	if charset < len(handshake) {
		return handshake[charset]
	}
	return 0x21
}

// buildSSLRequest is the short packet we send to StarRocks to say "upgrade this connection
// to TLS." It carries only capability flags (with CLIENT_SSL set) + max_packet + charset +
// 23 reserved zero bytes; right after sending it we start the TLS handshake.
func buildSSLRequest(charset byte) []byte {
	caps := clientSSL | clientProtocol41 | clientSecureConn | clientPluginAuth
	b := make([]byte, 0, 32)
	b = binary.LittleEndian.AppendUint32(b, caps)
	b = binary.LittleEndian.AppendUint32(b, maxPacket)
	b = append(b, charset)
	return append(b, make([]byte, 23)...)
}

// buildNativeHandshakeResponse is the login packet we send to StarRocks: it claims
// mysql_native_password with EMPTY auth data. This is deliberate — StarRocks looks the user
// up, sees it's a JWT user, and answers with an AuthSwitchRequest to the OIDC plugin, which
// is the hook we use to hand over the JWT.
func buildNativeHandshakeResponse(username string, charset byte) []byte {
	caps := clientProtocol41 | clientSecureConn | clientPluginAuth
	b := make([]byte, 0, 64+len(username))
	b = binary.LittleEndian.AppendUint32(b, caps)
	b = binary.LittleEndian.AppendUint32(b, maxPacket)
	b = append(b, charset)
	b = append(b, make([]byte, 23)...)
	b = append(b, username...)
	b = append(b, 0) // username terminator
	b = append(b, 0) // empty auth data (length 0)
	b = append(b, nativePlugin...)
	return append(b, 0) // plugin-name terminator
}

// buildOIDCAuthResponse is the reply to StarRocks' AuthSwitchRequest: a required 0x01
// capability-flag byte, then the JWT as a length-encoded string. The leading flag byte is
// mandatory — StarRocks silently rejects the JWT sent without it.
func buildOIDCAuthResponse(jwt []byte) []byte {
	b := []byte{0x01}
	b = appendLenEncInt(b, len(jwt))
	return append(b, jwt...)
}

// appendLenEncInt writes n in MySQL's length-encoded-integer format: a single byte for
// small values, or a marker byte (0xfc/0xfd/0xfe) followed by 2/3/8 little-endian bytes.
func appendLenEncInt(b []byte, n int) []byte {
	switch {
	case n < 251:
		return append(b, byte(n))
	case n < 1<<16:
		return append(b, 0xfc, byte(n), byte(n>>8))
	case n < 1<<24:
		return append(b, 0xfd, byte(n), byte(n>>8), byte(n>>16))
	default:
		return binary.LittleEndian.AppendUint64(append(b, 0xfe), uint64(n))
	}
}

// authSwitchPacket tells the client to re-authenticate with mysql_clear_password, so it
// sends us the raw JWT as if it were a cleartext password. (0xfe = AuthSwitchRequest.)
func authSwitchPacket() []byte {
	b := []byte{0xfe}
	b = append(b, clearPlugin...)
	return append(b, 0)
}

// errPacket builds an ERR packet (0xff = error): code + '#' + SQLSTATE + message.
func errPacket(code uint16, sqlState, msg string) []byte {
	b := binary.LittleEndian.AppendUint16([]byte{0xff}, code)
	b = append(b, '#')
	b = append(b, sqlState...)
	return append(b, msg...)
}

// ---------------------------------------------------------------------------
// Connection handling.
// ---------------------------------------------------------------------------

// proxy carries the backend target and TLS config shared across all connections.
type proxy struct {
	backendAddr string
	tlsCfg      *tls.Config
	// authTimeout bounds the login phase so a stalled peer can't pin a goroutine forever;
	// it is cleared once the transparent pipe starts (piped sessions are long-lived).
	authTimeout time.Duration
}

// handle performs the two-sided login translation for one client connection, then pipes.
// The numbered steps are the login script described at the top of this file.
func (p *proxy) handle(clientConn net.Conn) {
	defer func() { _ = clientConn.Close() }()
	log := slog.With("remote", clientConn.RemoteAddr().String())

	backendTCP, err := net.DialTimeout("tcp", p.backendAddr, p.authTimeout)
	if err != nil {
		log.Error("backend connect failed", "error", err)
		return
	}
	defer func() { _ = backendTCP.Close() }()

	deadline := time.Now().Add(p.authTimeout)
	_ = clientConn.SetDeadline(deadline)
	_ = backendTCP.SetDeadline(deadline)

	backend := &packetConn{conn: backendTCP}
	client := &packetConn{conn: clientConn}

	// 1. Read StarRocks' opening handshake.
	_, hs, err := backend.read()
	if err != nil {
		log.Error("read backend handshake failed", "error", err)
		return
	}
	charset := charsetFromHandshake(hs)

	// 2. Tell StarRocks we want TLS, then upgrade the proxy→backend socket.
	if err := backend.write(1, buildSSLRequest(charset)); err != nil {
		log.Error("send SSL request failed", "error", err)
		return
	}
	tlsConn := tls.Client(backendTCP, p.tlsCfg)
	if err := tlsConn.Handshake(); err != nil {
		log.Error("backend TLS handshake failed", "error", err)
		return
	}
	backend.conn = tlsConn

	// 3. Forward the handshake to the Go client, but with CLIENT_SSL stripped so it stays
	//    cleartext and hands us the raw JWT. Copy first — removeCapability mutates in place.
	if err := client.write(0, removeCapability(append([]byte(nil), hs...), clientSSL)); err != nil {
		log.Error("send handshake to client failed", "error", err)
		return
	}

	// 4. Read the client's first response — we only need the username from it.
	_, clientResp, err := client.read()
	if err != nil {
		log.Error("read client response failed", "error", err)
		return
	}
	username := extractUsername(clientResp)

	// 5. Ask the client to switch to cleartext so it resends the "password" (the JWT) raw.
	if err := client.write(2, authSwitchPacket()); err != nil {
		log.Error("auth switch to client failed", "error", err)
		return
	}

	// 6. Read the JWT (a cleartext-plugin payload is the password + a trailing NUL).
	_, jwtPayload, err := client.read()
	if err != nil {
		log.Error("read JWT failed", "error", err)
		return
	}
	jwt := strings.TrimRight(string(jwtPayload), "\x00")
	if !strings.HasPrefix(jwt, "ey") { // every JWT starts with base64url({"alg"... → "ey"
		log.Warn("client did not send a JWT", "user", username)
		_ = client.write(4, errPacket(1045, "28000", "expected JWT as password"))
		return
	}

	// 7. Log in to StarRocks with native_password + empty auth; it will ask us to switch.
	if err := backend.write(2, buildNativeHandshakeResponse(username, charset)); err != nil {
		log.Error("send auth to backend failed", "error", err)
		return
	}
	seq, authResult, err := backend.read()
	if err != nil {
		log.Error("read backend auth result failed", "error", err)
		return
	}

	// 8. On the AuthSwitchRequest (0xfe), send the JWT in OIDC format and read the verdict.
	if len(authResult) > 0 && authResult[0] == 0xfe {
		if err := backend.write(seq+1, buildOIDCAuthResponse([]byte(jwt))); err != nil {
			log.Error("send OIDC auth response failed", "error", err)
			return
		}
		if _, authResult, err = backend.read(); err != nil {
			log.Error("read final auth result failed", "error", err)
			return
		}
	}

	// 9. Relay StarRocks' verdict (OK or ERR) back to the client.
	if err := client.write(4, authResult); err != nil {
		log.Error("forward auth result failed", "error", err)
		return
	}
	if len(authResult) > 0 && authResult[0] == 0xff { // 0xff = ERR
		code := uint16(authResult[1]) | uint16(authResult[2])<<8
		log.Warn("backend auth failed", "user", username, "code", code)
		return
	}
	log.Info("authenticated, piping", "user", username)

	// 10. Login done. Clear the deadline (sessions are long-lived) and become a dumb tube.
	_ = clientConn.SetDeadline(time.Time{})
	_ = backend.conn.SetDeadline(time.Time{})
	pipe(clientConn, backend.conn)
	log.Info("connection closed", "user", username)
}

// pipe copies bytes in both directions until either side closes, then closes both so the
// other copy goroutine unblocks and returns.
func pipe(a, b net.Conn) {
	var wg sync.WaitGroup
	wg.Add(2)
	copyOneWay := func(dst, src net.Conn) {
		defer wg.Done()
		if _, err := io.Copy(dst, src); err != nil && !errors.Is(err, net.ErrClosed) {
			slog.Debug("pipe copy ended", "error", err)
		}
		_ = dst.Close()
		_ = src.Close()
	}
	go copyOneWay(a, b)
	go copyOneWay(b, a)
	wg.Wait()
}
