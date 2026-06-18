export const hpoData = [
  { hpo_id: 'Phenotypic abnormality (HP:0000118)', count: 6488, countWithDescendant: 2630 },
  { hpo_id: 'Abnormality of the ear (HP:0000598)', count: 2807, countWithDescendant: 2807 },
  { hpo_id: 'Abnormality of the nervous system (HP:0000707)', count: 2676, countWithDescendant: 3807 },
  { hpo_id: 'Abnormal nervous system physiology (HP:0012638)', count: 2632, countWithDescendant: 2632 },
  { hpo_id: 'Abnormality of the genitourinary system (HP:0000119)', count: 2630, countWithDescendant: 2234 },
  { hpo_id: 'Abnormal ear morphology (HP:0031703)', count: 2548, countWithDescendant: 2107 },
  { hpo_id: 'Abnormality of the outer ear (HP:0000356)', count: 2186, countWithDescendant: 3807 },
  { hpo_id: 'Abnormality of the immune system (HP:0002715)', count: 2171, countWithDescendant: 3201 },
  { hpo_id: 'Abnormal auditory canal morphology (HP:0000372)', count: 2162, countWithDescendant: 1607 },
  { hpo_id: 'Cerumen abnormality (HP:0030787)', count: 2154, countWithDescendant: 1807 },
];

export const mondoData = [
  { mondo_id: 'hypothyroidism (MONDO:0005420)', count: 3522, countWithDescendant: 2630 },
  { mondo_id: 'psychiatric disorder (MONDO:0002025)', count: 3205, countWithDescendant: 2120 },
  { mondo_id: 'nervous system disorder (MONDO:0005071)', count: 3154, countWithDescendant: 1230 },
  { mondo_id: 'hearing loss disorder (MONDO:0005365)', count: 2947, countWithDescendant: 6830 },
  { mondo_id: 'thyroid gland disorder (MONDO:0003240)', count: 2700, countWithDescendant: 2698 },
  { mondo_id: 'vitamin D deficiency (MONDO:0100471)', count: 2651, countWithDescendant: 2637 },
  { mondo_id: 'speech disorder (MONDO:0004730)', count: 2453, countWithDescendant: 7683 },
  { mondo_id: 'cardiovascular disorder (MONDO:0004995)', count: 2408, countWithDescendant: 1630 },
  { mondo_id: 'obstructive sleep apnea syndrome (MONDO:0007147)', count: 2205, countWithDescendant: 2630 },
  { mondo_id: 'intellectual disability (MONDO:0001071)', count: 2092, countWithDescendant: 2990 },
];

export const biospecimensData = [
  { key: 'Plasma', count: 21823 },
  { key: 'White Blood Cells', count: 11396 },
  { key: 'Red Blood Cells', count: 10763 },
  { key: 'DNA', count: 5839 },
  { key: 'RNA', count: 3675 },
  { key: 'PBMCs', count: 3128 },
  { key: 'Peripheral Whole Blood', count: 2032 },
  { key: 'Buffy Coat', count: 1686 },
  { key: 'Monocytes', count: 1132 },
  { key: 'Blood Smear Slide', count: 980 },
  { key: 'Saliva', count: 204 },
  { key: 'CD4+ Tconv Cells', count: 176 },
  { key: 'NK Cells', count: 165 },
  { key: 'CD8+ T Cells', count: 148 },
  { key: 'EBV CL', count: 129 },
  { key: 'B Cells', count: 127 },
  { key: 'Granulocytes', count: 86 },
  { key: 'Regulatory T Cells', count: 57 },
  { key: 'ATAC-Seq Sample', count: 46 },
  { key: 'Blood Spots', count: 17 },
  { key: 'Serum', count: 3 },
];

export const filesByDataTypesData = [
  { key: 'Unaligned Reads', count: 8664 },
  { key: 'Aligned Reads', count: 3200 },
  { key: 'Alternative Splicing', count: 3157 },
  { key: 'Gene Expression Quantifications', count: 2975 },
  { key: 'Gene Fusions', count: 2315 },
  { key: 'Variant Calling Metrics', count: 2123 },
  { key: 'gVCF', count: 2025 },
  { key: 'Raw Gene Fusions', count: 1940 },
  { key: 'Variant Calls', count: 1547 },
  { key: 'Familial Relationship Report', count: 831 },
  { key: 'Gender QC Metrics', count: 419 },
  { key: 'Het Call QC Metrics', count: 419 },
  { key: 'Relatedness QC Metrics', count: 419 },
  { key: 'Preprocessed metabolite relative abundance', count: 418 },
  { key: 'Chimeric Aligned Reads', count: 400 },
  { key: 'Genome Aligned Reads', count: 400 },
  { key: 'QC Metrics', count: 400 },
  { key: 'RNAseq Alignment Metrics', count: 400 },
  { key: 'Splice Junction', count: 400 },
  { key: 'HLA Genotyping', count: 399 },
  { key: 'Peddy - Family/Sex', count: 304 },
  { key: 'Other', count: 122 },
  { key: 'VO2 Measures', count: 89 },
];

export const ageAtFirstEngagementKFData = [
  { age: '0-9', count: 523 },
  { age: '10-19', count: 43 },
  { age: '20-29', count: 50 },
  { age: '30-39', count: 112 },
  { age: '40-49', count: 137 },
  { age: '50-59', count: 130 },
  { age: '60+', count: 25 },
];

export const ageAtFirstEngagementIncludeData = [
  { age: '0-9', trisomy: 523, disomy: 90 },
  { age: '10-19', trisomy: 43, disomy: 0 },
  { age: '20-29', trisomy: 45, disomy: 5 },
  { age: '30-39', trisomy: 97, disomy: 15 },
  { age: '40-49', trisomy: 129, disomy: 8 },
  { age: '50-59', trisomy: 123, disomy: 7 },
  { age: '60+', trisomy: 19, disomy: 6 },
];

export const studiesData = [
  {
    label: 'AADSC',
    count: 6023,
  },
  {
    label: 'DSC',
    count: 3633,
  },
  {
    label: 'HTP',
    count: 1232,
  },
  {
    label: 'X01-Hakonarson',
    count: 1149,
  },
  {
    label: 'X01-deSmith',
    count: 436,
  },
  {
    label: 'ABC-DS',
    count: 417,
  },
  {
    label: 'BRI-DSR',
    count: 167,
  },
  {
    label: 'DS-DETERMINED',
    count: 123,
  },
  {
    label: 'TEAM-DS',
    count: 122,
  },
  {
    label: 'BrainPower',
    count: 82,
  },
  {
    label: 'DS-Sleep',
    count: 76,
  },
  {
    label: 'AECOM-DS',
    count: 25,
  },
  {
    label: 'DS-HPBM',
    count: 15,
  },
];

export const sexData = [
  { label: 'male', count: 6892 },
  { label: 'female', count: 6598 },
  { label: 'unknown', count: 7 },
  { label: 'other', count: 3 },
];

export const ethnicityData = [
  { label: 'Not Hispanic or Latino', count: 10386 },
  { label: 'Hispanic or Latino', count: 1614 },
  { label: 'Unknown', count: 825 },
  { label: 'asked but unknown', count: 675 },
];

export const familyTypeData = [
  { label: 'trio', count: 5754 },
  { label: 'proband-only', count: 3130 },
  { label: 'duo', count: 780 },
  { label: 'trio+', count: 663 },
  { label: 'duo+', count: 242 },
  { label: 'other', count: 19 },
  { label: '__missing__', count: 404 },
];

export const raceData = [
  { label: 'White', count: 10743 },
  { label: 'Black or African American', count: 1019 },
  { label: 'Unknown', count: 581 },
  { label: 'Other Race', count: 491 },
  { label: 'Asian', count: 455 },
  { label: 'American Indian or Alaska Native', count: 78 },
  { label: 'Native Hawaiian or Other Pacific Islander', count: 68 },
  { label: 'asked but unknown', count: 65 },
];
