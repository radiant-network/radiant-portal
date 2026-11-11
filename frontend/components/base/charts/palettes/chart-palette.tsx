import { colors } from '../hooks/use-chart-palette';

type PatternShape = {
  width: number;
  height: number;
  d: string;
  filled?: boolean;
};

const patterns: ReadonlyArray<PatternShape> = [
  { width: 10, height: 10, d: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9' },
  { width: 8, height: 8, d: 'M 5 3 L 5 7 M 3 5 L 7 5' },
  { width: 10, height: 10, d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11' },
];

type ChartPatternProps<T> = {
  id: string;
  data: ReadonlyArray<T>;
  colorblindMode: boolean;
};

/**
 * SVG with custom pattern to improve readability for color blind user.
 * Color blind mode can be disabled if needed.
 */
function ChartPalette<T>({ id, data, colorblindMode }: ChartPatternProps<T>) {
  return (
    <defs>
      {data.map((_, i) => {
        const color = colors[i % colors.length];
        const pattern = patterns[i % patterns.length];
        const accent = `color-mix(in oklab, var(--color-${color}-400) 85%, black)`;
        return (
          <pattern
            key={i}
            id={`${id}-bar-pattern-${i}`}
            patternUnits="userSpaceOnUse"
            width={pattern.width}
            height={pattern.height}
          >
            <rect width={pattern.width} height={pattern.height} fill={`var(--color-${color}-400)`} />
            {colorblindMode && (
              <path
                d={pattern.d}
                stroke={pattern.filled ? 'none' : accent}
                fill={pattern.filled ? accent : 'none'}
                strokeWidth="1.5"
              />
            )}
          </pattern>
        );
      })}
    </defs>
  );
}

export default ChartPalette;
