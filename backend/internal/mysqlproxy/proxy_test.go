package mysqlproxy

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/binary"
	"math/big"
	"net"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// These tests drive the full login translation against a fake StarRocks, which is the only
// way to catch packet-sequence mistakes: every hop's sequence number is relative to the
// previous packet, and the TLS path inserts one extra packet on the client side.

// selfSignedTLS returns a server config and a client config that trusts it.
func selfSignedTLS(t *testing.T) (*tls.Config, *tls.Config) {
	t.Helper()
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	require.NoError(t, err)
	tmpl := x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject:      pkix.Name{CommonName: "localhost"},
		NotBefore:    time.Now().Add(-time.Hour),
		NotAfter:     time.Now().Add(time.Hour),
		DNSNames:     []string{"localhost"},
		IPAddresses:  []net.IP{net.ParseIP("127.0.0.1")},
	}
	der, err := x509.CreateCertificate(rand.Reader, &tmpl, &tmpl, &key.PublicKey, key)
	require.NoError(t, err)
	leaf, err := x509.ParseCertificate(der)
	require.NoError(t, err)

	pool := x509.NewCertPool()
	pool.AddCert(leaf)
	return &tls.Config{
			MinVersion:   tls.VersionTLS12,
			Certificates: []tls.Certificate{{Certificate: [][]byte{der}, PrivateKey: key, Leaf: leaf}},
		}, &tls.Config{
			MinVersion: tls.VersionTLS12,
			RootCAs:    pool,
			ServerName: "localhost",
		}
}

// backendResult is what the fake StarRocks observed during a login.
type backendResult struct {
	username string
	database string
	jwt      string
	err      error
}

// fakeStarrocks plays the server side of the JWT login: handshake advertising TLS, TLS
// upgrade, then an AuthSwitchRequest to the OIDC plugin, then OK.
func fakeStarrocks(t *testing.T, srvTLS *tls.Config) (addr string, results <-chan backendResult) {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)
	t.Cleanup(func() { _ = ln.Close() })

	out := make(chan backendResult, 1)
	go func() {
		conn, err := ln.Accept()
		if err != nil {
			out <- backendResult{err: err}
			return
		}
		defer func() { _ = conn.Close() }()
		var res backendResult
		pc := &packetConn{conn: conn}

		// Advertise CLIENT_SSL so the proxy will upgrade.
		if err := pc.write(0, testHandshake(uint16(clientSSL|clientProtocol41), uint16((clientPluginAuth)>>16), 0x21)); err != nil {
			out <- backendResult{err: err}
			return
		}
		if _, _, err := pc.read(); err != nil { // SSLRequest
			out <- backendResult{err: err}
			return
		}
		tlsConn := tls.Server(conn, srvTLS)
		if err := tlsConn.Handshake(); err != nil {
			out <- backendResult{err: err}
			return
		}
		pc.conn = tlsConn

		_, resp, err := pc.read() // HandshakeResponse41 (native_password, empty auth)
		if err != nil {
			out <- backendResult{err: err}
			return
		}
		hello, err := parseClientHello(resp)
		if err != nil {
			out <- backendResult{err: err}
			return
		}
		res.username, res.database = hello.username, hello.database

		// "This is a JWT user" — switch to the OIDC plugin.
		switchPkt := append([]byte{0xfe}, oidcPlugin...)
		if err := pc.write(3, append(switchPkt, 0)); err != nil {
			out <- backendResult{err: err}
			return
		}
		_, authResp, err := pc.read()
		if err != nil {
			out <- backendResult{err: err}
			return
		}
		// 0x01 capability byte + length-encoded JWT.
		if len(authResp) > 2 {
			n, consumed := readLenEncInt(authResp[1:])
			if consumed > 0 && 1+consumed+n <= len(authResp) {
				res.jwt = string(authResp[1+consumed : 1+consumed+n])
			}
		}
		_ = pc.write(5, []byte{0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00}) // OK
		out <- res
	}()
	return ln.Addr().String(), out
}

// clientLogin plays the client side: optional TLS upgrade, handshake response, then the
// cleartext secret. Returns the final packet the proxy sent back.
func clientLogin(t *testing.T, addr, username, secret string, clientTLS *tls.Config) []byte {
	t.Helper()
	conn, err := net.Dial("tcp", addr)
	require.NoError(t, err)
	t.Cleanup(func() { _ = conn.Close() })
	_ = conn.SetDeadline(time.Now().Add(10 * time.Second))

	pc := &packetConn{conn: conn}
	_, hs, err := pc.read() // server handshake
	require.NoError(t, err)

	caps := clientProtocol41 | clientSecureConn | clientPluginAuth
	seq := byte(1)
	if clientTLS != nil {
		require.NotZero(t, serverCapabilities(hs)&clientSSL, "proxy should advertise CLIENT_SSL when TLS is configured")
		require.NoError(t, pc.write(1, buildSSLRequest(caps, 0x21)))
		tlsConn := tls.Client(conn, clientTLS)
		require.NoError(t, tlsConn.Handshake())
		pc.conn = tlsConn
		seq = 2
	} else {
		require.Zero(t, serverCapabilities(hs)&clientSSL, "proxy should strip CLIENT_SSL when no TLS is configured")
	}

	require.NoError(t, pc.write(seq, testClientHello(caps, 0x21, username, []byte{}, "")))

	_, sw, err := pc.read() // AuthSwitchRequest -> mysql_clear_password
	require.NoError(t, err)
	require.Equal(t, clearPlugin, authSwitchPluginName(sw))

	require.NoError(t, pc.write(seq+2, append([]byte(secret), 0)))
	_, final, err := pc.read()
	require.NoError(t, err)
	return final
}

func startProxy(t *testing.T, cfg Config) string {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)
	t.Cleanup(func() { _ = ln.Close() })

	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	go New(cfg).Serve(ctx, ln, time.Second)
	return ln.Addr().String()
}

func Test_Proxy_JWTPassthrough_LogsInAsTheTokenSubject(t *testing.T) {
	srvTLS, clientTLS := selfSignedTLS(t)
	backendAddr, results := fakeStarrocks(t, srvTLS)

	proxyAddr := startProxy(t, Config{
		BackendAddr: backendAddr,
		BackendTLS:  clientTLS,
		Auth:        JWTPassthrough{},
		AuthTimeout: 5 * time.Second,
	})

	token := testJWT("sub-from-token")
	final := clientLogin(t, proxyAddr, "ignored-handle", token, nil)

	assert.NotEqual(t, byte(0xff), final[0], "expected OK, got ERR")
	res := <-results
	require.NoError(t, res.err)
	assert.Equal(t, "sub-from-token", res.username, "StarRocks must see the sub, not the client's handle")
	assert.Equal(t, token, res.jwt)
}

func Test_Proxy_PasswordExchange_ExchangesPasswordAndLogsInAsSub(t *testing.T) {
	srvTLS, backendClientTLS := selfSignedTLS(t)
	listenerTLS, clientTLS := selfSignedTLS(t)
	backendAddr, results := fakeStarrocks(t, srvTLS)

	stub := &stubExchanger{token: testJWT("sub-of-alice")}
	proxyAddr := startProxy(t, Config{
		BackendAddr: backendAddr,
		BackendTLS:  backendClientTLS,
		ClientTLS:   listenerTLS,
		Auth:        PasswordExchange{Tokens: stub},
		AuthTimeout: 5 * time.Second,
	})

	final := clientLogin(t, proxyAddr, "alice", "hunter2", clientTLS)

	assert.NotEqual(t, byte(0xff), final[0], "expected OK, got ERR")
	assert.Equal(t, "alice", stub.gotUsername)
	assert.Equal(t, "hunter2", stub.gotPassword)
	res := <-results
	require.NoError(t, res.err)
	assert.Equal(t, "sub-of-alice", res.username)
	assert.Equal(t, stub.token, res.jwt)
}

func Test_Proxy_PasswordExchange_ReturnsErrPacketOnBadCredentials(t *testing.T) {
	srvTLS, backendClientTLS := selfSignedTLS(t)
	listenerTLS, clientTLS := selfSignedTLS(t)
	backendAddr, _ := fakeStarrocks(t, srvTLS)

	stub := &stubExchanger{err: assert.AnError}
	proxyAddr := startProxy(t, Config{
		BackendAddr: backendAddr,
		BackendTLS:  backendClientTLS,
		ClientTLS:   listenerTLS,
		Auth:        PasswordExchange{Tokens: stub},
		AuthTimeout: 5 * time.Second,
	})

	final := clientLogin(t, proxyAddr, "alice", "wrong", clientTLS)

	require.Equal(t, byte(0xff), final[0], "expected an ERR packet")
	code := binary.LittleEndian.Uint16(final[1:3])
	assert.Equal(t, uint16(1045), code)
	assert.Contains(t, string(final), "invalid username or password")
}
