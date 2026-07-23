export type MessageRole = 'user' | 'assistant';

/** A text block — plain prose from the user or the assistant. */
export type TextBlock = { type: 'text'; content: string };

export type TableColumn = { key: string; label: string };

/** A tabular result — rendered with the simple shadcn Table. */
export type TableBlock = {
  type: 'table';
  title?: string;
  columns: TableColumn[];
  rows: Record<string, string>[];
};

export type ChartDatum = { label: string; count: number };

/**
 * A single-series categorical chart. POC: always rendered as a horizontal bar
 * chart. To support more types, add a discriminant here (e.g. `chart: 'bar' | 'pie'`)
 * and switch on it in blocks/chart-block.tsx.
 */
export type ChartBlock = {
  type: 'chart';
  title?: string;
  categoryLabel: string;
  valueLabel: string;
  data: ChartDatum[];
};

/**
 * A typed reply fragment. The assistant returns a list of these, and
 * `<BlockRenderer>` maps each one to a component — this is the "generative UI".
 */
export type Block = TextBlock | TableBlock | ChartBlock;

export type Message = {
  id: string;
  role: MessageRole;
  blocks: Block[];
};
