package batchval

import (
	"fmt"
	"regexp"
	"slices"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
)

type ValidationRecord interface {
	GetBase() *BaseValidationRecord
	GetResourceType() string
}

type BaseValidationRecord struct {
	Context  *BatchValidationContext
	Index    int
	Skipped  bool
	Errors   []types.BatchMessage
	Warnings []types.BatchMessage
	Infos    []types.BatchMessage
}

func (r *BaseValidationRecord) AddErrors(message string, code string, path string) {
	r.Errors = append(r.Errors, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) AddWarnings(message string, code string, path string) {
	r.Warnings = append(r.Warnings, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) AddInfos(message string, code string, path string) {
	r.Infos = append(r.Infos, types.BatchMessage{
		Code:    code,
		Message: message,
		Path:    path,
	})
}

func (r *BaseValidationRecord) FormatCasesInvalidFieldMessage(fieldName, fieldResource string) string {
	return fmt.Sprintf("Invalid field %s for %s. Reason:",
		fieldName,
		fieldResource,
	)
}

func (r *BaseValidationRecord) ValidateRegexPattern(resourceType, path, fieldName, value, code string, regExp *regexp.Regexp, resourceIds []string) {
	if regExp != nil && !regExp.MatchString(value) {
		message := FormatInvalidField(resourceType, fieldName, fmt.Sprintf("does not match the regular expression `%s`", regExp.String()), resourceIds)
		r.AddErrors(message, code, path)
	}
}

func (r *BaseValidationRecord) ValidateTextLength(resourceType, path, fieldName, value, code string, maxLength int, resourceIds []string) {
	if len(value) > maxLength {
		message := FormatInvalidField(resourceType, fieldName, fmt.Sprintf("field is too long, maximum length allowed is %d", maxLength), resourceIds)
		r.AddErrors(message, code, path)
	}
}

func (r *BaseValidationRecord) ValidateStringField(value, fieldName, path, errorCode, resourceType string, maxLength int, re *regexp.Regexp, resourceIDs []string, isRequired bool) {
	if value == "" {
		if isRequired {
			msg := FormatInvalidField(resourceType, fieldName, "field is empty", resourceIDs)
			r.AddErrors(msg, errorCode, path)
		}
		return
	}

	r.ValidateTextLength(resourceType, path, fieldName, value, errorCode, maxLength, resourceIDs)

	if re != nil {
		r.ValidateRegexPattern(resourceType, path, fieldName, value, errorCode, re, resourceIDs)
	}
}

func (r *BaseValidationRecord) ValidateCode(resourceType, path, fieldName, errorCode, value string, validCodes, resourceIds []string, required bool) {
	if value == "" && !required {
		return
	}
	if !slices.Contains(validCodes, value) {
		label := strings.ReplaceAll(fieldName, "_", " ") // Converts "status_code" to "status code"
		reason := fmt.Sprintf("%q is not a valid %s. Valid values [%s]", value, label, strings.Join(validCodes, ", "))
		message := FormatInvalidField(resourceType, fieldName, reason, resourceIds)
		r.AddErrors(message, errorCode, path)
	}
}
