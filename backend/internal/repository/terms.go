package repository

import (
	"errors"
	"fmt"
	"log"
	"regexp"
	"strings"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
)

type TermsRepository struct {
	db *gorm.DB
}

type TermsDAO interface {
	GetTermAutoComplete(termsTable string, input string, limit int) ([]*types.AutoCompleteTerm, error)
}

func NewTermsRepository(db *gorm.DB) *TermsRepository {
	if db == nil {
		log.Print("TermsRepository: db is nil")
		return nil
	}
	return &TermsRepository{db: db}
}

func mapToAutoCompleteTerm(term *types.Term, input string) *types.AutoCompleteTerm {
	regex := regexp.MustCompile("(?i)" + input)
	id := ""
	name := ""
	if len(input) > 0 {
		id = regex.ReplaceAllString(term.ID, "<strong>"+strings.ToUpper(input)+"</strong>")
		name = regex.ReplaceAllString(term.Name, "<strong>"+strings.ToLower(input)+"</strong>")
	} else {
		id = term.ID
		name = term.Name
	}
	return &types.AutoCompleteTerm{
		HighLight: types.Term{
			ID:   id,
			Name: name,
		},
		Source: types.Term{
			ID:   term.ID,
			Name: term.Name,
		},
	}
}

func (r *TermsRepository) GetTermAutoComplete(termsTable string, input string, limit int) ([]*types.AutoCompleteTerm, error) {
	like := fmt.Sprintf("%%%s%%", input)
	tx := r.db.Table(termsTable).Select("id, name").Where("LOWER(name) like ? or UPPER(id) like ?", strings.ToLower(like), strings.ToUpper(like)).Order("id asc").Limit(limit)

	var terms []types.Term
	err := tx.Find(&terms).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching terms: %w", err)
		} else {
			return nil, nil
		}
	}

	output := make([]*types.AutoCompleteTerm, len(terms))
	for i, term := range terms {
		output[i] = mapToAutoCompleteTerm(&term, input)
	}

	return output, err
}
