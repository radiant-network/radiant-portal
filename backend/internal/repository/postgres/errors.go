package postgres

import (
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
)

// PostgreSQL SQLSTATE codes the write repositories branch on. Detected at the driver level
// (pgconn) rather than via gorm's typed errors, which would require opening the handle with
// TranslateError — that also rewrites the worker's user-facing batch-validation error messages.
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const (
	sqlStateUniqueViolation     = "23505"
	sqlStateForeignKeyViolation = "23503"
)

func pgErrorCodeIs(err error, code string) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == code
}

func isUniqueViolation(err error) bool     { return pgErrorCodeIs(err, sqlStateUniqueViolation) }
func isForeignKeyViolation(err error) bool { return pgErrorCodeIs(err, sqlStateForeignKeyViolation) }

func uniqueViolationOn(err error, constraint string) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == sqlStateUniqueViolation && pgErr.ConstraintName == constraint
}
