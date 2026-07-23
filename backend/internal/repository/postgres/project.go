package repository

import (
	"context"
	"errors"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Project = types.Project

type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db database.PostgresDB) *ProjectRepository {
	return &ProjectRepository{db: db.DB}
}

func (r *ProjectRepository) GetProjectByCode(ctx context.Context, code string) (*Project, error) {
	var project Project
	tx := r.db.WithContext(ctx).Table(types.ProjectTable.Name).Where("code = ?", code)
	if err := tx.First(&project).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &project, nil
}
