import { colors } from '../hooks/use-chart-palette';

type ChartPalettePreviewProps = {
  patternIndex: number;
};
/**
 * Small color swatch matching the bar palette at patternIndex.
 * Intended for use inside custom tooltips/legends to mirror the on-chart
 * color of a series or category.
 *
 *      ▣  label value
 *      ▣  label value
 */
function ChartPalettePreview({ patternIndex }: ChartPalettePreviewProps) {
  const color = colors[patternIndex % colors.length];
  return (
    <div
      className="inline-block h-3 w-3 shrink-0 rounded-xs"
      style={{ backgroundColor: `var(--color-${color}-400)` }}
    />
  );
}
export default ChartPalettePreview;
