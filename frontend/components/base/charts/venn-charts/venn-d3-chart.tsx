import { OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import D3ClipCircle from '../shapes/d3-clip-circle';
import D3Region from '../shapes/d3-region';
import D3Text from '../shapes/d3-text';
import { thousandNumberFormat } from '@/components/lib/number-format';

export const VENN_ID = 'venn-diagram';

const CIRCLE_1 = `c1`;
const CIRCLE_1_OUT = `c1-out`;
const CIRCLE_2 = `c2`;
const CIRCLE_2_OUT = `c2-out`;
const CIRCLE_3 = `c3`;
const CIRCLE_3_OUT = `c3-out`;

const MAX_COUNT = 10000;
const MIN_PADDING_OFFSET = 24;
const MAX_PADDING_OFFSET = 80;

// keep a aspect ratio of 4/3
const MIN_SET_WIDTH = 600;
const MIN_SET_HEIGHT = 400;
const MAX_SET_WIDTH = 800;
const MAX_SET_HEIGHT = 600;

type Operation = {
  setId: string;
  count: number;
};

type VennD3ChartProps = {
  sets: string[];
  operations: Operation[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  radius?: number;
  factor?: number;
  outlineWidth?: number;
  scale?: {
    max: number;
    min: number;
  };
};

function isCountInvalid(count: number): boolean {
  return count === 0 || count > MAX_COUNT;
}

function toggleSelection(rowSelection: RowSelectionState, index: number): RowSelectionState {
  if (rowSelection[index]) {
    const { [index]: _, ...rest } = rowSelection;
    return rest;
  }
  return { ...rowSelection, [index]: true };
}

function VennD3Chart({
  sets,
  operations,
  rowSelection,
  onRowSelectionChange,
  radius = 130,
  factor = 0.75,
  scale = { min: 1.0, max: 1.0 },
  outlineWidth = 1.5,
}: VennD3ChartProps) {
  let width = MIN_SET_WIDTH / scale.min;
  let height = MIN_SET_HEIGHT / scale.min;
  let paddingOffset = MIN_PADDING_OFFSET / scale.min;

  if (sets.length > 2) {
    width = MAX_SET_WIDTH / scale.max;
    height = MAX_SET_HEIGHT / scale.max;
    paddingOffset = MAX_PADDING_OFFSET / scale.max;
  }

  const cy = (1.0 / sets.length) * height + paddingOffset;
  const cx = 0.5 * width;

  // Circle centers (angles: Q1 = 300°, Q2 = 60°, Q3 = 180°)
  const c1x = cx + Math.sin((Math.PI * 300) / 180) * radius * factor;
  const c1y = cy - Math.cos((Math.PI * 300) / 180) * radius * factor;
  const c2x = cx + Math.sin((Math.PI * 60) / 180) * radius * factor;
  const c2y = cy - Math.cos((Math.PI * 60) / 180) * radius * factor;
  const c3x = cx + Math.sin((Math.PI * 180) / 180) * radius * factor;
  const c3y = cy - Math.cos((Math.PI * 180) / 180) * radius * factor;

  return (
    <svg id={VENN_ID} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <D3ClipCircle id={CIRCLE_1} cx={c1x} cy={c1y} r={radius} />
        <D3ClipCircle id={CIRCLE_1_OUT} cx={c1x} cy={c1y} r={radius + outlineWidth} />
        <D3ClipCircle id={CIRCLE_2} cx={c2x} cy={c2y} r={radius} />
        <D3ClipCircle id={CIRCLE_2_OUT} cx={c2x} cy={c2y} r={radius + outlineWidth} />
        {sets.length === 3 && (
          <>
            <D3ClipCircle id={CIRCLE_3} cx={c3x} cy={c3y} r={radius} />
            <D3ClipCircle id={CIRCLE_3_OUT} cx={c3x} cy={c3y} r={radius + outlineWidth} />
          </>
        )}
      </defs>

      {/* Circle 1 - (2 sets) Q₁-Q₂ | (3 sets) Q₁-(Q₂∪Q₃) */}
      <D3Region clipPaths={[CIRCLE_1_OUT]} variant="outline" />
      <D3Region
        clipPaths={[CIRCLE_1]}
        variant="fill"
        id={operations[0].setId}
        disabled={isCountInvalid(operations[0].count)}
        selected={rowSelection[0]}
        onClick={() => {
          onRowSelectionChange(toggleSelection(rowSelection, 0));
        }}
      />
      <D3Text
        x={cx + Math.sin((Math.PI * 300) / 180) * 2.5 * radius * factor}
        y={cy - Math.cos((Math.PI * 300) / 180) * 2.5 * radius * factor}
        anchor="end"
      >
        {sets[0]}
      </D3Text>

      <D3Text
        x={cx + Math.sin((Math.PI * 300) / 180) * 1.1 * radius * factor}
        y={cy - Math.cos((Math.PI * 300) / 180) * 1.0 * radius * factor}
        anchor="end"
        disabled={isCountInvalid(operations[0].count)}
      >
        {thousandNumberFormat(operations[0].count)}
      </D3Text>

      {/* Circle 2 - (2 sets) Q₂-Q₁ | (3 sets) Q₂-(Q₁∪Q₃) */}
      <D3Region clipPaths={[CIRCLE_2_OUT]} variant="outline" />
      <D3Region
        clipPaths={[CIRCLE_2]}
        variant="fill"
        id={operations[1].setId}
        disabled={isCountInvalid(operations[1].count)}
        selected={rowSelection[1]}
        onClick={() => {
          onRowSelectionChange(toggleSelection(rowSelection, 1));
        }}
      />
      <D3Text
        x={cx + Math.sin((Math.PI * 60) / 180) * 2.5 * radius * factor}
        y={cy - Math.cos((Math.PI * 60) / 180) * 2.5 * radius * factor}
        anchor="start"
      >
        {sets[1]}
      </D3Text>
      <D3Text
        x={cx + Math.sin((Math.PI * 60) / 180) * 1.1 * radius * factor}
        y={cy - Math.cos((Math.PI * 60) / 180) * 1.0 * radius * factor}
        anchor="start"
        disabled={isCountInvalid(operations[1].count)}
      >
        {thousandNumberFormat(operations[1].count)}
      </D3Text>

      {/* Intersection outline (2 sets) Q₁∩Q₂ | (3 sets) (Q₁∩Q₂)-Q₃ & (Q₂∩Q₃)-Q₁ */}
      <D3Region clipPaths={[CIRCLE_2_OUT, CIRCLE_1_OUT]} variant="outline" />

      {sets.length === 2 && (
        <>
          <D3Region
            clipPaths={[CIRCLE_2, CIRCLE_1]}
            variant="fill"
            id={operations[2].setId}
            disabled={isCountInvalid(operations[2].count)}
            selected={rowSelection[2]}
            onClick={() => {
              onRowSelectionChange(toggleSelection(rowSelection, 2));
            }}
          />
          <D3Text
            x={cx + Math.sin((Math.PI * 360) / 180) * 0.85 * radius * factor}
            y={cy - Math.cos((Math.PI * 360) / 180) * 0.5 * radius * factor}
            anchor="middle"
            disabled={isCountInvalid(operations[2].count)}
          >
            {thousandNumberFormat(operations[2].count)}
          </D3Text>
        </>
      )}

      {sets.length === 3 && (
        <>
          {/* (Q₁∩Q₂)-Q₃ fill (the pairwise intersection minus Q₃ */}
          <D3Region
            id={operations[3].setId}
            clipPaths={[CIRCLE_2, CIRCLE_1]}
            variant="fill"
            disabled={isCountInvalid(operations[3].count)}
            selected={rowSelection[3]}
            onClick={() => {
              onRowSelectionChange(toggleSelection(rowSelection, 3));
            }}
          />

          {/* Circle 3 - Q₃-(Q₁∪Q₂) */}
          <D3Region clipPaths={[CIRCLE_3_OUT]} variant="outline" />
          <D3Region
            clipPaths={[CIRCLE_3]}
            variant="fill"
            id={operations[2].setId}
            disabled={isCountInvalid(operations[2].count)}
            selected={rowSelection[2]}
            onClick={() => {
              onRowSelectionChange(toggleSelection(rowSelection, 2));
            }}
          />
          <D3Text
            x={cx + Math.sin((Math.PI * 180) / 180) * 2.6 * radius * factor}
            y={cy - Math.cos((Math.PI * 180) / 180) * 2.6 * radius * factor}
            anchor="middle"
          >
            {sets[2]}
          </D3Text>
          <D3Text
            x={cx + Math.sin((Math.PI * 180) / 180) * 1.1 * radius * factor}
            y={cy - Math.cos((Math.PI * 180) / 180) * 1.1 * radius * factor}
            anchor="middle"
            disabled={isCountInvalid(operations[2].count)}
          >
            {thousandNumberFormat(operations[2].count)}
          </D3Text>

          {/* Count for (Q₁∩Q₂)-Q₃ */}
          <D3Text
            x={cx + Math.sin((Math.PI * 360) / 180) * 0.85 * radius * factor}
            y={cy - Math.cos((Math.PI * 360) / 180) * 0.85 * radius * factor}
            anchor="middle"
            disabled={isCountInvalid(operations[3].count)}
          >
            {thousandNumberFormat(operations[3].count)}
          </D3Text>

          {/* Intersection (Q₂∩Q₃)-Q₁ */}
          <D3Region clipPaths={[CIRCLE_3_OUT, CIRCLE_2_OUT]} variant="outline" />
          <D3Region
            id={operations[4].setId}
            clipPaths={[CIRCLE_3, CIRCLE_2]}
            variant="fill"
            disabled={isCountInvalid(operations[4].count)}
            selected={rowSelection[4]}
            onClick={() => {
              onRowSelectionChange(toggleSelection(rowSelection, 4));
            }}
          />
          <D3Text
            x={cx + Math.sin((Math.PI * 120) / 180) * 0.85 * radius * factor}
            y={cy - Math.cos((Math.PI * 120) / 180) * 0.85 * radius * factor}
            anchor="middle"
            disabled={isCountInvalid(operations[4].count)}
          >
            {thousandNumberFormat(operations[4].count)}
          </D3Text>

          {/* Intersection (Q₁∩Q₃)-Q₂ */}
          <D3Region clipPaths={[CIRCLE_1_OUT, CIRCLE_3_OUT]} variant="outline" />
          <D3Region
            id={operations[5].setId}
            clipPaths={[CIRCLE_1, CIRCLE_3]}
            variant="fill"
            disabled={isCountInvalid(operations[5].count)}
            selected={rowSelection[5]}
            onClick={() => {
              onRowSelectionChange(toggleSelection(rowSelection, 5));
            }}
          />
          <D3Text
            x={cx + Math.sin((Math.PI * 240) / 180) * 0.85 * radius * factor}
            y={cy - Math.cos((Math.PI * 240) / 180) * 0.85 * radius * factor}
            anchor="middle"
            disabled={isCountInvalid(operations[5].count)}
          >
            {thousandNumberFormat(operations[5].count)}
          </D3Text>

          {/* Triple intersection Q₁∩Q₂∩Q₃ */}
          <D3Region clipPaths={[CIRCLE_1_OUT, CIRCLE_2_OUT, CIRCLE_3_OUT]} variant="outline" />
          <D3Region
            id={operations[6].setId}
            clipPaths={[CIRCLE_1, CIRCLE_2, CIRCLE_3]}
            variant="fill"
            disabled={isCountInvalid(operations[6].count)}
            selected={rowSelection[6]}
            onClick={() => {
              onRowSelectionChange(toggleSelection(rowSelection, 6));
            }}
          />
          <D3Text x={cx} y={cy} anchor="middle" disabled={isCountInvalid(operations[6].count)}>
            {thousandNumberFormat(operations[6].count)}
          </D3Text>
        </>
      )}
    </svg>
  );
}
export default VennD3Chart;
