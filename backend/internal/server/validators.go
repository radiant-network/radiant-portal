package server

import (
	"reflect"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

// notnull rejects a null entry inside an array of pointers, e.g. `"fetuses": [null]`.
//
// It exists instead of the obvious `dive,required` because swag's IsRequired() scans the whole
// binding tag and treats any `required` token as "the field itself is required" — which would
// wrongly mark optional arrays (fetuses, observations_*) as required in the generated OpenAPI spec,
// and in the TS/Python clients derived from it. With neither `required` nor `optional` in the tag,
// swag falls back to RequiredByDefault (false) and the spec stays correct.
//
// validator flags a nil pointer element before it reaches a custom function, so in practice this
// body only sees non-nil values; it is written to be correct on its own regardless.
func notnull(fl validator.FieldLevel) bool {
	switch fl.Field().Kind() {
	case reflect.Ptr, reflect.Interface, reflect.Map, reflect.Slice:
		return !fl.Field().IsNil()
	default:
		return true
	}
}

// The registration lives in an init rather than in newEngine() because handler and integration
// tests build their own routers: a `notnull` tag with no registered function panics at tag-parse
// time, so it must be registered by merely loading this package.
func init() {
	v, ok := binding.Validator.Engine().(*validator.Validate)
	if !ok {
		panic("gin binding validator is not *validator.Validate: cannot register notnull")
	}
	if err := v.RegisterValidation("notnull", notnull); err != nil {
		panic("registering the notnull validation: " + err.Error())
	}
}
