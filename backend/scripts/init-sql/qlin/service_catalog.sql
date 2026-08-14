-- Service catalog for the qlin tenant: the case-level analysis services (French labels come
-- from QLIN, English ones from the clin-fhir CodeSystem analysis-request-code) plus the
-- sequencing-level services of CodeSystem sequencing-request-code.
--
-- Nothing in this repo applies scripts/init-sql/qlin/*.sql: the PostgreSQL entrypoint only runs
-- files at the root of /docker-entrypoint-initdb.d and ignores subdirectories. The rows the API
-- needs to function ship in migration 000023 for the default tenant; this file stays a seed for
-- the qlin tenant and has to be applied by hand.
INSERT INTO service_catalog (code, type, name_en, name_fr, tenant_code) VALUES
    ('MMG',    'case',       'Global Muscular Diseases',                              'Maladies musculaires globales',                           'qlin'),
    ('DYSM',   'case',       'Muscular Dystrophies',                                  'Dystrophies musculaires',                                 'qlin'),
    ('RHAB',   'case',       'Rhabdomyolysis',                                        'Rhabdomyolyse',                                           'qlin'),
    ('MITN',   'case',       'Nuclear Mitochondriopathies',                           'Mitochondriopathies nucléaires',                          'qlin'),
    ('MYOC',   'case',       'Congenital Myopathies',                                 'Myopathies congénitales',                                 'qlin'),
    ('MYAC',   'case',       'Congenital Myasthenia',                                 'Myasthénies congénitales',                                'qlin'),
    ('HYPM',   'case',       'Malignant Hyperthermia',                                'Hyperthermie maligne',                                    'qlin'),
    ('RGDI',   'case',       'Global Developmental Delay / Intellectual Disability (Trio)', 'Retard global de développement / Déficience intellectuelle (Trio)', 'qlin'),
    ('POLYM',  'case',       'Polymalformation Postnatal Context',                    'Polymalformation contexte postnatal',                     'qlin'),
    ('TRATU',  'case',       'Tumoral Transcriptome',                                 'Transcriptome tumoral',                                   'qlin'),
    ('TUHEM',  'case',       'Hematological Malignancies Predisposition',             'Prédisposition hémopathies malignes',                     'qlin'),
    ('TUPED',  'case',       'Pediatric Cancer Predisposition',                       'Prédisposition cancers pédiatriques',                     'qlin'),
    ('EXTUM',  'case',       'Tumoral Analysis',                                      'Analyse tumorale',                                        'qlin'),
    ('SHEMA',  'case',       'Leukemia (Somatic)',                                    'Leucémie (somatique)',                                    'qlin'),
    ('SCID',   'case',       'Severe Combined Immune Deficiency',                     'Déficit immunitaire combiné sévère',                      'qlin'),
    ('STMO',   'case',       'Soft Tissue and Bone Sarcoma',                          'Sarcome des tissus mous et osseux',                       'qlin'),
    ('FEAN',   'case',       'Fetal Anomalies',                                       'Anomalies fœtales',                                       'qlin'),
    ('DPSO',   'case',       'Superoxide Production Defect',                          'Défaut de production de superoxyde',                      'qlin'),
    ('EIDC',   'case',       'Inherited Complement Errors',                           'Erreurs innées du complément',                            'qlin'),
    ('EIDI',   'case',       'Inborn Errors of Immunity',                             'Erreurs innées de l''immunité',                           'qlin'),
    ('EIII',   'case',       'Inherited Errors of Intrinsic Immunity',                'Erreurs innées de l''immunité intrinsèque',               'qlin'),
    ('EPIL',   'case',       'Epilepsy Without Intellectual Disability',              'Epilepsie sans déficience intellectuelle',                'qlin'),
    ('RAPIDE', 'case',       'Rapid Exome: Monogenic Diagnosis and Therapeutic Guidance', 'Exome rapide : diagnostic monogénique et orientation thérapeutique', 'qlin'),
    ('HDIP',   'case',       'Hypogammaglobulinemia and Primary Immune Dysregulation', 'Hypogammaglobulinémie et dysrégulation immunitaire primitive', 'qlin'),
    ('HLEB',   'case',       'Lymphohistiocytic Hemophagocytosis and Chronic Active Epstein-Barr Virus Infection', 'Hémophagocytose lymphohistiocytaire et à l''infection chronique active au virus Epstein Barr', 'qlin'),
    ('HLH',    'case',       'Hemophagocytic Lymphohistiocytosis',                    'Hémophagocytose lymphohistiocytaire',                     'qlin'),
    ('MAI',    'case',       'Autoinflammatory Diseases',                             'Maladies auto-inflammatoires',                            'qlin'),
    ('MSMD',   'case',       'Mendelian Susceptibility to Mycobacterial Diseases',    'Syndrome de prédisposition mendélienne aux infections mycobactériennes (MSMD)', 'qlin'),
    ('NPC',    'case',       'Congenital Neutropenia',                                'Neutropénie congénitale',                                 'qlin'),
    ('RETINO', 'case',       'Retinopathy',                                           'Rétinopathies',                                           'qlin'),
    ('SHIGE',  'case',       'Hyper-IgE Syndrome',                                    'Syndrome d''hyper-IgE',                                   'qlin'),
    ('SLA',    'case',       'Amyotrophic Lateral Sclerosis',                         'Sclérose latérale amyotrophique',                         'qlin'),
    ('SURD',   'case',       'Hearing Loss',                                          'Surdité',                                                 'qlin'),
    ('VEOIB',  'case',       'Very Early Onset Intestinal Bowl Disease',              'Maladie inflammatoire de l''intestin très précoce',       'qlin'),
    ('GENOR',  'case',       'Whole Genome Sequencing - Non-Specific',                'Séquençage du génome entier - non spécifique',            'qlin'),
    ('NEUTP',  'case',       'Congenital Neutropenia',                                'Neutropénie congénitale',                                 'qlin'),
    ('CONCO',  'case',       'Predisposition to Solid Tumors in Adults',              'Prédisposition aux tumeurs solides de l''adulte',         'qlin'),
    ('75020',  'sequencing', 'Normal Exome Sequencing',                               'Séquençage d''exome normal',                              'qlin'),
    ('75022',  'sequencing', 'Normal Genome Sequencing',                              'Séquençage du génome normal',                             'qlin'),
    ('65241',  'sequencing', 'Tumoral Exome Sequencing',                              'Séquençage d''exome tumoral',                             'qlin'),
    ('65240',  'sequencing', 'Tumoral Transcriptome Sequencing',                      'Séquençage de transcriptome tumoral',                     'qlin')
ON CONFLICT (code, tenant_code) DO NOTHING;
