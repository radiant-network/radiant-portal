package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Project = types.Project

type ProjectRepository struct {
	db *gorm.DB
}

type ProjectDAO interface {
	GetProjectByCode(code string) (*Project, error)
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) GetProjectByCode(code string) (*Project, error) {
	var project Project
	tx := r.db.Table(types.ProjectTable.Name).Where("code = ?", code)
	if err := tx.First(&project).Error; err != nil {
		return nil, err
	}
	return &project, nil
}
