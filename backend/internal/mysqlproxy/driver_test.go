package mysqlproxy

import (
	"crypto/tls"
	"database/sql"
	"encoding/binary"
	"net"
	"testing"
	"time"

	gomysql "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/require"
)

// These tests drive a real go-sql-driver client through the proxy. The hand-rolled client in
// proxy_test.go reads packets without validating their sequence numbers, so it cannot catch a
// mis-numbered reply; the real driver rejects any gap with ErrPktSyncMul ("commands out of
// sync"), which is what a mis-numbered auth result looked like in production.

// realHandshake builds a full HandshakeV10 packet. testHandshake stops after the capability
// words — enough for the offset helpers, but the real driver also parses the auth-plugin-data
// length, the second salt part, and the plugin name.
func realHandshake() []byte {
	caps := clientProtocol41 | clientSSL | clientPluginAuth | clientSecureConn
	b := []byte{0x0a}
	b = append(b, "8.0.0"...)
	b = append(b, 0)
	b = append(b, 1, 0, 0, 0)             // connection_id
	b = append(b, 1, 2, 3, 4, 5, 6, 7, 8) // auth-plugin-data part 1
	b = append(b, 0)                      // filler
	b = binary.LittleEndian.AppendUint16(b, uint16(caps))
	b = append(b, 0x21)       // charset
	b = append(b, 0x02, 0x00) // status flags
	b = binary.LittleEndian.AppendUint16(b, uint16(caps>>16))
	b = append(b, 21)                                               // length of auth-plugin-data
	b = append(b, make([]byte, 10)...)                              // reserved
	b = append(b, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0) // part 2, NUL-terminated
	b = append(b, nativePlugin...)
	return append(b, 0)
}

var okPacket = []byte{0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00}

// servingFakeStarrocks is fakeStarrocks extended to stay up after login and answer every
// command with OK, so a client can complete a Ping through the finished pipe.
func servingFakeStarrocks(t *testing.T, srvTLS *tls.Config) string {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)
	t.Cleanup(func() { _ = ln.Close() })

	go func() {
		for {
			conn, err := ln.Accept()
			if err != nil {
				return
			}
			go serveFakeLogin(conn, srvTLS)
		}
	}()
	return ln.Addr().String()
}

func serveFakeLogin(conn net.Conn, srvTLS *tls.Config) {
	defer func() { _ = conn.Close() }()
	pc := &packetConn{conn: conn}

	if err := pc.write(0, realHandshake()); err != nil {
		return
	}
	if _, _, err := pc.read(); err != nil { // SSLRequest
		return
	}
	tlsConn := tls.Server(conn, srvTLS)
	if err := tlsConn.Handshake(); err != nil {
		return
	}
	pc.conn = tlsConn
	if _, _, err := pc.read(); err != nil { // HandshakeResponse41
		return
	}
	if err := pc.write(3, append(append([]byte{0xfe}, oidcPlugin...), 0)); err != nil { // switch to OIDC
		return
	}
	if _, _, err := pc.read(); err != nil { // JWT
		return
	}
	if err := pc.write(5, okPacket); err != nil {
		return
	}
	for { // command phase
		if _, _, err := pc.read(); err != nil {
			return
		}
		if err := pc.write(1, okPacket); err != nil {
			return
		}
	}
}

func driverConfig(addr string) *gomysql.Config {
	cfg := gomysql.NewConfig()
	cfg.User = "sub-from-token"
	cfg.Passwd = testJWT("sub-from-token")
	cfg.Net = "tcp"
	cfg.Addr = addr
	cfg.DBName = "radiant_tenant"
	cfg.AllowCleartextPasswords = true
	cfg.InterpolateParams = true
	return cfg
}

func pingThroughProxy(t *testing.T, cfg *gomysql.Config) error {
	t.Helper()
	db, err := sql.Open("mysql", cfg.FormatDSN())
	require.NoError(t, err)
	t.Cleanup(func() { _ = db.Close() })
	return db.Ping()
}

// Sidecar mode (cmd/mysql-proxy): the API's per-user StarRocks pool, cleartext on the client hop.
func Test_Proxy_RealDriver_CompletesLoginOverPlaintextClientHop(t *testing.T) {
	srvTLS, clientTLS := selfSignedTLS(t)
	proxyAddr := startProxy(t, Config{
		BackendAddr: servingFakeStarrocks(t, srvTLS),
		BackendTLS:  clientTLS,
		Auth:        JWTPassthrough{},
		AuthTimeout: 5 * time.Second,
	})

	require.NoError(t, pingThroughProxy(t, driverConfig(proxyAddr)))
}

// Gateway mode (cmd/mysql-gateway): the client hop is TLS, which adds one packet to the client's
// sequence — the auth result must still be numbered against the client's own hop.
func Test_Proxy_RealDriver_CompletesLoginOverTLSClientHop(t *testing.T) {
	srvTLS, backendClientTLS := selfSignedTLS(t)
	listenerTLS, clientTLS := selfSignedTLS(t)
	proxyAddr := startProxy(t, Config{
		BackendAddr: servingFakeStarrocks(t, srvTLS),
		BackendTLS:  backendClientTLS,
		ClientTLS:   listenerTLS,
		Auth:        PasswordExchange{Tokens: &stubExchanger{token: testJWT("sub-of-alice")}},
		AuthTimeout: 5 * time.Second,
	})

	require.NoError(t, gomysql.RegisterTLSConfig(t.Name(), clientTLS))
	t.Cleanup(func() { gomysql.DeregisterTLSConfig(t.Name()) })
	cfg := driverConfig(proxyAddr)
	cfg.TLSConfig = t.Name()
	cfg.User = "alice"
	cfg.Passwd = "hunter2"

	require.NoError(t, pingThroughProxy(t, cfg))
}
