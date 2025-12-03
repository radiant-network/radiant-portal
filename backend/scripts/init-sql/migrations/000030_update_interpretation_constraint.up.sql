ALTER TABLE interpretation_germline DROP CONSTRAINT UC_Interpretation_germline;
ALTER TABLE interpretation_somatic DROP CONSTRAINT UC_Interpretation_somatic;
ALTER TABLE interpretation_germline ADD CONSTRAINT UC_Interpretation_germline UNIQUE (case_id, sequencing_id, locus_id, transcript_id);
ALTER TABLE interpretation_somatic ADD CONSTRAINT UC_Interpretation_somatic UNIQUE (case_id, sequencing_id, locus_id, transcript_id);