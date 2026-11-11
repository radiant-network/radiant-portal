/** Bilingual mock text. Real study data will come from the backend. */
type LocalizedText = { en: string; fr: string };

export type Study = {
  title: string;
  name: LocalizedText;
  description: LocalizedText;
  participantCount: number;
};

/** Total number of studies shown in the side panel — replaced by real count later. */
export const studiesTotal = 5;

/** Mock featured studies for the carousel — replaced by real data in a later task. */
export const studies: Study[] = [
  {
    title: 'Geisinger',
    name: {
      en: 'Dimensional, Sleep, and Genomic Analyses of Down Syndrome to Elucidate Phenotypic Variability',
      fr: 'Analyses dimensionnelles, du sommeil et génomiques de la trisomie 21 pour élucider la variabilité phénotypique',
    },
    description: {
      en: 'The present work falls under an administrative supplement to study Down syndrome (DS) within the existing grant, "Dimensional Analysis of Developmental Brain Disorders using an Online, Genome First Approach" (R01-MH107431). The study aims to build validated, quantitative measures of psychopathology for DS.',
      fr: "Ces travaux s'inscrivent dans un supplément administratif visant à étudier la trisomie 21 (T21) dans le cadre de la subvention existante « Dimensional Analysis of Developmental Brain Disorders using an Online, Genome First Approach » (R01-MH107431). L'étude vise à établir des mesures quantitatives validées de la psychopathologie liée à la T21.",
    },
    participantCount: 76,
  },
  {
    title: 'CU School of Medicine',
    name: {
      en: 'Nexus Translational Biobank',
      fr: 'Biobanque translationnelle Nexus',
    },
    description: {
      en: 'The Nexus is a patient registry, clinical database, and biological sample bank focused on developmental disorders, linking human cognitive, behavioral, neurological and other clinical phenotypes to biological samples including DNA, plasma, and lymphoblastoid cell lines.',
      fr: "Le Nexus est un registre de patients, une base de données cliniques et une banque d'échantillons biologiques axés sur les troubles du développement, reliant les phénotypes cliniques humains — cognitifs, comportementaux, neurologiques et autres — à des échantillons biologiques comprenant l'ADN, le plasma et des lignées cellulaires lymphoblastoïdes.",
    },
    participantCount: 842,
  },
  {
    title: 'DS-Connect',
    name: {
      en: 'DS-Connect: The Down Syndrome Registry',
      fr: 'DS-Connect : le registre de la trisomie 21',
    },
    description: {
      en: 'DS-Connect is an online survey tool designed to collect demographic data and basic health information from individuals with DS, to better understand their health and to inform eligible participants who may be a match for research studies or new clinical trials.',
      fr: "DS-Connect est un outil de sondage en ligne conçu pour recueillir des données démographiques et des renseignements de base sur la santé des personnes ayant la trisomie 21, afin de mieux comprendre leur santé et d'informer les participants admissibles susceptibles de correspondre à des études de recherche ou à de nouveaux essais cliniques.",
    },
    participantCount: 3633,
  },
  {
    title: 'Crnic Institute',
    name: {
      en: 'Human Trisome Project',
      fr: 'Human Trisome Project',
    },
    description: {
      en: 'A natural history study of Down syndrome collecting deep clinical, biological, and molecular data to accelerate research into co-occurring conditions across the lifespan.',
      fr: "Une étude d'histoire naturelle de la trisomie 21 recueillant des données cliniques, biologiques et moléculaires approfondies afin d'accélérer la recherche sur les affections concomitantes tout au long de la vie.",
    },
    participantCount: 1055,
  },
  {
    title: 'INCLUDE',
    name: {
      en: 'Down Syndrome Cohort',
      fr: 'Cohorte de la trisomie 21',
    },
    description: {
      en: 'A harmonized cohort integrating clinical and genomic data from multiple INCLUDE-funded sites to support cross-study discovery.',
      fr: 'Une cohorte harmonisée intégrant des données cliniques et génomiques provenant de plusieurs sites financés par INCLUDE afin de soutenir la découverte inter-études.',
    },
    participantCount: 1232,
  },
];
