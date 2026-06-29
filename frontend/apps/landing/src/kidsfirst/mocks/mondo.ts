export type MondoDatum = {
  mondo_id: string;
  count: number;
  countWithDescendant: number;
};

/** Mock diagnosis distribution (MONDO) — replaced by Arranger data in a later task. */
export const mondoData: MondoDatum[] = [
  { mondo_id: 'congenital diaphragmatic hernia (MONDO:0005711)', count: 1462, countWithDescendant: 1500 },
  { mondo_id: 'Down syndrome (MONDO:0008608)', count: 1310, countWithDescendant: 1400 },
  { mondo_id: 'B-cell acute lymphoblastic leukemia (MONDO:0004967)', count: 1108, countWithDescendant: 1200 },
  { mondo_id: 'complete trisomy 21 (MONDO:0700126)', count: 870, countWithDescendant: 900 },
  { mondo_id: 'acute lymphoblastic leukemia (MONDO:0011989)', count: 760, countWithDescendant: 820 },
  { mondo_id: 'neuroblastoma (MONDO:0005072)', count: 509, countWithDescendant: 540 },
  { mondo_id: 'trisomy 21 (MONDO:0700030)', count: 415, countWithDescendant: 430 },
  { mondo_id: 'cleft lip/palate (MONDO:0004747)', count: 318, countWithDescendant: 350 },
  { mondo_id: 'patent foramen ovale (MONDO:0008638)', count: 230, countWithDescendant: 250 },
  { mondo_id: 'congenital heart malformation (MONDO:0005453)', count: 180, countWithDescendant: 200 },
];
