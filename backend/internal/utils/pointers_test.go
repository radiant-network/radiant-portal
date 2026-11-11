package utils

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_NilIfEmpty_Empty(t *testing.T) {
	assert.Nil(t, NilIfEmpty(""))
}

func Test_NilIfEmpty_NonEmpty(t *testing.T) {
	result := NilIfEmpty("infantile")
	assert.NotNil(t, result)
	assert.Equal(t, "infantile", *result)
}

func Test_IntPtr(t *testing.T) {
	result := IntPtr(42)
	assert.NotNil(t, result)
	assert.Equal(t, 42, *result)
}

func Test_Float32Ptr(t *testing.T) {
	result := Float32Ptr(99.5)
	assert.NotNil(t, result)
	assert.Equal(t, float32(99.5), *result)
}

func Test_TimePtr(t *testing.T) {
	value := time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC)
	result := TimePtr(value)
	assert.NotNil(t, result)
	assert.Equal(t, value, *result)
}
