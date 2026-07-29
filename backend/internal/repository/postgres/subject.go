package postgres

import (
	"errors"
	"fmt"
)

// ErrInvalidSubject mirrors the *_subject_xor CHECK constraints: a clinical row belongs to the
// mother or to one of her fetuses, never both or neither.
var ErrInvalidSubject = errors.New("invalid subject: exactly one of patient/fetus must be set")

// ErrNilRecord keeps a nil argument an error rather than a panic in the subject guard, which
// runs before GORM would have rejected it.
var ErrNilRecord = errors.New("nil record")

// validateSubjectXOR guards the Create* entry points rather than each caller, so a new writer of
// family / obs_categorical / obs_string rows can't bypass it and hit the CHECK as a raw PG error.
func validateSubjectXOR(patientID, fetusID *int) error {
	if (patientID != nil) == (fetusID != nil) {
		return fmt.Errorf("%w (patient_id=%v, fetus_id=%v)", ErrInvalidSubject, deref(patientID), deref(fetusID))
	}
	return nil
}

func deref(v *int) any {
	if v == nil {
		return nil
	}
	return *v
}
