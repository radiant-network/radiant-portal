export const GENE_LANES = 3;

const LABEL_CHAR_PX = 7.5;
const LABEL_PADDING_PX = 12;

export type LaneItem = { start: number; end: number; label: string; primary?: boolean };

export type LaneAssignment = { lane: number; labelled: boolean };

/**
 * Packs items sorted by start into lanes so that labels do not overlap. Primary items are placed
 * first, so that they keep their labels among many others. An item gets a lane only where its
 * centred label fits; otherwise it goes, unlabelled, in the lane that ends the earliest.
 */
export function assignLanes(items: LaneItem[], pxPerBase: number, lanes = GENE_LANES): LaneAssignment[] {
  const taken: [number, number][][] = Array.from({ length: lanes }, () => []);
  const laneEnds = Array<number>(lanes).fill(-Infinity);
  const fits = (lane: number, start: number, end: number) =>
    taken[lane].every(([takenStart, takenEnd]) => takenEnd < start || takenStart > end);
  const order = items
    .map((_, index) => index)
    .sort((a, b) => Number(Boolean(items[b].primary)) - Number(Boolean(items[a].primary)) || a - b);

  const assignments: LaneAssignment[] = [];
  for (const index of order) {
    const { start, end, label } = items[index];
    const middle = (start + end) / 2;
    const halfLabel = (label.length * LABEL_CHAR_PX + LABEL_PADDING_PX) / pxPerBase / 2;
    const needStart = Math.min(start, middle - halfLabel);
    const needEnd = Math.max(end, middle + halfLabel);
    const free = taken.findIndex((_, lane) => fits(lane, needStart, needEnd));
    const lane = free >= 0 ? free : laneEnds.indexOf(Math.min(...laneEnds));
    taken[lane].push(free >= 0 ? [needStart, needEnd] : [start, end]);
    laneEnds[lane] = Math.max(laneEnds[lane], free >= 0 ? needEnd : end);
    assignments[index] = { lane, labelled: free >= 0 };
  }
  return assignments;
}
