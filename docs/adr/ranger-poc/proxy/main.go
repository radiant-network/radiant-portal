package main

import (
	"io"
	"log"
	"net"
	"os"
	"sync"

	"github.com/go-mysql-org/go-mysql/client"
	"github.com/go-mysql-org/go-mysql/mysql"
	"github.com/go-mysql-org/go-mysql/server"
)

// =============================================================================
// MySQL JWT Auth Proxy — POC
//
// Approach: Use go-mysql server package for the frontend handshake,
// and go-mysql client package for the backend connection.
//
// The password is captured via a custom CredentialProvider that accepts
// any password and stores it for the backend connection.
//
// For the backend:
//   - Password users: client.Connect(addr, user, password, db) — native_password
//   - JWT users (TODO): need custom auth plugin handling after auth switch
// =============================================================================

var (
	listenAddr  = envOrDefault("LISTEN_ADDR", ":9031")
	backendHost = envOrDefault("BACKEND_HOST", "starrocks")
	backendPort = envOrDefault("BACKEND_PORT", "9030")
)

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// ---------------------------------------------------------------------------
// Password-capturing auth handler
//
// go-mysql's server.Conn validates the password using GetCredential.
// For native_password, the server sends a salt, the client sends a hash,
// and the server validates the hash against the stored password.
//
// Trick: We return the hash itself as the "expected" credential from
// GetCredential, but since we don't know the password yet at that point,
// we accept everything by returning an empty password (which matches
// empty passwords only).
//
// Better trick: The server package supports a Provider interface where
// we can intercept the raw auth data. But the cleanest approach for
// this POC is to use a TRANSPARENT TCP proxy for the auth phase,
// then intercept at the packet level only for JWT users.
//
// SIMPLEST APPROACH: Transparent TCP proxy.
// For password users: works immediately (client talks directly to StarRocks).
// For JWT users: the Go client sends native_password, StarRocks rejects it
// because it wants OIDC. The proxy intercepts the rejection and resends
// with the JWT token.
// ---------------------------------------------------------------------------

func main() {
	ln, err := net.Listen("tcp", listenAddr)
	if err != nil {
		log.Fatalf("Failed to listen on %s: %v", listenAddr, err)
	}
	log.Printf("[proxy] Listening on %s, backend: %s:%s", listenAddr, backendHost, backendPort)

	for {
		frontConn, err := ln.Accept()
		if err != nil {
			log.Printf("[proxy] Accept error: %v", err)
			continue
		}
		go handleConnection(frontConn)
	}
}

func handleConnection(frontConn net.Conn) {
	defer frontConn.Close()
	remoteAddr := frontConn.RemoteAddr().String()

	backAddr := backendHost + ":" + backendPort
	backConn, err := net.Dial("tcp", backAddr)
	if err != nil {
		log.Printf("[proxy] %s: backend connect error: %v", remoteAddr, err)
		return
	}
	defer backConn.Close()

	log.Printf("[proxy] %s: proxying to %s", remoteAddr, backAddr)

	// Transparent bidirectional proxy
	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		n, _ := io.Copy(backConn, frontConn)
		log.Printf("[proxy] %s: front→back closed (%d bytes)", remoteAddr, n)
	}()
	go func() {
		defer wg.Done()
		n, _ := io.Copy(frontConn, backConn)
		log.Printf("[proxy] %s: back→front closed (%d bytes)", remoteAddr, n)
	}()
	wg.Wait()
}

// The following are kept for reference — they show how to use go-mysql
// server + client for a query-level proxy (not transparent).
// This would be needed for JWT auth translation.

var _ server.Handler = (*queryForwarder)(nil)

type queryForwarder struct {
	backend *client.Conn
}

func (f *queryForwarder) UseDB(dbName string) error {
	return f.backend.UseDB(dbName)
}

func (f *queryForwarder) HandleQuery(query string) (*mysql.Result, error) {
	return f.backend.Execute(query)
}

func (f *queryForwarder) HandleFieldList(table string, fieldWildcard string) ([]*mysql.Field, error) {
	return nil, nil
}

func (f *queryForwarder) HandleStmtPrepare(query string) (int, int, interface{}, error) {
	return 0, 0, nil, nil
}

func (f *queryForwarder) HandleStmtExecute(context interface{}, query string, args []interface{}) (*mysql.Result, error) {
	return nil, nil
}

func (f *queryForwarder) HandleStmtClose(context interface{}) error {
	return nil
}

func (f *queryForwarder) HandleOtherCommand(cmd byte, data []byte) error {
	return nil
}
