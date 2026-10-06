package server

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

// GenePanelUploadMaxBytes limits the whole multipart body of a gene panel upload: 10 MiB
// (10 × 1024 × 1024 = 10,485,760 bytes).
const GenePanelUploadMaxBytes = 10 << 20

type genePanelUploader interface {
	Upload(ctx context.Context, tenantCode string, file io.Reader, strict bool) (*types.GenePanelUploadResult, error)
}

// PutGenePanelsHandler
// @Summary Replace the tenant's gene panels
// @Id putGenePanels
// @Description Sets the genes of the tenant's panels from the attached `.tsv` file. A panel of the
// @Description file that the tenant already has (same code, any case), such as a panel of the
// @Description analysis catalog, keeps its name and settings and gets the genes of the file. A new
// @Description code creates a panel named by its code. The file is the tenant's full list: a panel
// @Description missing from it loses its genes, and a panel created by an earlier upload is removed.
// @Description The change is all or nothing, and the genes are available for variant filtering when
// @Description the call returns. Requires the `can_manage_analysis_catalog` action.
// @Description Sending the same file again gives the same result, so a retry is safe.
// @Description
// @Description File: UTF-8 TSV, max 10 MiB, one row per gene, with a header row. Column `symbol` holds
// @Description the gene symbol, column `panels` the comma-separated codes of the panels the gene is
// @Description in. Other columns, such as `version`, are ignored. A missing column, an empty or
// @Description duplicate symbol, a bad panel code, or two codes that differ only by case give 400,
// @Description with the line in `detail.line`.
// @Description
// @Description Each symbol must be a known gene (an Ensembl gene ID is also accepted). A row with an
// @Description unknown gene is skipped and returned in `warnings`; with `strict=true` the file is
// @Description rejected instead (422, the rows in `detail.warnings`). An uploaded panel missing from
// @Description the file that the analysis catalog still uses gives 409.
// @Tags gene_panels
// @Security bearerauth
// @Accept multipart/form-data
// @Param tenant path string true "Tenant code"
// @Param request body types.GenePanelUploadForm true "Gene panel file (.tsv) in the part named file"
// @Param strict query bool false "Reject the file when a row matches no Ensembl gene"
// @Produce json
// @Success 200 {object} types.GenePanelUploadResult
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 409 {object} types.ApiError
// @Failure 413 {object} types.ApiError
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/gene_panels [put]
func PutGenePanelsHandler(uploader genePanelUploader) gin.HandlerFunc {
	return func(c *gin.Context) {
		strict, err := strconv.ParseBool(c.DefaultQuery("strict", "false"))
		if err != nil {
			HandleValidationError(c, fmt.Errorf("strict must be true or false"))
			return
		}
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, GenePanelUploadMaxBytes)
		header, err := c.FormFile("file")
		if err != nil {
			var tooLarge *http.MaxBytesError
			if errors.As(err, &tooLarge) {
				HandleRequestEntityTooLargeError(c, fmt.Sprintf("request body exceeds %d bytes", GenePanelUploadMaxBytes))
				return
			}
			HandleValidationError(c, fmt.Errorf("file: %w", err))
			return
		}
		file, err := header.Open()
		if err != nil {
			HandleError(c, err)
			return
		}
		defer func() { _ = file.Close() }()

		var (
			fileErr   *types.GenePanelFileError
			unmatched *types.UnmatchedGenesError
			conflict  *types.GenePanelConflictError
		)
		result, err := uploader.Upload(c.Request.Context(), *tenant, file, strict)
		switch {
		case err == nil:
			c.JSON(http.StatusOK, result)
		case errors.As(err, &fileErr):
			c.JSON(http.StatusBadRequest, types.ApiError{Status: http.StatusBadRequest, Message: fileErr.Error(), Detail: gin.H{"line": fileErr.Line}})
		case errors.As(err, &unmatched):
			c.JSON(http.StatusUnprocessableEntity, types.ApiError{Status: http.StatusUnprocessableEntity, Message: unmatched.Error(), Detail: gin.H{"warnings": unmatched.Warnings}})
		case errors.As(err, &conflict):
			HandleConflictError(c, conflict.Error())
		default:
			HandleError(c, err)
		}
	}
}
