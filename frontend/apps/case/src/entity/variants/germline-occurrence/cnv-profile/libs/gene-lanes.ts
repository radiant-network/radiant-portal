export const GENE_LANES = 3;

const LABEL_CHAR_PX = 7.5;
const LABEL_PADDING_PX = 12;

export type LaneItem = { start: number; end: number; label: string };

export type LaneAssignment = { lane: number; labelled: boolean };

/**
 * Packs items sorted by start into lanes so that labels do not overlap. An item gets a free lane
 * only where its centred label fits; otherwise it goes, unlabelled, in the lane freed the earliest.
 */
export function assignLanes(items: LaneItem[], pxPerBase: number, lanes = GENE_LANES): LaneAssignment[] {
  const laneEnds = Array<number>(lanes).fill(-Infinity);
  return items.map(({ start, end, label }) => {
    const middle = (start + end) / 2;
    const halfLabel = (label.length * LABEL_CHAR_PX + LABEL_PADDING_PX) / pxPerBase / 2;
    const needStart = Math.min(start, middle - halfLabel);
    const needEnd = Math.max(end, middle + halfLabel);
    const free = laneEnds.findIndex(laneEnd => laneEnd < needStart);
    if (free >= 0) {
      laneEnds[free] = needEnd;
      return { lane: free, labelled: true };
    }
    const earliest = laneEnds.indexOf(Math.min(...laneEnds));
    laneEnds[earliest] = Math.max(laneEnds[earliest], end);
    return { lane: earliest, labelled: false };
  });
}
