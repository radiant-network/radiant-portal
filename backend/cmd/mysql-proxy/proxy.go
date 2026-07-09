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
	"runtime/debug"
	"strings"
	"sync"
	"time"
)

// MySQL capability flags — a bitfield where each bit advertises one feature. We only need
// to set/clear a handful.
const (
	clientConnectWithDB    uint32 = 0x00000008 // handshake response carries a default database
	clientSSL              uint32 = 0x00000800 // connection will upgrade to TLS
	clientProtocol41       uint32 = 0x00000200 // 4.1+ protocol (always on for us)
	clientSecureConn       uint32 = 0x00008000 // secure-auth handshake layout
	clientPluginAuth       uint32 = 0x00080000 // pluggable authentication
	clientConnectAttrs     uint32 = 0x00100000 // handshake response carries key/value attributes
	clientPluginAuthLenEnc uint32 = 0x00200000 // auth response is length-encoded (vs 1-byte length)
)

const (
	maxPacket    = 16 * 1024 * 1024        // max packet size we advertise (standard)
	nativePlugin = "mysql_native_password" // classic password plugin
	clearPlugin  = "mysql_clear_password"  // send-password-in-clear (what we ask the Go client for)
	oidcPlugin   = "authentication_openid_connect_client"
)

// HandshakeV10 fixed-field byte sizes, in wire order after the NUL-terminated server_version
// string. Used to locate the capability flags / charset by offset (see removeCapability and
// charsetFromHandshake) instead of magic numbers.
const (
	hsConnIDLen  = 4 // connection_id
	hsSaltLen    = 8 // auth-plugin-data part 1 (salt)
	hsFillerLen  = 1 // filler byte
	hsCapLowLen  = 2 // capability_flags, low 16 bits
	hsCharsetLen = 1 // charset
	hsStatusLen  = 2 // status_flags
	hsCapHighLen = 2 // capability_flags, high 16 bits
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

// clientHello is what we keep from the client's HandshakeResponse41: its capability flags and
// charset (mirrored toward StarRocks so both hops agree on the post-auth wire format), the
// username, and the default database when the DSN carries one (CLIENT_CONNECT_WITH_DB).
type clientHello struct {
	caps     uint32
	charset  byte
	username string
	database string
}

// parseClientHello decodes a HandshakeResponse41: a fixed 32-byte header (capabilities 4 +
// max_packet 4 + charset 1 + 23 reserved zero bytes), then the NUL-terminated username, then
// the auth response (whose length prefix depends on the capability bits), then the database
// (NUL-terminated) if CLIENT_CONNECT_WITH_DB is set.
func parseClientHello(resp []byte) (clientHello, error) {
	var h clientHello
	if len(resp) < 33 {
		return h, errors.New("handshake response too short")
	}
	h.caps = binary.LittleEndian.Uint32(resp[0:4])
	h.charset = resp[8]

	i := 32
	end := bytes.IndexByte(resp[i:], 0)
	if end < 0 {
		return h, errors.New("unterminated username")
	}
	h.username = string(resp[i : i+end])
	i += end + 1

	// Skip the auth response — we replace it anyway; we only parse past it to reach the database.
	switch {
	case h.caps&clientPluginAuthLenEnc != 0:
		n, consumed := readLenEncInt(resp[i:])
		if consumed == 0 {
			return h, errors.New("malformed auth-response length")
		}
		i += consumed + n
	case h.caps&clientSecureConn != 0:
		if i >= len(resp) {
			return h, errors.New("missing auth-response length")
		}
		i += 1 + int(resp[i])
	default:
		nul := bytes.IndexByte(resp[i:], 0)
		if nul < 0 {
			return h, errors.New("unterminated auth response")
		}
		i += nul + 1
	}
	if i > len(resp) {
		return h, errors.New("auth response overruns packet")
	}

	if h.caps&clientConnectWithDB != 0 && i < len(resp) {
		if nul := bytes.IndexByte(resp[i:], 0); nul >= 0 {
			h.database = string(resp[i : i+nul])
		} else {
			h.database = string(resp[i:])
		}
	}
	return h, nil
}

// readLenEncInt decodes a MySQL length-encoded integer, returning the value and the number of
// bytes consumed (consumed == 0 means malformed/truncated).
func readLenEncInt(b []byte) (n, consumed int) {
	if len(b) == 0 {
		return 0, 0
	}
	switch {
	case b[0] < 0xfb:
		return int(b[0]), 1
	case b[0] == 0xfc && len(b) >= 3:
		return int(binary.LittleEndian.Uint16(b[1:3])), 3
	case b[0] == 0xfd && len(b) >= 4:
		return int(uint32(b[1]) | uint32(b[2])<<8 | uint32(b[3])<<16), 4
	case b[0] == 0xfe && len(b) >= 9:
		return int(binary.LittleEndian.Uint64(b[1:9])), 9
	}
	return 0, 0
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
	low := serverVersionEnd(handshake) + hsConnIDLen + hsSaltLen + hsFillerLen
	if low+hsCapLowLen > len(handshake) {
		return handshake
	}
	// Clear the capability's set bits from the little-endian field byte by byte (&^= clears
	// bits), avoiding any 16-bit narrowing conversion. Low word = bytes [low], [low+1].
	handshake[low] &^= byte(capability)
	handshake[low+1] &^= byte(capability >> 8)

	high := low + hsCapLowLen + hsCharsetLen + hsStatusLen
	if high+hsCapHighLen <= len(handshake) {
		// High word (bits 16-31) = bytes [high], [high+1].
		handshake[high] &^= byte(capability >> 16)
		handshake[high+1] &^= byte(capability >> 24)
	}
	return handshake
}

// charsetFromHandshake reads the charset byte StarRocks chose (it sits right after the low
// capability word), so we can echo it back in the packets we build. Defaults to utf8 (0x21).
func charsetFromHandshake(handshake []byte) byte {
	charset := serverVersionEnd(handshake) + hsConnIDLen + hsSaltLen + hsFillerLen + hsCapLowLen
	if charset < len(handshake) {
		return handshake[charset]
	}
	return 0x21
}

// serverCapabilities reassembles the split low/high capability words of a HandshakeV10 packet
// (same layout removeCapability walks). Returns 0 on a truncated packet.
func serverCapabilities(handshake []byte) uint32 {
	low := serverVersionEnd(handshake) + hsConnIDLen + hsSaltLen + hsFillerLen
	if low+hsCapLowLen > len(handshake) {
		return 0
	}
	caps := uint32(binary.LittleEndian.Uint16(handshake[low:]))
	high := low + hsCapLowLen + hsCharsetLen + hsStatusLen
	if high+hsCapHighLen <= len(handshake) {
		caps |= uint32(binary.LittleEndian.Uint16(handshake[high:])) << 16
	}
	return caps
}

// backendCaps derives the capability flags the proxy presents to StarRocks from what the
// client negotiated with us. After login the pipe is a dumb byte copier, so a capability
// active on one hop but not the other (COMPRESS, DEPRECATE_EOF, MULTI_STATEMENTS, ...)
// corrupts the framing — mirroring the client's flags keeps both hops in agreement. We strip:
// CLIENT_SSL (the proxy does its own TLS), lenenc-auth (our auth data is empty, 1-byte
// length), and connect-attrs (we don't forward the client's attributes).
func backendCaps(clientCaps uint32, database string) uint32 {
	caps := clientCaps &^ (clientSSL | clientPluginAuthLenEnc | clientConnectAttrs)
	caps |= clientProtocol41 | clientSecureConn | clientPluginAuth
	if database == "" {
		caps &^= clientConnectWithDB
	}
	return caps
}

// buildSSLRequest is the short packet we send to StarRocks to say "upgrade this connection
// to TLS." It carries only capability flags (caps must be the same set later sent in the
// handshake response, plus CLIENT_SSL) + max_packet + charset + 23 reserved zero bytes; right
// after sending it we start the TLS handshake.
func buildSSLRequest(caps uint32, charset byte) []byte {
	b := make([]byte, 0, 32)
	b = binary.LittleEndian.AppendUint32(b, caps|clientSSL)
	b = binary.LittleEndian.AppendUint32(b, maxPacket)
	b = append(b, charset)
	return append(b, make([]byte, 23)...)
}

// buildNativeHandshakeResponse is the login packet we send to StarRocks: it claims
// mysql_native_password with EMPTY auth data. This is deliberate — StarRocks looks the user
// up, sees it's a JWT user, and answers with an AuthSwitchRequest to the OIDC plugin, which
// is the hook we use to hand over the JWT. caps/charset/database mirror the client's own
// handshake response (see backendCaps) so the DSN's default database survives the proxy.
func buildNativeHandshakeResponse(caps uint32, charset byte, username, database string) []byte {
	b := make([]byte, 0, 64+len(username)+len(database))
	b = binary.LittleEndian.AppendUint32(b, caps)
	b = binary.LittleEndian.AppendUint32(b, maxPacket)
	b = append(b, charset)
	b = append(b, make([]byte, 23)...)
	b = append(b, username...)
	b = append(b, 0) // username terminator
	b = append(b, 0) // empty auth data (length 0)
	if caps&clientConnectWithDB != 0 {
		b = append(b, database...)
		b = append(b, 0) // database terminator
	}
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

// authSwitchPluginName extracts the plugin name from an AuthSwitchRequest
// (0xfe + NUL-terminated name + plugin data).
func authSwitchPluginName(pkt []byte) string {
	rest := pkt[1:]
	if nul := bytes.IndexByte(rest, 0); nul >= 0 {
		return string(rest[:nul])
	}
	return string(rest)
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
	// Recover per connection: each runs in its own goroutine, and an unrecovered panic in any
	// goroutine crashes the whole process — one malformed connection must not take the proxy
	// down. Logged and dropped here; the deferred Close calls still run during unwinding.
	defer recoverConn(clientConn.RemoteAddr().String())
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

	// 1. Read StarRocks' opening handshake; it must offer TLS or the OIDC hop can't happen.
	_, hs, err := backend.read()
	if err != nil {
		log.Error("read backend handshake failed", "error", err)
		return
	}
	if serverCapabilities(hs)&clientSSL == 0 {
		log.Error("backend does not advertise CLIENT_SSL — enable TLS on the StarRocks FE")
		return
	}

	// 2. Forward the handshake to the Go client, but with CLIENT_SSL stripped so it stays
	//    cleartext and hands us the raw JWT. Copy first — removeCapability mutates in place.
	if err := client.write(0, removeCapability(append([]byte(nil), hs...), clientSSL)); err != nil {
		log.Error("send handshake to client failed", "error", err)
		return
	}

	// 3. Read the client's response: its capabilities, charset, username and — when the DSN
	//    carries one — the default database, all mirrored toward StarRocks below.
	_, clientResp, err := client.read()
	if err != nil {
		log.Error("read client response failed", "error", err)
		return
	}
	hello, err := parseClientHello(clientResp)
	if err != nil {
		log.Warn("malformed client handshake response", "error", err)
		_ = client.write(2, errPacket(1045, "28000", "malformed handshake response"))
		return
	}

	// 4. Ask the client to switch to cleartext so it resends the "password" (the JWT) raw.
	if err := client.write(2, authSwitchPacket()); err != nil {
		log.Error("auth switch to client failed", "error", err)
		return
	}

	// 5. Read the JWT (a cleartext-plugin payload is the password + a trailing NUL).
	_, jwtPayload, err := client.read()
	if err != nil {
		log.Error("read JWT failed", "error", err)
		return
	}
	jwt := strings.TrimRight(string(jwtPayload), "\x00")
	if !strings.HasPrefix(jwt, "ey") { // every JWT starts with base64url({"alg"... → "ey"
		log.Warn("client did not send a JWT", "user", hello.username)
		_ = client.write(4, errPacket(1045, "28000", "expected JWT as password"))
		return
	}

	// 6. Tell StarRocks we want TLS (mirroring the client's capabilities so both hops agree on
	//    the post-auth wire format), then upgrade the proxy→backend socket.
	caps := backendCaps(hello.caps, hello.database)
	charset := hello.charset
	if charset == 0 {
		charset = charsetFromHandshake(hs)
	}
	if err := backend.write(1, buildSSLRequest(caps, charset)); err != nil {
		log.Error("send SSL request failed", "error", err)
		return
	}
	tlsConn := tls.Client(backendTCP, p.tlsCfg)
	if err := tlsConn.Handshake(); err != nil {
		log.Error("backend TLS handshake failed", "error", err)
		return
	}
	backend.conn = tlsConn

	// 7. Log in to StarRocks with native_password + empty auth; it will ask us to switch.
	if err := backend.write(2, buildNativeHandshakeResponse(caps, charset, hello.username, hello.database)); err != nil {
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
		if plugin := authSwitchPluginName(authResult); plugin != oidcPlugin {
			// Non-JWT user (or misconfigured FE): our OIDC-formatted reply would only produce a
			// confusing backend error, so fail fast with a clear one.
			log.Error("backend requested unsupported auth plugin", "plugin", plugin, "user", hello.username)
			_ = client.write(4, errPacket(1045, "28000", "backend requested unsupported auth plugin: "+plugin))
			return
		}
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
		code := uint16(0)
		if len(authResult) >= 3 { // ERR = 0xff + 2-byte code; guard a truncated packet
			code = uint16(authResult[1]) | uint16(authResult[2])<<8
		}
		log.Warn("backend auth failed", "user", hello.username, "code", code)
		return
	}
	log.Info("authenticated, piping", "user", hello.username)

	// 10. Login done. Clear the deadline (sessions are long-lived) and become a dumb tube.
	_ = clientConn.SetDeadline(time.Time{})
	_ = backend.conn.SetDeadline(time.Time{})
	pipe(clientConn, backend.conn)
	log.Info("connection closed", "user", hello.username)
}

// recoverConn swallows a panic from a connection handler so one bad connection can't crash the
// proxy process. Deferred at the top of handle; logs the panic and stack for the given peer.
func recoverConn(remote string) {
	if r := recover(); r != nil {
		slog.Error("recovered from panic in connection handler",
			"remote", remote, "panic", r, "stack", string(debug.Stack()))
	}
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
