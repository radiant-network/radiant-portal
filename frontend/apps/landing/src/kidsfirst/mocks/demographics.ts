export type DemographicDatum = { label: string; count: number };

/** Mock demographics distributions — replaced by Arranger data in a later task. */
export const familyCompositionData: DemographicDatum[] = [
  { label: 'Proband', count: 12040 },
  { label: 'Family member', count: 9580 },
];

export const raceData: DemographicDatum[] = [
  { label: 'White', count: 14020 },
  { label: 'Black or African American', count: 3010 },
  { label: 'Asian', count: 1520 },
  { label: 'Other Race', count: 1190 },
  { label: 'Unknown', count: 920 },
];

export const ethnicityData: DemographicDatum[] = [
  { label: 'Not Hispanic or Latino', count: 16030 },
  { label: 'Hispanic or Latino', count: 3520 },
  { label: 'Unknown', count: 1480 },
];
