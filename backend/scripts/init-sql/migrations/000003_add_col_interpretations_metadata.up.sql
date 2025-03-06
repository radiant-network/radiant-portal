ALTER TABLE interpretation_germline
ADD metadata JSONB;

ALTER TABLE interpretation_germline_history
ADD metadata JSONB;

ALTER TABLE interpretation_somatic
ADD metadata JSONB;

ALTER TABLE interpretation_somatic_history
ADD metadata JSONB;

CREATE INDEX IDX_Interpretation_germline_metadata_analysis_id on interpretation_germline ((metadata->>'analysis_id'));
CREATE INDEX IDX_Interpretation_germline_metadata_patient_id on interpretation_germline ((metadata->>'patient_id'));
CREATE INDEX IDX_Interpretation_germline_metadata_variant_hash on interpretation_germline ((metadata->>'variant_hash'));

CREATE INDEX IDX_Interpretation_somatic_metadata_analysis_id on interpretation_somatic ((metadata->>'analysis_id'));
CREATE INDEX IDX_Interpretation_somatic_metadata_patient_id on interpretation_somatic ((metadata->>'patient_id'));
CREATE INDEX IDX_Interpretation_somatic_metadata_variant_hash on interpretation_somatic ((metadata->>'variant_hash'));
