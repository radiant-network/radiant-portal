package validation

import (
	"fmt"
	"strings"
)

func FormatPath(r ValidationRecord, fieldName string) string {
	if fieldName == "" {
		return fmt.Sprintf("%s[%d]", r.GetResourceType(), r.GetBase().Index)
	}
	return fmt.Sprintf("%s[%d].%s", r.GetResourceType(), r.GetBase().Index, fieldName)
}

func FormatIds(resourceIds []string) string {
	formatResourceIds := ""
	if len(resourceIds) > 0 {
		formatResourceIds = fmt.Sprintf("(%s)", strings.Join(resourceIds, " / "))
	}
	return formatResourceIds
}

func FormatInvalidField(r ValidationRecord, fieldName string, reason string, ids []string) string {
	formatResourceIds := FormatIds(ids)
	invalidFieldMessage := strings.TrimSpace(fmt.Sprintf("Invalid field %s for %s %s", fieldName, r.GetResourceType(), formatResourceIds))
	reasonMessage := fmt.Sprintf("Reason: %s", reason)
	message := strings.TrimSpace(fmt.Sprintf("%s. %s.", invalidFieldMessage, reasonMessage))
	return message
}

func FormatFieldTooLong(r ValidationRecord, fieldName string, maxLength int, ids []string) string {
	reason := fmt.Sprintf("field is too long, maximum length allowed is %d", maxLength)
	return FormatInvalidField(r, fieldName, reason, ids)
}

func FormatDuplicateInBatch(r ValidationRecord, ids []string) string {
	formatResourceIds := FormatIds(ids)
	resourceType := r.GetResourceType()
	capitalizedResourceType := strings.ToUpper(string(resourceType[0])) + resourceType[1:]
	message := fmt.Sprintf("%s %s appears multiple times in the batch.", capitalizedResourceType, formatResourceIds)
	return message
}
