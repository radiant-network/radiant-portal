package postgres

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type GenePanelsRepository struct {
	db *gorm.DB
}

func NewGenePanelsRepository(db database.PostgresDB) *GenePanelsRepository {
	if db.DB == nil {
		log.Print("GenePanelsRepository: db is nil")
		return nil
	}
	return &GenePanelsRepository{db: db.DB}
}

type panelGeneRow struct {
	PanelID   int    `gorm:"column:panel_id"`
	EnsemblID string `gorm:"column:ensembl_id"`
	Symbol    string `gorm:"column:symbol"`
}

// ReplaceGenePanels sets the genes of each given panel, in one transaction. A panel of the tenant
// with the same code (case-insensitive), of any type, keeps its row (name, type, analysis catalog
// link) and gets its genes replaced. A new code is created as an uploaded panel named by its code.
// The tenant's uploaded panels missing from the list are removed. Other panels stay unchanged.
func (r *GenePanelsRepository) ReplaceGenePanels(ctx context.Context, tenantCode string, panels []types.GenePanel) error {
	codes := make([]string, len(panels))
	for i, p := range panels {
		codes[i] = strings.ToLower(p.Code)
	}
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Serializes two uploads for one tenant. Without it, both could insert the same new code and
		// the second would fail on the panel code unique index.
		if err := tx.Exec("SELECT pg_advisory_xact_lock(hashtext(?))", "gene_panels:"+tenantCode).Error; err != nil {
			return fmt.Errorf("lock gene panels of %q: %w", tenantCode, err)
		}
		if err := removeUploadedPanelsNotIn(tx, tenantCode, codes); err != nil {
			return err
		}
		for _, panel := range panels {
			id, err := ensurePanel(tx, tenantCode, panel)
			if err != nil {
				return err
			}
			if err := tx.Exec("DELETE FROM panel_has_genes WHERE panel_id = ?", id).Error; err != nil {
				return fmt.Errorf("delete genes of panel %q of %q: %w", panel.Code, tenantCode, err)
			}
			if len(panel.Genes) == 0 {
				continue
			}
			rows := make([]panelGeneRow, len(panel.Genes))
			for i, g := range panel.Genes {
				rows[i] = panelGeneRow{PanelID: id, EnsemblID: g.EnsemblID, Symbol: g.Symbol}
			}
			if err := tx.Table("panel_has_genes").Create(&rows).Error; err != nil {
				return fmt.Errorf("insert genes of panel %q of %q: %w", panel.Code, tenantCode, err)
			}
		}
		return nil
	})
}

func removeUploadedPanelsNotIn(tx *gorm.DB, tenantCode string, codes []string) error {
	stale := "SELECT id FROM panel WHERE tenant_code = ? AND type_code = ? AND lower(code) NOT IN ?"
	if err := tx.Exec("DELETE FROM panel_has_genes WHERE panel_id IN ("+stale+")",
		tenantCode, types.PanelTypeUploaded, codes).Error; err != nil {
		return fmt.Errorf("delete genes of removed panels of %q: %w", tenantCode, err)
	}
	if err := tx.Exec("DELETE FROM panel WHERE id IN ("+stale+")",
		tenantCode, types.PanelTypeUploaded, codes).Error; err != nil {
		if isForeignKeyViolation(err) {
			return &types.GenePanelConflictError{Message: "an uploaded panel missing from the file is used by the analysis catalog"}
		}
		return fmt.Errorf("delete removed panels of %q: %w", tenantCode, err)
	}
	return nil
}

// ensurePanel returns the id of the tenant's panel with this code, creating it as uploaded if none.
func ensurePanel(tx *gorm.DB, tenantCode string, panel types.GenePanel) (int, error) {
	var ids []int
	if err := tx.Raw("SELECT id FROM panel WHERE tenant_code = ? AND lower(code) = lower(?)",
		tenantCode, panel.Code).Scan(&ids).Error; err != nil {
		return 0, fmt.Errorf("find panel %q of %q: %w", panel.Code, tenantCode, err)
	}
	if len(ids) > 0 {
		return ids[0], nil
	}
	var id int
	if err := tx.Raw(`
		INSERT INTO panel (code, name, type_code, tenant_code)
		VALUES (?, ?, ?, ?)
		RETURNING id`,
		panel.Code, panel.Name, types.PanelTypeUploaded, tenantCode).Scan(&id).Error; err != nil {
		return 0, fmt.Errorf("insert panel %q of %q: %w", panel.Code, tenantCode, err)
	}
	return id, nil
}
