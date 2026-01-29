export const apiMessages = {
  DateEmpty: 'date cannot be empty',
  ImmediateError: (keyPrefix: string, field: string, tag: string) => `Key: '${keyPrefix}.${field}' Error:Field validation for '${field}' failed on the '${tag}' tag`,
  InternalServerError: 'Internal Server Error',
  InvalidBatchUUID: (batchId: string) => `error retrieve batch by its ID: ERROR: invalid input syntax for type uuid: \"${batchId}\" (SQLSTATE 22P02)`,
  InvalidDateFormat: 'invalid date format, expected ISO8601 (e.g. 2020-01-31)',
  BatchIdNotFound: 'batch_id not found',
  ParsingError: (field: string) => `error parsing ${field}`,
  ParsingErrorDateFormat: 'invalid date format, expected RFC3339 (e.g. 2020-01-02T15:04:05Z)',
  Patient005: (orgType: string, code: string, id: string) => `Organization type (${orgType}) defined for patient (${code} / ${id}) is not in this list : healthcare_provider, research_institute.`,
  ProcessWorkerError001: (type: string, code: string, id: string, aliquot?: string) => {
    const identifier = aliquot ? `${code} / ${id} / ${aliquot}` : `${code} / ${id}`;
    return `${type} (${identifier}) already exists, skipped.`;
  },
  ProcessWorkerError003: (field: string, type: string, value: string, id: string) => `${field} ${value} for ${type} ${id} does not exist.`,
  ProcessWorkerErrorDiffField: (type: string, field: string, originValue: string, newValue: string, code: string, id: string, aliquot?: string) => {
    const identifier = aliquot ? `${code} / ${id} / ${aliquot}` : `${code} / ${id}`;
    return `A ${type} with same ids (${identifier}) has been found but with a different ${field} (${originValue} <> ${newValue}).`;
  },
  ProcessWorkerErrorMultiple: (type: string, code: string, id: string, aliquot?: string) => {
    const identifier = aliquot ? `${code} / ${id} / ${aliquot}` : `${code} / ${id}`;
    return `${type} (${identifier}) appears multiple times in the batch.`;
  },
  ProcessWorkerErrorNotSamePatient: (type: string, field: string, code: string, id: string, parentId: string) => `Invalid field ${field} for ${type} (${code} / ${id}). Reason: Invalid parent ${type} ${parentId} for this ${type}.`,
  ProcessWorkerErrorOneOfTypeCode: (type: string, field: string, code: string, id: string) => `Invalid field ${field} for ${type} (${code} / ${id}). Reason: must be one of: blood, dna, not_reported, rna, saliva, solid_tissue.`,
  ProcessWorkerErrorPastDate: (type: string, field: string, code: string, id: string, aliquot: string) => `Invalid field ${field} for ${type} (${code} / ${id} / ${aliquot}). Reason: must be a past date.`,
  ProcessWorkerErrorRegExp: (type: string, field: string, code: string, id: string) => `Invalid field ${field} for ${type} (${code} / ${id}). Reason: does not match the regular expression ^[a-zA-Z0-9\\- .'À-ÿ]*$.`,
  ProcessWorkerErrorRegExpId: (type: string, field: string, code: string, id: string) => `Invalid field ${field} for ${type} (${code} / ${id}). Reason: does not match the regular expression ^[a-zA-Z0-9\\- ._'À-ÿ]*$.`,
  ProcessWorkerErrorRegExpAliquot: (type: string, field: string, code: string, id: string, aliquot: string) => `Invalid field ${field} for ${type} (${code} / ${id} / ${aliquot}). Reason: does not match the regular expression ^[A-Za-z0-9\\-_.]+$.`,
  ProcessWorkerErrorRegExpPlatform: (type: string, field: string, code: string, id: string, platform: string) => `Invalid field ${field} for ${type} (${code} / ${id} / ${platform}). Reason: does not match the regular expression ^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$.`,
  ProcessWorkerErrorRegExpTissue: (type: string, field: string, code: string, id: string) => `Invalid field ${field} for ${type} (${code} / ${id}). Reason: does not match the regular expression ^[A-Za-z\\- ]+$.`,
  ProcessWorkerErrorTooLong: (type: string, field: string, code: string, id: string, aliquot?: string) => {
    const identifier = aliquot ? `${code} / ${id} / ${aliquot}` : `${code} / ${id}`;
    return `Invalid field ${field} for ${type} (${identifier}). Reason: field is too long, maximum length allowed is 100.`;
  },
  ProcessWorkerErrorValueNotAllowed: (type: string, field: string, code: string, id: string, aliquot: string) => `Invalid field ${field} for ${type} (${code} / ${id} / ${aliquot}). Reason: value not allowed.`,
  Sample004: (code: string, patientId: string, SampleId: string) => `Patient (${code} / ${patientId}) for sample ${SampleId} does not exist.`,
  Sample005: (id: string) => `Sample ${id} does not exist.`,
  Sequencing005: (code: string, id: string) => `Sample (${code} / ${id}) does not exist.`,
  UnmarshalStringToInt64: (field: string) => `json: cannot unmarshal string into Go struct field ${field} of type int64`,
};
