export const apiMessages = {
  ImmediateError: (keyPrefix: string, field: string, tag: string) => `Key: '${keyPrefix}.${field}' Error:Field validation for '${field}' failed on the '${tag}' tag`,
  InternalServerError: 'Internal Server Error',
  InvalidBatchUUID: (batchId: string) => `error retrieve batch by its ID: ERROR: invalid input syntax for type uuid: \"${batchId}\" (SQLSTATE 22P02)`,
  InvalidDateFormat: 'invalid date format for date of birth, expected YYYY-MM-DD',
  BatchIdNotFound: 'batch_id not found',
  ParsingError: (field: string) => `error parsing ${field}`,
  ParsingErrorDateTime: (field: string) => `parsing time \"${field}\" as \"2006-01-02T15:04:05Z07:00\": cannot parse `,
};
