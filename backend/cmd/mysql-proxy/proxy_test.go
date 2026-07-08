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

func Test_extractUsername_ReadsNullTerminatedNameAfterHeader(t *testing.T) {
	resp := append(make([]byte, 32), []byte("alice\x00trailing-junk")...)
	assert.Equal(t, "alice", extractUsername(resp))
}

func Test_extractUsername_ShortPacketYieldsEmpty(t *testing.T) {
	assert.Equal(t, "", extractUsername(make([]byte, 10)))
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
	req := buildSSLRequest(0x21)

	require.Len(t, req, 32)
	assert.NotZero(t, binary.LittleEndian.Uint32(req[0:4])&clientSSL, "CLIENT_SSL advertised")
	assert.Equal(t, byte(0x21), req[8], "charset follows the 8-byte caps+maxpacket prefix")
}

func Test_buildNativeHandshakeResponse_CarriesUsernameNativePluginAndNoSSL(t *testing.T) {
	resp := buildNativeHandshakeResponse("alice", 0x21)

	assert.Zero(t, binary.LittleEndian.Uint32(resp[0:4])&clientSSL, "client stays cleartext (no SSL)")
	assert.True(t, bytes.Contains(resp, []byte("alice\x00")), "username present and terminated")
	assert.True(t, bytes.HasSuffix(resp, []byte(nativePlugin+"\x00")), "declares native_password plugin")
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

func Test_errPacket_EncodesCodeStateAndMessage(t *testing.T) {
	out := errPacket(1045, "28000", "nope")

	assert.Equal(t, byte(0xff), out[0])
	assert.Equal(t, uint16(1045), binary.LittleEndian.Uint16(out[1:3]))
	assert.Equal(t, byte('#'), out[3])
	assert.Equal(t, "28000nope", string(out[4:]))
}
