package mysqlproxy

import (
	"context"
	"crypto/tls"
	"errors"
	"io"
	"log/slog"
	"net"
	"runtime/debug"
	"strings"
	"sync"
	"time"
)

// Config is everything a proxy instance needs. ClientTLS is what separates a localhost
// sidecar from an endpoint humans connect to: without it the proxy strips CLIENT_SSL from
// StarRocks' handshake so clients stay cleartext (fine for a JWT on a loopback hop, and the
// only mode Go's MySQL driver can use); with it the listener terminates TLS and the client's
// secret is encrypted in transit.
type Config struct {
	BackendAddr string
	BackendTLS  *tls.Config
	ClientTLS   *tls.Config
	Auth        Authenticator
	// AuthTimeout bounds the login phase so a stalled peer can't pin a goroutine forever; it
	// is cleared once the transparent pipe starts (piped sessions are long-lived).
	AuthTimeout time.Duration
}

type Proxy struct {
	cfg Config
}

func New(cfg Config) *Proxy {
	if cfg.AuthTimeout == 0 {
		cfg.AuthTimeout = 15 * time.Second
	}
	return &Proxy{cfg: cfg}
}

// Handle performs the two-sided login translation for one client connection, then pipes.
// The numbered steps are the login script described at the top of protocol.go.
func (p *Proxy) Handle(ctx context.Context, clientConn net.Conn) {
	// Recover per connection: each runs in its own goroutine, and an unrecovered panic in any
	// goroutine crashes the whole process — one malformed connection must not take the proxy
	// down. Logged and dropped here; the deferred Close calls still run during unwinding.
	defer recoverConn(clientConn.RemoteAddr().String())
	defer func() { _ = clientConn.Close() }()
	log := slog.With("remote", clientConn.RemoteAddr().String())

	backendTCP, err := net.DialTimeout("tcp", p.cfg.BackendAddr, p.cfg.AuthTimeout)
	if err != nil {
		log.Error("backend connect failed", "error", err)
		return
	}
	defer func() { _ = backendTCP.Close() }()

	deadline := time.Now().Add(p.cfg.AuthTimeout)
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

	// 2. Forward the handshake to the client. Without a client TLS config we clear CLIENT_SSL
	//    so the client stays cleartext; with one we leave the bit set and let it upgrade.
	//    Copy first — removeCapability mutates in place.
	offered := append([]byte(nil), hs...)
	if p.cfg.ClientTLS == nil {
		offered = removeCapability(offered, clientSSL)
	}
	if err := client.write(0, offered); err != nil {
		log.Error("send handshake to client failed", "error", err)
		return
	}

	// 3. Read the client's response. When TLS is on, the client first sends a bare SSLRequest
	//    (a 32-byte header with no username); we upgrade the socket and the real
	//    HandshakeResponse41 arrives on the encrypted connection.
	seq, clientResp, err := client.read()
	if err != nil {
		log.Error("read client response failed", "error", err)
		return
	}
	if p.cfg.ClientTLS != nil && isSSLRequest(clientResp) {
		tlsClient := tls.Server(clientConn, p.cfg.ClientTLS)
		if err := tlsClient.HandshakeContext(ctx); err != nil {
			log.Error("client TLS handshake failed", "error", err)
			return
		}
		_ = tlsClient.SetDeadline(deadline)
		clientConn = tlsClient
		client.conn = tlsClient
		if seq, clientResp, err = client.read(); err != nil {
			log.Error("read client response after TLS failed", "error", err)
			return
		}
	} else if p.cfg.ClientTLS != nil {
		// The listener is TLS-capable precisely because a secret is about to cross it.
		log.Warn("client refused TLS")
		_ = client.write(seq+1, errPacket(1045, "28000", "TLS is required to connect"))
		return
	}

	hello, err := parseClientHello(clientResp)
	if err != nil {
		log.Warn("malformed client handshake response", "error", err)
		_ = client.write(seq+1, errPacket(1045, "28000", "malformed handshake response"))
		return
	}

	// 4. Ask the client to switch to cleartext so it resends its secret raw — the only auth
	//    method that lets the proxy see it (native_password never reveals the password).
	if err := client.write(seq+1, authSwitchPacket()); err != nil {
		log.Error("auth switch to client failed", "error", err)
		return
	}

	// 5. Read the secret (a cleartext-plugin payload is the value plus a trailing NUL).
	seq, secretPayload, err := client.read()
	if err != nil {
		log.Error("read client secret failed", "error", err)
		return
	}
	secret := strings.TrimRight(string(secretPayload), "\x00")

	// 6. Resolve it to a StarRocks identity + JWT. For the sidecar that's a no-op unwrap; for
	//    the gateway it is a round trip to Keycloak.
	authCtx, cancel := context.WithTimeout(ctx, p.cfg.AuthTimeout)
	starrocksUser, jwt, err := p.cfg.Auth.Authenticate(authCtx, hello.username, secret)
	cancel()
	if err != nil {
		// Log the client-supplied username, never the secret.
		log.Warn("authentication failed", "user", hello.username, "error", err)
		_ = client.write(seq+1, errPacket(1045, "28000", err.Error()))
		return
	}
	log = log.With("user", hello.username, "sub", starrocksUser)

	// 7. Tell StarRocks we want TLS (mirroring the client's capabilities so both hops agree on
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
	tlsConn := tls.Client(backendTCP, p.cfg.BackendTLS)
	if err := tlsConn.HandshakeContext(ctx); err != nil {
		log.Error("backend TLS handshake failed", "error", err)
		return
	}
	backend.conn = tlsConn

	// 8. Log in to StarRocks as the resolved sub with native_password + empty auth; it will
	//    see a JWT user and ask us to switch to the OIDC plugin.
	if err := backend.write(2, buildNativeHandshakeResponse(caps, charset, starrocksUser, hello.database)); err != nil {
		log.Error("send auth to backend failed", "error", err)
		return
	}
	backendSeq, authResult, err := backend.read()
	if err != nil {
		log.Error("read backend auth result failed", "error", err)
		return
	}

	// 9. On the AuthSwitchRequest (0xfe), send the JWT in OIDC format and read the verdict.
	if len(authResult) > 0 && authResult[0] == 0xfe {
		if plugin := authSwitchPluginName(authResult); plugin != oidcPlugin {
			// Non-JWT user (or misconfigured FE): our OIDC-formatted reply would only produce a
			// confusing backend error, so fail fast with a clear one.
			log.Error("backend requested unsupported auth plugin", "plugin", plugin)
			_ = client.write(seq+1, errPacket(1045, "28000", "backend requested unsupported auth plugin: "+plugin))
			return
		}
		if err := backend.write(backendSeq+1, buildOIDCAuthResponse([]byte(jwt))); err != nil {
			log.Error("send OIDC auth response failed", "error", err)
			return
		}
		if _, authResult, err = backend.read(); err != nil {
			log.Error("read final auth result failed", "error", err)
			return
		}
	}

	// 10. Relay StarRocks' verdict (OK or ERR) back to the client. seq is the client's
	//      auth-switch response, so its reply is seq+1 — the client tracks sequence numbers on
	//      its own hop and rejects any gap with "commands out of sync" (ErrPktSyncMul). The
	//      backend's numbering is one ahead (it also carried the SSLRequest) and must not leak here.
	if err := client.write(seq+1, authResult); err != nil {
		log.Error("forward auth result failed", "error", err)
		return
	}
	if len(authResult) > 0 && authResult[0] == 0xff { // 0xff = ERR
		code := uint16(0)
		if len(authResult) >= 3 { // ERR = 0xff + 2-byte code; guard a truncated packet
			code = uint16(authResult[1]) | uint16(authResult[2])<<8
		}
		log.Warn("backend auth failed", "code", code)
		return
	}
	log.Info("authenticated, piping")

	// 11. Login done. Clear the deadline (sessions are long-lived) and become a dumb tube.
	_ = clientConn.SetDeadline(time.Time{})
	_ = backend.conn.SetDeadline(time.Time{})
	pipe(clientConn, backend.conn)
	log.Info("connection closed")
}

// Serve accepts connections until ctx is cancelled, then drains in-flight handlers for up to
// drain before returning.
func (p *Proxy) Serve(ctx context.Context, ln net.Listener, drain time.Duration) {
	go func() {
		<-ctx.Done()
		_ = ln.Close() // unblock Accept
	}()

	var handlers sync.WaitGroup
	for {
		conn, err := ln.Accept()
		if err != nil {
			if ctx.Err() != nil {
				slog.Info("shutting down, draining connections", "timeout", drain)
				waitWithTimeout(&handlers, drain)
				return
			}
			slog.Error("accept error", "error", err)
			continue
		}
		handlers.Add(1)
		go func() {
			defer handlers.Done()
			p.Handle(ctx, conn)
		}()
	}
}

// waitWithTimeout waits for wg up to d, then gives up (long-lived piped sessions would
// otherwise block shutdown forever).
func waitWithTimeout(wg *sync.WaitGroup, d time.Duration) {
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(d):
		slog.Warn("drain timeout reached, exiting with active connections")
	}
}

// recoverConn swallows a panic from a connection handler so one bad connection can't crash the
// proxy process. Deferred at the top of Handle; logs the panic and stack for the given peer.
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
