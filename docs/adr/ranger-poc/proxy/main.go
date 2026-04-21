package main

import (
	"bytes"
	"crypto/tls"
	"encoding/binary"
	"io"
	"log"
	"net"
	"os"
	"strings"
	"sync"
)

var (
	backendAddr = getEnv("STARROCKS_ADDR", "starrocks:9030")
	listenAddr  = getEnv("LISTEN_ADDR", ":9031")
)

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

const (
	clientSSL            uint32 = 0x00000800
	clientProtocol41     uint32 = 0x00000200
	clientSecureConn     uint32 = 0x00008000
	clientPluginAuth     uint32 = 0x00080000
	clientPluginAuthLenc uint32 = 0x00200000
	clientConnectWithDB  uint32 = 0x00000008
)

// ---------------------------------------------------------------------------
// MySQL packet I/O
// ---------------------------------------------------------------------------

type packetConn struct {
	conn net.Conn
}

func (p *packetConn) read() (seq byte, data []byte, err error) {
	hdr := make([]byte, 4)
	if _, err := io.ReadFull(p.conn, hdr); err != nil {
		return 0, nil, err
	}
	length := int(uint32(hdr[0]) | uint32(hdr[1])<<8 | uint32(hdr[2])<<16)
	seq = hdr[3]
	data = make([]byte, length)
	if _, err := io.ReadFull(p.conn, data); err != nil {
		return 0, nil, err
	}
	return seq, data, nil
}

func (p *packetConn) write(seq byte, data []byte) error {
	l := len(data)
	pkt := make([]byte, 4+l)
	pkt[0] = byte(l)
	pkt[1] = byte(l >> 8)
	pkt[2] = byte(l >> 16)
	pkt[3] = seq
	copy(pkt[4:], data)
	_, err := p.conn.Write(pkt)
	return err
}

func (p *packetConn) upgradeTLS() error {
	tlsConn := tls.Client(p.conn, &tls.Config{InsecureSkipVerify: true})
	if err := tlsConn.Handshake(); err != nil {
		return err
	}
	p.conn = tlsConn
	return nil
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

func extractUsername(data []byte) string {
	if len(data) < 33 {
		return ""
	}
	rest := data[32:]
	idx := bytes.IndexByte(rest, 0)
	if idx < 0 {
		return string(rest)
	}
	return string(rest[:idx])
}

func removeCapability(handshake []byte, cap uint32) []byte {
	// HandshakeV10: after protocol_version(1) + server_version(var\0) + conn_id(4) + salt(8) + filler(1)
	// → capability_flags_low(2)
	idx := 1
	for idx < len(handshake) && handshake[idx] != 0 {
		idx++
	}
	idx++          // skip null
	idx += 4 + 8 + 1 // conn_id + salt + filler
	if idx+2 > len(handshake) {
		return handshake
	}
	// Read current capabilities low
	capLow := uint16(handshake[idx]) | uint16(handshake[idx+1])<<8
	// Modify low part
	capLow &^= uint16(cap & 0xffff)
	handshake[idx] = byte(capLow)
	handshake[idx+1] = byte(capLow >> 8)

	// High capability flags are at idx+2 (charset) + idx+3,4 (status) → idx+5,6
	highIdx := idx + 2 + 1 + 2 // charset(1) + status(2)
	if highIdx+2 <= len(handshake) {
		capHigh := uint16(handshake[highIdx]) | uint16(handshake[highIdx+1])<<8
		capHigh &^= uint16((cap >> 16) & 0xffff)
		handshake[highIdx] = byte(capHigh)
		handshake[highIdx+1] = byte(capHigh >> 8)
	}
	return handshake
}

func buildSSLRequest(charset byte) []byte {
	var buf bytes.Buffer
	caps := clientSSL | clientProtocol41 | clientSecureConn | clientPluginAuth
	binary.Write(&buf, binary.LittleEndian, caps)
	binary.Write(&buf, binary.LittleEndian, uint32(16*1024*1024))
	buf.WriteByte(charset)
	buf.Write(make([]byte, 23))
	return buf.Bytes()
}

func buildHandshakeResponse(username string, jwt []byte, charset byte) []byte {
	var buf bytes.Buffer
	caps := clientProtocol41 | clientSecureConn | clientPluginAuth
	plugin := "mysql_native_password"
	if len(jwt) > 0 {
		caps |= clientPluginAuthLenc
		plugin = "authentication_openid_connect_client"
	}
	binary.Write(&buf, binary.LittleEndian, caps)
	binary.Write(&buf, binary.LittleEndian, uint32(16*1024*1024))
	buf.WriteByte(charset)
	buf.Write(make([]byte, 23))
	buf.WriteString(username)
	buf.WriteByte(0)

	// Auth data
	if len(jwt) > 0 {
		l := len(jwt)
		if l < 251 {
			buf.WriteByte(byte(l))
		} else {
			buf.WriteByte(0xfc)
			binary.Write(&buf, binary.LittleEndian, uint16(l))
		}
		buf.Write(jwt)
	} else {
		buf.WriteByte(0) // empty auth data
	}

	buf.WriteString(plugin)
	buf.WriteByte(0)
	return buf.Bytes()
}

// buildOIDCAuthResponse builds the authentication_openid_connect_client response:
//   int<1>         capability flag (0x01)
//   string<lenenc> JWT token
func buildOIDCAuthResponse(jwt []byte) []byte {
	var buf bytes.Buffer
	buf.WriteByte(0x01) // capability flag
	l := len(jwt)
	if l < 251 {
		buf.WriteByte(byte(l))
	} else if l < 1<<16 {
		buf.WriteByte(0xfc)
		binary.Write(&buf, binary.LittleEndian, uint16(l))
	} else {
		buf.WriteByte(0xfd)
		buf.WriteByte(byte(l))
		buf.WriteByte(byte(l >> 8))
		buf.WriteByte(byte(l >> 16))
	}
	buf.Write(jwt)
	return buf.Bytes()
}

func sendErrPacket(p *packetConn, seq byte, code uint16, state, msg string) {
	var buf bytes.Buffer
	buf.WriteByte(0xff)
	binary.Write(&buf, binary.LittleEndian, code)
	buf.WriteByte('#')
	buf.WriteString(state)
	buf.WriteString(msg)
	p.write(seq, buf.Bytes())
}

func sendAuthSwitch(p *packetConn, seq byte) error {
	var buf bytes.Buffer
	buf.WriteByte(0xfe)
	buf.WriteString("mysql_clear_password")
	buf.WriteByte(0)
	return p.write(seq, buf.Bytes())
}

// ---------------------------------------------------------------------------
// Proxy handler
//
// Client ↔ Proxy: cleartext (mysql_clear_password, JWT as password)
// Proxy ↔ Backend: TLS (authentication_openid_connect_client, JWT as auth data)
// ---------------------------------------------------------------------------

func handleConnection(clientConn net.Conn) {
	defer clientConn.Close()
	addr := clientConn.RemoteAddr().String()

	// Connect to backend
	backendTCP, err := net.Dial("tcp", backendAddr)
	if err != nil {
		log.Printf("[%s] Backend connect failed: %v", addr, err)
		return
	}
	defer backendTCP.Close()
	backend := &packetConn{conn: backendTCP}

	// 1. Read handshake from backend
	_, hsData, err := backend.read()
	if err != nil {
		log.Printf("[%s] Read handshake failed: %v", addr, err)
		return
	}

	// Extract charset for later use
	charset := byte(0x21) // utf8
	{
		idx := 1
		for idx < len(hsData) && hsData[idx] != 0 {
			idx++
		}
		idx += 1 + 4 + 8 + 1 + 2 // null + conn_id + salt + filler + caps_low
		if idx < len(hsData) {
			charset = hsData[idx]
		}
	}

	// 2. Upgrade proxy→backend to TLS
	sslReq := buildSSLRequest(charset)
	if err := backend.write(1, sslReq); err != nil {
		log.Printf("[%s] Send SSL request failed: %v", addr, err)
		return
	}
	if err := backend.upgradeTLS(); err != nil {
		log.Printf("[%s] TLS upgrade failed: %v", addr, err)
		return
	}
	log.Printf("[%s] Backend TLS established", addr)

	// 3. Send modified handshake to client (remove SSL capability so client stays cleartext)
	clientHs := make([]byte, len(hsData))
	copy(clientHs, hsData)
	clientHs = removeCapability(clientHs, clientSSL)
	client := &packetConn{conn: clientConn}
	if err := client.write(0, clientHs); err != nil {
		log.Printf("[%s] Send handshake to client failed: %v", addr, err)
		return
	}

	// 4. Read client response (native_password hash — we only need the username)
	_, clientResp, err := client.read()
	if err != nil {
		log.Printf("[%s] Read client response failed: %v", addr, err)
		return
	}
	username := extractUsername(clientResp)
	log.Printf("[%s] User: %s", addr, username)

	// 5. Ask client to switch to cleartext (to get raw JWT)
	if err := sendAuthSwitch(client, 2); err != nil {
		log.Printf("[%s] Auth switch to client failed: %v", addr, err)
		return
	}

	// 6. Read raw JWT from client
	_, jwtPayload, err := client.read()
	if err != nil {
		log.Printf("[%s] Read JWT failed: %v", addr, err)
		return
	}
	jwtToken := strings.TrimRight(string(jwtPayload), "\x00")

	if !strings.HasPrefix(jwtToken, "ey") {
		log.Printf("[%s] Not a JWT (len=%d)", addr, len(jwtToken))
		sendErrPacket(client, 4, 1045, "28000", "Expected JWT as password")
		return
	}
	log.Printf("[%s] JWT: %d bytes", addr, len(jwtToken))

	// 7. Send HandshakeResponse41 to backend with native_password + empty auth.
	// StarRocks will see user has JWT auth and send AuthSwitchRequest.
	resp := buildHandshakeResponse(username, nil, charset)
	if err := backend.write(2, resp); err != nil {
		log.Printf("[%s] Send auth to backend failed: %v", addr, err)
		return
	}

	// 8. Read auth result (expecting AuthSwitchRequest to OIDC)
	seq, authResult, err := backend.read()
	if err != nil {
		log.Printf("[%s] Read auth result failed: %v", addr, err)
		return
	}

	// Handle auth switch from backend
	if len(authResult) > 0 && authResult[0] == 0xfe {
		nullIdx := bytes.IndexByte(authResult[1:], 0)
		if nullIdx >= 0 {
			plugin := string(authResult[1 : 1+nullIdx])
			log.Printf("[%s] Backend auth switch to: %s", addr, plugin)
		}
		// Build OIDC auth response: capability_flag(1) + lenenc_length + jwt_bytes
		oidcResp := buildOIDCAuthResponse([]byte(jwtToken))
		if err := backend.write(seq+1, oidcResp); err != nil {
			log.Printf("[%s] Send JWT switch response failed: %v", addr, err)
			return
		}
		seq, authResult, err = backend.read()
		if err != nil {
			log.Printf("[%s] Read final auth result failed: %v", addr, err)
			return
		}
	}

	// 9. Forward auth result to client
	if err := client.write(4, authResult); err != nil {
		log.Printf("[%s] Forward auth result failed: %v", addr, err)
		return
	}

	if len(authResult) > 0 && authResult[0] == 0xff {
		code := uint16(authResult[1]) | uint16(authResult[2])<<8
		msg := ""
		if len(authResult) > 9 {
			msg = string(authResult[9:])
		}
		log.Printf("[%s] Auth FAILED: %d %s", addr, code, msg)
		return
	}

	log.Printf("[%s] Auth OK → piping for %s", addr, username)

	// 10. Bidirectional pipe (client↔backend through TLS)
	var wg sync.WaitGroup
	wg.Add(2)
	go func() { defer wg.Done(); io.Copy(backend.conn, clientConn) }()
	go func() { defer wg.Done(); io.Copy(clientConn, backend.conn) }()
	wg.Wait()
	log.Printf("[%s] Done: %s", addr, username)
}

func main() {
	log.Printf("[mysql-proxy] %s → %s (cleartext JWT → TLS+OIDC)", listenAddr, backendAddr)
	ln, err := net.Listen("tcp", listenAddr)
	if err != nil {
		log.Fatalf("Listen failed: %v", err)
	}
	defer ln.Close()
	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Printf("Accept error: %v", err)
			continue
		}
		go handleConnection(conn)
	}
}
