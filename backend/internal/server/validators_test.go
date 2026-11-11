package server

import (
	"testing"

	"github.com/gin-gonic/gin/binding"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Local fixtures: notnull is a generic validation and must be exercised on its own, independently
// of any domain model that happens to use it.
type notnullElem struct {
	Name string `binding:"required"`
}

type notnullHolder struct {
	Elems  []*notnullElem `binding:"omitempty,dive,notnull"`
	Scalar string         `binding:"omitempty,notnull"`
}

func Test_notnull_RejectsNilElement(t *testing.T) {
	err := binding.Validator.ValidateStruct(&notnullHolder{Elems: []*notnullElem{nil}})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "Elems[0]")
}

func Test_notnull_RejectsNilElementAmongValidOnes(t *testing.T) {
	err := binding.Validator.ValidateStruct(&notnullHolder{Elems: []*notnullElem{
		{Name: "a"}, nil, {Name: "b"},
	}})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "Elems[1]")
}

func Test_notnull_AcceptsNonNilElement(t *testing.T) {
	assert.NoError(t, binding.Validator.ValidateStruct(&notnullHolder{
		Elems: []*notnullElem{{Name: "a"}},
	}))
}

func Test_notnull_AcceptsEmptySlice(t *testing.T) {
	assert.NoError(t, binding.Validator.ValidateStruct(&notnullHolder{Elems: []*notnullElem{}}))
}

func Test_notnull_AcceptsOmittedSlice(t *testing.T) {
	assert.NoError(t, binding.Validator.ValidateStruct(&notnullHolder{}))
}

// A non-nilable kind can't be null, so the tag is a no-op rather than an error.
func Test_notnull_IgnoresNonNilableKind(t *testing.T) {
	assert.NoError(t, binding.Validator.ValidateStruct(&notnullHolder{Scalar: "x"}))
}
