INSERT INTO "pipeline" (id, description, genome_build)
VALUES (1, 'Dragen', 'GRch38'),
       (2, 'Nexflow Variant Annotation', 'GRch38')
ON CONFLICT (id) DO NOTHING;