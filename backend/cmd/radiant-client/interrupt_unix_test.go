//go:build !windows

package main

import (
	"bytes"
	"context"
	"syscall"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Interruptible_CancelsOnSignal(t *testing.T) {
	var msg bytes.Buffer
	ctx, stop := interruptible(context.Background(), &msg)
	defer stop()
	require.NoError(t, syscall.Kill(syscall.Getpid(), syscall.SIGINT))
	select {
	case <-ctx.Done():
	case <-time.After(2 * time.Second):
		t.Fatal("context not cancelled after SIGINT")
	}
	assert.Contains(t, msg.String(), "Stopping... (Ctrl-C again to force quit)")
}

func Test_Interruptible_StopWithoutSignalCancelsQuietly(t *testing.T) {
	var msg bytes.Buffer
	ctx, stop := interruptible(context.Background(), &msg)
	stop()
	<-ctx.Done()
	assert.Empty(t, msg.String())
}
