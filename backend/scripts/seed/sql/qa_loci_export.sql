-- Real loci for build_seed.py --env qa --loci: run against an existing tenant's database, which holds the variants
-- the environment has annotated. Up to 10 SNVs per gene and impact, plus the named drivers of genomics.NAMED when the
-- environment has them; only loci with a picked consequence and a consequence filter row in part 1 (genomics.PART), the
-- part the seed's occurrences use.
--   mysql -B -D <code>_tenant < sql/qa_loci_export.sql > qa_loci.tsv
SELECT locus_id, chromosome AS chr, start, reference AS ref, alternate AS alt, symbol, transcript_id, consequences[1] AS consequence,
       vep_impact, dna_change, aa_change, is_mane_select AS mane, is_canonical AS canonical,
       clinvar_interpretation[1] AS clinvar, rsnumber, gnomad_v3_af AS af
FROM (
    SELECT v.*, row_number() OVER (PARTITION BY v.symbol, v.vep_impact ORDER BY murmur_hash3_32(v.locus_id)) AS rn
    FROM snv__variant v
    WHERE v.variant_class = 'SNV'
      AND v.symbol IN ('SMARCB1', 'SMARCA4', 'TP53', 'BRAF', 'H3-3A', 'PTCH1', 'SUFU', 'ELP1', 'CTNNB1', 'DDX3X', 'KMT2D', 'ATRX', 'NF1', 'FGFR1', 'PTEN', 'APC', 'TTN', 'MUC16', 'LRP1B', 'CSMD1', 'SYNE1', 'RYR2', 'FLG', 'OBSCN')
      AND v.locus_id IN (SELECT locus_id FROM radiant.snv__consequence_filter_partitioned WHERE part = 1)
      AND v.locus_id IN (SELECT locus_id FROM radiant.snv__consequence WHERE is_picked)
) x
WHERE rn <= 10 OR locus IN ('22-23787208-C-T', '22-23834186-C-T', '22-23837665-G-A', '17-7674220-C-T', '17-7673802-C-T', '7-140753336-A-T', '1-226064434-A-T', '9-95485834-G-A', '10-102506312-C-T', '9-108899816-G-A', '3-41224610-C-G', 'X-41346638-G-A', '12-49031203-G-A', 'X-77682500-G-A', '8-38417331-G-T')
ORDER BY locus_id;
