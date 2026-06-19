export type Study = {
  sponsor: string;
  name: string;
  description: string;
  participants: number;
};

/** Total number of studies shown in the side panel — replaced by real count later. */
export const studiesTotal = 5;

/** Mock featured studies for the carousel — replaced by real data in a later task. */
export const studies: Study[] = [
  {
    sponsor: 'Geisinger',
    name: 'Dimensional, Sleep, and Genomic Analyses of Down Syndrome to Elucidate Phenotypic Variability',
    description:
      'The present work falls under an administrative supplement to study Down syndrome (DS) within the existing grant, "Dimensional Analysis of Developmental Brain Disorders using an Online, Genome First Approach" (R01-MH107431). The study aims to build validated, quantitative measures of psychopathology for DS.',
    participants: 76,
  },
  {
    sponsor: 'CU School of Medicine',
    name: 'Nexus Translational Biobank',
    description:
      'The Nexus is a patient registry, clinical database, and biological sample bank focused on developmental disorders, linking human cognitive, behavioral, neurological and other clinical phenotypes to biological samples including DNA, plasma, and lymphoblastoid cell lines.',
    participants: 842,
  },
  {
    sponsor: 'DS-Connect',
    name: 'DS-Connect: The Down Syndrome Registry',
    description:
      'DS-Connect is an online survey tool designed to collect demographic data and basic health information from individuals with DS, to better understand their health and to inform eligible participants who may be a match for research studies or new clinical trials.',
    participants: 3633,
  },
  {
    sponsor: 'Crnic Institute',
    name: 'Human Trisome Project',
    description:
      'A natural history study of Down syndrome collecting deep clinical, biological, and molecular data to accelerate research into co-occurring conditions across the lifespan.',
    participants: 1055,
  },
  {
    sponsor: 'INCLUDE',
    name: 'Down Syndrome Cohort',
    description:
      'A harmonized cohort integrating clinical and genomic data from multiple INCLUDE-funded sites to support cross-study discovery.',
    participants: 1232,
  },
];
