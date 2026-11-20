import type { CNVProfileRegion, CNVProfileTrack } from '@/api/api';

// Outside the region the overview points stay, so that a pan shows them until the region loads.
export function withRegion(
  tracks: CNVProfileTrack[],
  region: CNVProfileRegion | undefined,
  pick: (region: CNVProfileRegion) => CNVProfileTrack,
): CNVProfileTrack[] {
  if (!region) return tracks;
  const detail = pick(region);
  return tracks.map(track => {
    if (track.chromosome !== region.chromosome) return track;
    const positions: number[] = [];
    const values: number[] = [];
    track.positions.forEach((position, i) => {
      if (position < region.start) {
        positions.push(position);
        values.push(track.values[i]);
      }
    });
    positions.push(...detail.positions);
    values.push(...detail.values);
    track.positions.forEach((position, i) => {
      if (position >= region.end) {
        positions.push(position);
        values.push(track.values[i]);
      }
    });
    return { chromosome: track.chromosome, positions, values };
  });
}
