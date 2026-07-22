package database

import "gorm.io/gorm"

// PostgresDB and StarrocksDB are named handles that make a repository's target database part of
// its constructor signature. A repository that owns PostgreSQL data takes PostgresDB; one that
// reads StarRocks takes StarrocksDB. Passing the wrong connection is then a compile error rather
// than a runtime SQL failure a reviewer has to catch by tracing the wiring.
//
// The embedded *gorm.DB is the underlying connection; constructors unwrap it into their own field,
// so the wrapper only guards the construction boundary and repository query code is unaffected.
type PostgresDB struct {
	*gorm.DB
}

type StarrocksDB struct {
	*gorm.DB
}
