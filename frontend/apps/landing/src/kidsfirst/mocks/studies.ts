/** Bilingual mock text. Real study data will come from a curated source later. */
type LocalizedText = { en: string; fr: string };

/** Maps portal study.domain → landing tag (see Notion). */
export type StudyDomain = 'cancer' | 'cross_condition' | 'congenital_disorder' | 'unknown';

export type Study = {
  name: string;
  description: LocalizedText;
  participantCount: number;
  domain: StudyDomain;
};

/** Total number of studies shown in the side panel — replaced by real count later. */
export const studiesTotal = 8;

/** Mock featured studies for the carousel — replaced by real data in a later task. */
export const studies: Study[] = [
  {
    name: "Children's Brain Tumor Network",
    description: {
      en: "The Children's Brain Tumor Network (CBTN) is a multi-institutional international clinical research consortium created to advance therapeutic development through the collection and rapid distribution of biospecimens and data via open-science research platforms.",
      fr: "Le Children's Brain Tumor Network (CBTN) est un consortium international de recherche clinique multi-institutionnel créé pour faire progresser le développement thérapeutique grâce à la collecte et à la distribution rapide de biospécimens et de données via des plateformes de recherche en science ouverte.",
    },
    participantCount: 0,
    domain: 'unknown',
  },
  {
    name: 'Kids First: Neuroblastoma',
    description: {
      en: 'A study of the genomic landscape of neuroblastoma to identify drivers of this pediatric cancer and inform new treatment strategies.',
      fr: 'Une étude du paysage génomique du neuroblastome visant à identifier les moteurs de ce cancer pédiatrique et à orienter de nouvelles stratégies de traitement.',
    },
    participantCount: 1024,
    domain: 'cancer',
  },
  {
    name: 'Kids First: Orofacial Cleft',
    description: {
      en: 'Whole-genome sequencing of families affected by orofacial clefts to uncover the genetic basis of these common structural birth defects.',
      fr: 'Séquençage du génome entier de familles touchées par des fentes orofaciales afin de découvrir la base génétique de ces malformations congénitales structurelles courantes.',
    },
    participantCount: 2310,
    domain: 'congenital_disorder',
  },
  {
    name: 'Kids First: Congenital Heart Defects & Cancer',
    description: {
      en: 'A cross-condition cohort exploring shared genetic mechanisms between congenital heart defects and childhood cancer.',
      fr: 'Une cohorte transversale explorant les mécanismes génétiques communs entre les cardiopathies congénitales et le cancer pédiatrique.',
    },
    participantCount: 1487,
    domain: 'cross_condition',
  },
];
