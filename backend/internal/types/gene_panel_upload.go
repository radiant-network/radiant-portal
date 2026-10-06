package types

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"golang.org/x/text/unicode/norm"
)

// PanelTypeUploaded marks the panels that the gene panel upload owns (migration 000041).
const PanelTypeUploaded = "uploaded"

const genePanelCodeMaxLength = 50

var genePanelCodeSeparators = regexp.MustCompile(`[^A-Z0-9]+`)

// GenePanelCodeFromName derives a panel code from its name: accents removed, upper case, every run
// of other characters replaced by one '_', cut to 50 characters. "Rétinopathie (AR)" gives
// "RETINOPATHIE_AR". An error when nothing is left.
func GenePanelCodeFromName(name string) (string, error) {
	var b strings.Builder
	for _, r := range norm.NFD.String(name) {
		if !unicode.Is(unicode.Mn, r) {
			b.WriteRune(r)
		}
	}
	code := strings.Trim(genePanelCodeSeparators.ReplaceAllString(strings.ToUpper(b.String()), "_"), "_")
	if len(code) > genePanelCodeMaxLength {
		code = strings.TrimRight(code[:genePanelCodeMaxLength], "_")
	}
	if code == "" {
		return "", fmt.Errorf("panel %q has no letter or digit to make a panel code", name)
	}
	return code, nil
}

type GenePanelRow struct {
	Line   int
	Symbol string
}

type GenePanelInput struct {
	Code string
	Name string
	Rows []GenePanelRow
}

type GenePanelGene struct {
	EnsemblID string
	Symbol    string
}

type GenePanel struct {
	Code  string
	Name  string
	Genes []GenePanelGene
}

// GenePanelFileError is a bad gene panel file. Line is 0 when the error is not on one line.
type GenePanelFileError struct {
	Line    int
	Message string
}

func (e *GenePanelFileError) Error() string {
	if e.Line == 0 {
		return e.Message
	}
	return fmt.Sprintf("line %d: %s", e.Line, e.Message)
}

// GenePanelUploadForm documents the multipart body of the upload for OpenAPI only: swag v2 does
// not name the part of a formData file parameter in an OpenAPI 3 spec.
// @Description Multipart body of a gene panel upload.
type GenePanelUploadForm struct {
	File string `json:"file" format:"binary" binding:"required"`
} // @name GenePanelUploadForm

// @Description A gene row of the file that the upload skipped, or kept with the Ensembl gene name.
type GenePanelUploadWarning struct {
	Line    int    `json:"line"`
	Symbol  string `json:"symbol"`
	Message string `json:"message"`
} // @name GenePanelUploadWarning

// @Description Result of a gene panel upload. The file replaced all the uploaded gene panels of the tenant.
type GenePanelUploadResult struct {
	Panels   int                      `json:"panels"`
	Genes    int                      `json:"genes"`
	Warnings []GenePanelUploadWarning `json:"warnings"`
} // @name GenePanelUploadResult

// UnmatchedGenesError rejects a strict upload that has rows with no Ensembl gene.
type UnmatchedGenesError struct {
	Warnings []GenePanelUploadWarning
}

func (e *UnmatchedGenesError) Error() string {
	return fmt.Sprintf("%d row(s) match no Ensembl gene", len(e.Warnings))
}

// GenePanelConflictError is a panel code that another panel of the tenant already uses, or an
// uploaded panel that the analysis catalog references.
type GenePanelConflictError struct {
	Message string
}

func (e *GenePanelConflictError) Error() string {
	return e.Message
}
