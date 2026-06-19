export type DemographicDatum = { label: string; count: number };

/** Mock demographics distributions — replaced by Arranger data in a later task. */
export const sexData: DemographicDatum[] = [
  { label: 'male', count: 6892 },
  { label: 'female', count: 6598 },
  { label: 'unknown', count: 7 },
  { label: 'other', count: 3 },
];

export const raceData: DemographicDatum[] = [
  { label: 'White', count: 10743 },
  { label: 'Black or African American', count: 1019 },
  { label: 'Unknown', count: 581 },
  { label: 'Other Race', count: 491 },
  { label: 'Asian', count: 455 },
  { label: 'American Indian or Alaska Native', count: 78 },
  { label: 'Native Hawaiian or Other Pacific Islander', count: 68 },
  { label: 'asked but unknown', count: 65 },
];

export const ethnicityData: DemographicDatum[] = [
  { label: 'Not Hispanic or Latino', count: 10386 },
  { label: 'Hispanic or Latino', count: 1614 },
  { label: 'Unknown', count: 825 },
  { label: 'asked but unknown', count: 675 },
];
