package main

import (
	"bytes"
	"encoding/binary"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// testHandshake builds a minimal HandshakeV10 packet with the given capability words and
// charset, matching the field layout removeCapability/charsetFromHandshake walk.
func testHandshake(capLow, capHigh uint16, charset byte) []byte {
	h := make([]byte, 27)
	h[0] = 0x0a          // protocol_version
	copy(h[1:], "8.0.0") // server_version (bytes 1..5)
	h[6] = 0             // NUL terminator
	// bytes 7..10 conn_id, 11..18 salt, 19 filler (left zero)
	binary.LittleEndian.PutUint16(h[20:], capLow) // capability_flags_low
	h[22] = charset
	// bytes 23..24 status
	binary.LittleEndian.PutUint16(h[25:], capHigh) // capability_flags_high
	return h
}

// testClientHello builds a HandshakeResponse41 payload: caps + max_packet + charset + 23
// reserved bytes, username NUL, 1-byte-length auth response, then optional database NUL.
func testClientHello(caps uint32, charset byte, username string, auth []byte, database string) []byte {
	b := binary.LittleEndian.AppendUint32(nil, caps)
	b = binary.LittleEndian.AppendUint32(b, maxPacket)
	b = append(b, charset)
	b = append(b, make([]byte, 23)...)
	b = append(b, username...)
	b = append(b, 0)
	b = append(b, byte(len(auth)))
	b = append(b, auth...)
	if caps&clientConnectWithDB != 0 {
		b = append(b, database...)
		b = append(b, 0)
	}
	return b
}

func Test_parseClientHello_ReadsCapsCharsetAndUsername(t *testing.T) {
	resp := testClientHello(clientProtocol41|clientSecureConn, 0x2d, "alice", []byte{1, 2, 3}, "")

	h, err := parseClientHello(resp)

	require.NoError(t, err)
	assert.Equal(t, clientProtocol41|clientSecureConn, h.caps)
	assert.Equal(t, byte(0x2d), h.charset)
	assert.Equal(t, "alice", h.username)
	assert.Empty(t, h.database)
}

func Test_parseClientHello_ReadsDatabaseWhenConnectWithDB(t *testing.T) {
	resp := testClientHello(clientSecureConn|clientConnectWithDB, 0x21, "alice", nil, "radiant")

	h, err := parseClientHello(resp)

	require.NoError(t, err)
	assert.Equal(t, "radiant", h.database)
}

func Test_parseClientHello_SkipsLenEncAuthResponse(t *testing.T) {
	// go-sql-driver switches to a length-encoded auth response for long auth data.
	caps := clientSecureConn | clientPluginAuthLenEnc | clientConnectWithDB
	b := binary.LittleEndian.AppendUint32(nil, caps)
	b = binary.LittleEndian.AppendUint32(b, maxPacket)
	b = append(b, 0x21)
	b = append(b, make([]byte, 23)...)
	b = append(b, "alice"...)
	b = append(b, 0)
	b = appendLenEncInt(b, 300)
	b = append(b, bytes.Repeat([]byte{0xaa}, 300)...)
	b = append(b, "radiant\x00"...)

	h, err := parseClientHello(b)

	require.NoError(t, err)
	assert.Equal(t, "alice", h.username)
	assert.Equal(t, "radiant", h.database)
}

func Test_parseClientHello_ShortPacketErrors(t *testing.T) {
	_, err := parseClientHello(make([]byte, 10))
	assert.Error(t, err)
}

func Test_parseClientHello_TruncatedAuthResponseErrors(t *testing.T) {
	resp := testClientHello(clientSecureConn, 0x21, "alice", nil, "")
	resp[len(resp)-1] = 200 // auth-response length points past the packet end

	_, err := parseClientHello(resp)

	assert.Error(t, err)
}

func Test_readLenEncInt_DecodesEachLengthClass(t *testing.T) {
	for _, want := range []int{10, 300, 70000} {
		got, consumed := readLenEncInt(appendLenEncInt(nil, want))
		assert.Equal(t, want, got)
		assert.NotZero(t, consumed)
	}
	_, consumed := readLenEncInt([]byte{0xfc}) // truncated 2-byte length
	assert.Zero(t, consumed)
}

func Test_removeCapability_ClearsSSLBitAndPreservesOthers(t *testing.T) {
	hs := testHandshake(uint16(clientSSL|clientProtocol41), 0x00f0, 0x21)

	out := removeCapability(hs, clientSSL)

	capLow := binary.LittleEndian.Uint16(out[20:])
	assert.Zero(t, capLow&uint16(clientSSL), "SSL bit cleared")
	assert.NotZero(t, capLow&uint16(clientProtocol41), "PROTOCOL41 bit preserved")
	assert.Equal(t, uint16(0x00f0), binary.LittleEndian.Uint16(out[25:]), "high word untouched (SSL is low-only)")
}

func Test_charsetFromHandshake_ReadsCharsetByte(t *testing.T) {
	assert.Equal(t, byte(0x21), charsetFromHandshake(testHandshake(0, 0, 0x21)))
}

func Test_charsetFromHandshake_ShortPacketDefaultsToUtf8(t *testing.T) {
	assert.Equal(t, byte(0x21), charsetFromHandshake([]byte{0x0a, 0x00}))
}

func Test_buildSSLRequest_SetsSSLCapabilityAndCharset(t *testing.T) {
	req := buildSSLRequest(clientProtocol41|clientSecureConn|clientPluginAuth, 0x21)

	require.Len(t, req, 32)
	assert.NotZero(t, binary.LittleEndian.Uint32(req[0:4])&clientSSL, "CLIENT_SSL advertised")
	assert.Equal(t, byte(0x21), req[8], "charset follows the 8-byte caps+maxpacket prefix")
}

func Test_buildNativeHandshakeResponse_CarriesUsernameNativePluginAndNoSSL(t *testing.T) {
	caps := backendCaps(clientProtocol41, "")

	resp := buildNativeHandshakeResponse(caps, 0x21, "alice", "")

	assert.Zero(t, binary.LittleEndian.Uint32(resp[0:4])&clientSSL, "client stays cleartext (no SSL)")
	assert.True(t, bytes.Contains(resp, []byte("alice\x00")), "username present and terminated")
	assert.True(t, bytes.HasSuffix(resp, []byte(nativePlugin+"\x00")), "declares native_password plugin")
}

func Test_buildNativeHandshakeResponse_ForwardsDatabase(t *testing.T) {
	caps := backendCaps(clientProtocol41|clientConnectWithDB, "radiant")

	resp := buildNativeHandshakeResponse(caps, 0x21, "alice", "radiant")

	assert.NotZero(t, binary.LittleEndian.Uint32(resp[0:4])&clientConnectWithDB)
	assert.True(t, bytes.Contains(resp, []byte("alice\x00\x00radiant\x00")),
		"database follows the empty auth response, before the plugin name")
}

func Test_backendCaps_MirrorsClientAndStripsProxyHandledBits(t *testing.T) {
	clientAsked := clientProtocol41 | clientSSL | clientPluginAuthLenEnc | clientConnectAttrs |
		clientConnectWithDB | 0x00010000 // arbitrary extra bit (e.g. MULTI_STATEMENTS) must survive

	caps := backendCaps(clientAsked, "radiant")

	assert.Zero(t, caps&(clientSSL|clientPluginAuthLenEnc|clientConnectAttrs), "proxy-handled bits stripped")
	assert.NotZero(t, caps&0x00010000, "client's other capability bits forwarded")
	assert.NotZero(t, caps&clientConnectWithDB, "CONNECT_WITH_DB kept when a database is present")
	assert.NotZero(t, caps&(clientProtocol41|clientSecureConn|clientPluginAuth), "proxy minimum always set")
}

func Test_backendCaps_DropsConnectWithDBWhenNoDatabase(t *testing.T) {
	assert.Zero(t, backendCaps(clientConnectWithDB, "")&clientConnectWithDB)
}

func Test_serverCapabilities_ReassemblesLowAndHighWords(t *testing.T) {
	hs := testHandshake(uint16(clientSSL|clientProtocol41), uint16(clientPluginAuth>>16), 0x21)

	caps := serverCapabilities(hs)

	assert.NotZero(t, caps&clientSSL)
	assert.NotZero(t, caps&clientProtocol41)
	assert.NotZero(t, caps&clientPluginAuth, "high word reassembled into bits 16-31")
}

func Test_serverCapabilities_TruncatedPacketYieldsZero(t *testing.T) {
	assert.Zero(t, serverCapabilities([]byte{0x0a, 0x00}))
}

func Test_authSwitchPluginName_ExtractsNulTerminatedName(t *testing.T) {
	pkt := append([]byte{0xfe}, oidcPlugin+"\x00plugin-data"...)
	assert.Equal(t, oidcPlugin, authSwitchPluginName(pkt))
}

func Test_buildOIDCAuthResponse_SmallToken(t *testing.T) {
	out := buildOIDCAuthResponse([]byte("ey.abc"))

	require.Equal(t, byte(0x01), out[0], "required OIDC capability flag")
	assert.Equal(t, byte(6), out[1], "length-encoded length for a <251-byte token")
	assert.Equal(t, "ey.abc", string(out[2:]))
}

func Test_buildOIDCAuthResponse_RealisticTokenUsesTwoByteLength(t *testing.T) {
	jwt := bytes.Repeat([]byte("a"), 300) // real JWTs exceed the 1-byte length limit

	out := buildOIDCAuthResponse(jwt)

	require.Equal(t, byte(0x01), out[0])
	require.Equal(t, byte(0xfc), out[1], "0xfc marks a 2-byte length")
	assert.Equal(t, uint16(300), binary.LittleEndian.Uint16(out[2:4]))
	assert.True(t, bytes.Equal(out[4:], jwt))
}

func Test_appendLenEncInt_EncodesByLengthClass(t *testing.T) {
	assert.Equal(t, []byte{10}, appendLenEncInt(nil, 10))
	assert.Equal(t, []byte{0xfc, 0x2c, 0x01}, appendLenEncInt(nil, 300))
	assert.Equal(t, []byte{0xfd, 0x70, 0x11, 0x01}, appendLenEncInt(nil, 70000))
}

func Test_authSwitchPacket_RequestsClearPassword(t *testing.T) {
	assert.Equal(t, append([]byte{0xfe}, append([]byte(clearPlugin), 0)...), authSwitchPacket())
}

func Test_recoverConn_ContainsPanicSoTheProxySurvives(t *testing.T) {
	// A panic in a connection handler must be swallowed (each runs in its own goroutine, so an
	// unrecovered panic would crash the whole process). Deferring recoverConn contains it.
	assert.NotPanics(t, func() {
		defer recoverConn("test-remote")
		panic("boom in handler")
	})
}

func Test_errPacket_EncodesCodeStateAndMessage(t *testing.T) {
	out := errPacket(1045, "28000", "nope")

	assert.Equal(t, byte(0xff), out[0])
	assert.Equal(t, uint16(1045), binary.LittleEndian.Uint16(out[1:3]))
	assert.Equal(t, byte('#'), out[3])
	assert.Equal(t, "28000nope", string(out[4:]))
}
