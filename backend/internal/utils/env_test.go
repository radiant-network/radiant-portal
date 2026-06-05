package utils

import (
	"os"
	"testing"
)

func Test_GetEnvOrDefault_Exists(t *testing.T) {
	key := "TEST_ENV_KEY_EXISTS"
	expectedValue := "expected_value"
	os.Setenv(key, expectedValue)
	defer os.Unsetenv(key)

	value := GetEnvOrDefault(key, "fallback_value")
	if value != expectedValue {
		t.Errorf("Expected %s but got %s", expectedValue, value)
	}
}

func Test_GetEnvOrDefault_NotExists(t *testing.T) {
	key := "TEST_ENV_KEY_NOT_EXISTS"
	fallbackValue := "fallback_value"
	os.Unsetenv(key)

	value := GetEnvOrDefault(key, fallbackValue)
	if value != fallbackValue {
		t.Errorf("Expected %s but got %s", fallbackValue, value)
	}
}

func Test_GetEnvOrDefault_EmptyValue(t *testing.T) {
	key := "TEST_ENV_KEY_EMPTY"
	fallbackValue := "fallback_value"
	os.Setenv(key, "")
	defer os.Unsetenv(key)

	value := GetEnvOrDefault(key, fallbackValue)
	if value != fallbackValue {
		t.Errorf("Expected %s but got %s", fallbackValue, value)
	}
}

func Test_GetBoolEnvOrDefault_ParsesTrueForms(t *testing.T) {
	key := "TEST_BOOL_ENV_TRUE"
	defer os.Unsetenv(key)
	for _, v := range []string{"true", "True", "TRUE", "1", "t"} {
		os.Setenv(key, v)
		if !GetBoolEnvOrDefault(key, false) {
			t.Errorf("Expected %q to parse as true", v)
		}
	}
}

func Test_GetBoolEnvOrDefault_ParsesFalseForms(t *testing.T) {
	key := "TEST_BOOL_ENV_FALSE"
	defer os.Unsetenv(key)
	for _, v := range []string{"false", "False", "FALSE", "0", "f"} {
		os.Setenv(key, v)
		if GetBoolEnvOrDefault(key, true) {
			t.Errorf("Expected %q to parse as false", v)
		}
	}
}

func Test_GetBoolEnvOrDefault_NotExistsReturnsFallback(t *testing.T) {
	key := "TEST_BOOL_ENV_NOT_EXISTS"
	os.Unsetenv(key)
	if !GetBoolEnvOrDefault(key, true) {
		t.Errorf("Expected fallback true when unset")
	}
	if GetBoolEnvOrDefault(key, false) {
		t.Errorf("Expected fallback false when unset")
	}
}

func Test_GetBoolEnvOrDefault_UnparseableReturnsFallback(t *testing.T) {
	key := "TEST_BOOL_ENV_GARBAGE"
	os.Setenv(key, "enabled")
	defer os.Unsetenv(key)
	if !GetBoolEnvOrDefault(key, true) {
		t.Errorf("Expected fallback true for unparseable value")
	}
	if GetBoolEnvOrDefault(key, false) {
		t.Errorf("Expected fallback false for unparseable value")
	}
}

func Test_GetEnvOrPanic_Exists(t *testing.T) {
	key := "TEST_ENV_KEY_PANIC_EXISTS"
	expectedValue := "expected_value"
	os.Setenv(key, expectedValue)
	defer os.Unsetenv(key)

	value := GetEnvOrPanic(key)
	if value != expectedValue {
		t.Errorf("Expected %s but got %s", expectedValue, value)
	}
}

func Test_GetEnvOrPanic_NotExists(t *testing.T) {
	key := "TEST_ENV_KEY_PANIC_NOT_EXISTS"
	os.Unsetenv(key)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic but did not get one")
		}
	}()

	_ = GetEnvOrPanic(key)
}

func Test_GetEnvOrPanic_EmptyValue(t *testing.T) {
	key := "TEST_ENV_KEY_PANIC_EMPTY"
	os.Setenv(key, "")
	defer os.Unsetenv(key)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Expected panic but did not get one")
		}
	}()

	_ = GetEnvOrPanic(key)
}
