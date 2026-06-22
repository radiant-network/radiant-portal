export type MondoDatum = {
  mondo_id: string;
  count: number;
  countWithDescendant: number;
};

/** Mock diagnosis distribution (MONDO) — replaced by Arranger data in a later task. */
export const mondoData: MondoDatum[] = [
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
