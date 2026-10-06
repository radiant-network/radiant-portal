package postgres

import (
	"context"
	"fmt"
	"log"

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

// ReplaceUploadedGenePanels deletes the tenant's uploaded panels and creates the given ones, in one
// transaction. Panels of another type (the analysis catalog's prescription panels) stay unchanged.
func (r *GenePanelsRepository) ReplaceUploadedGenePanels(ctx context.Context, tenantCode string, panels []types.GenePanel) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Serializes two uploads for one tenant. Without it, both deletes run on the old set and
		// the second insert fails on the panel code unique index.
		if err := tx.Exec("SELECT pg_advisory_xact_lock(hashtext(?))", "gene_panels:"+tenantCode).Error; err != nil {
			return fmt.Errorf("lock gene panels of %q: %w", tenantCode, err)
		}
		if err := tx.Exec(`
			DELETE FROM panel_has_genes
			WHERE panel_id IN (SELECT id FROM panel WHERE tenant_code = ? AND type_code = ?)`,
			tenantCode, types.PanelTypeUploaded).Error; err != nil {
			return fmt.Errorf("delete uploaded panel genes of %q: %w", tenantCode, err)
		}
		if err := tx.Exec(`DELETE FROM panel WHERE tenant_code = ? AND type_code = ?`,
			tenantCode, types.PanelTypeUploaded).Error; err != nil {
			if isForeignKeyViolation(err) {
				return &types.GenePanelConflictError{Message: "an uploaded gene panel is used by the analysis catalog"}
			}
			return fmt.Errorf("delete uploaded panels of %q: %w", tenantCode, err)
		}

		for _, panel := range panels {
			var id int
			if err := tx.Raw(`
				INSERT INTO panel (code, name, type_code, tenant_code)
				VALUES (?, ?, ?, ?)
				RETURNING id`,
				panel.Code, panel.Name, types.PanelTypeUploaded, tenantCode).Scan(&id).Error; err != nil {
				if isUniqueViolation(err) {
					return &types.GenePanelConflictError{Message: fmt.Sprintf("panel %q (code %s) is already used by another panel of the tenant", panel.Name, panel.Code)}
				}
				return fmt.Errorf("insert panel %q of %q: %w", panel.Code, tenantCode, err)
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
