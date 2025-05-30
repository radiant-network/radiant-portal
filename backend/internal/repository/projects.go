package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Project = types.Project

type ProjectsRepository struct {
	db *gorm.DB
}

type ProjectsDAO interface {
	GetProjects() (*[]Project, error)
}

func NewProjectsRepository(db *gorm.DB) *ProjectsRepository {
	if db == nil {
		log.Print("ProjectsRepository: db is nil")
		return nil
	}
	return &ProjectsRepository{db: db}
}

func (r *ProjectsRepository) GetProjects() (*[]Project, error) {
	tx := r.db.Table(types.ProjectTable.Name)
	var projects []Project
	err := tx.Find(&projects).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching projects: %w", err)
		} else {
			return nil, nil
		}
	}

	return &projects, err
}
