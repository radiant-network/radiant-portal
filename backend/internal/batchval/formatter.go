package batchval

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
		if len(resourceIds) > 1 {
			formatResourceIds = fmt.Sprintf("(%s)", strings.Join(resourceIds, " / "))
		} else {
			formatResourceIds = resourceIds[0]
		}
	}
	return formatResourceIds
}

func FormatInvalidField(resourceType string, fieldName string, reason string, ids []string) string {
	formatResourceIds := FormatIds(ids)
	var invalidFieldMessage string
	if resourceType != "" {
		invalidFieldMessage = strings.TrimSpace(fmt.Sprintf("Invalid field %s for %s %s", fieldName, resourceType, formatResourceIds))
	} else {
		invalidFieldMessage = strings.TrimSpace(fmt.Sprintf("Invalid field %s for %s", fieldName, formatResourceIds))
	}
	reasonMessage := fmt.Sprintf("Reason: %s", reason)
	message := strings.TrimSpace(fmt.Sprintf("%s. %s.", invalidFieldMessage, reasonMessage))
	return message
}

func FormatFieldTooLong(resourceType, fieldName string, maxLength int, ids []string) string {
	reason := fmt.Sprintf("field is too long, maximum length allowed is %d", maxLength)
	return FormatInvalidField(resourceType, fieldName, reason, ids)
}

func FormatDuplicateInBatch(resourceType string, ids []string) string {
	formatResourceIds := FormatIds(ids)
	resourceLabel := FormatResourceLabel(resourceType)
	message := fmt.Sprintf("%s %s appears multiple times in the batch.", resourceLabel, formatResourceIds)
	return message
}

// FormatResourceLabel turns a batch resource type ("create_patient") into the entity label used in
// user facing messages ("Patient"), so create/update/patch flows report the same wording.
func FormatResourceLabel(resourceType string) string {
	if resourceType == "" {
		return ""
	}
	label := resourceType
	for _, prefix := range []string{"create_", "update_", "patch_"} {
		if after, found := strings.CutPrefix(label, prefix); found {
			label = after
			break
		}
	}
	return strings.ToUpper(label[:1]) + label[1:]
}
