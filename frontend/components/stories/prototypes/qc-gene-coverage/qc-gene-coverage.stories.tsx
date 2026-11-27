import { useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router';
import type { Meta, StoryObj } from '@storybook/react-vite';

import DataTable, {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';
import DistributionBar, {
  type DistributionBarColor,
  type DistributionBarItem,
} from '@/components/base/distribution-bar/distribution-bar';
import DistributionFilter from '@/components/base/distribution-bar/distribution-filter';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { ApplicationId, ConfigProvider, type PortalConfig } from '@/components/cores/applications-config';
import { cn } from '@/components/lib/utils';

import { geneCoverageMock } from './qc-gene-coverage-mock';
import {
  type CoverageCriteria,
  type CoverageStatus,
  CUTOFFS,
  DEFAULT_CUTOFF,
  DEFAULT_DEPTH,
  DEPTHS,
  type GeneCoverage,
  getCellTone,
  getStatus,
  pctAt,
  sortWorstFirst,
} from './qc-gene-coverage-rules';

// Minimal config: the data table only needs a provider, not real apps.
const config = {
  variant_entity: { app_id: ApplicationId.variant_entity },
  admin: { admin_code: 'admin', app_id: ApplicationId.admin },
  portal: { name: '', default_language: 'en', navigation: {} },
} as unknown as PortalConfig;

// Classes already used by the Badge, so Tailwind generates them (stories are not scanned).
const TONE_CLASSES: Record<CoverageStatus, string> = {
  pass: 'bg-green/20 text-green-foreground',
  warning: 'bg-amber/20 text-amber-foreground',
  fail: 'bg-red/20 text-red-foreground',
  unmappable: '',
};

// Plain CSS: stories are not scanned by Tailwind, and `border-primary` would recolour the row separators too.
const SELECTED_DEPTH_FRAME = 'border-l border-r qc-selected-depth';
const SELECTED_DEPTH_FRAME_CSS =
  '.qc-selected-depth { border-left-color: var(--primary); border-right-color: var(--primary); }';

const STATUS_BADGES: Record<CoverageStatus, { label: string; variant: 'green' | 'amber' | 'red' | 'neutral' }> = {
  pass: { label: 'Pass', variant: 'green' },
  warning: { label: 'Warning', variant: 'amber' },
  fail: { label: 'Fail', variant: 'red' },
  unmappable: { label: 'Unmappable', variant: 'neutral' },
};

const columnHelper = createAppColumnHelper<GeneCoverage>();

function getColumns(criteria: CoverageCriteria, showAllDepths: boolean) {
  const shownDepths: readonly number[] = showAllDepths ? DEPTHS : [criteria.depth];

  return [
    columnHelper.accessor(row => row.gene, {
      id: 'gene',
      header: 'Gene',
      cell: info => <span className="font-semibold">{info.getValue()}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row, {
      id: 'status',
      header: 'Status',
      cell: info => {
        const badge = STATUS_BADGES[getStatus(info.getValue(), criteria)];
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.size, {
      id: 'size',
      header: 'Size (bp)',
      cell: info => info.getValue().toLocaleString('en'),
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.mean, {
      id: 'mean',
      header: 'Mean cov.',
      cell: info => `${info.getValue().toFixed(1)}x`,
      enableSorting: false,
    }),
    ...shownDepths.map(depth => {
      const isSelected = depth === criteria.depth;
      const frameClassName = showAllDepths && isSelected ? SELECTED_DEPTH_FRAME : undefined;
      return columnHelper.accessor(row => pctAt(row, depth), {
        id: `pct_${depth}`,
        header: () => <span className={isSelected ? 'font-semibold' : undefined}>{`% ≥ ${depth}x`}</span>,
        cell: info => <span className={isSelected ? 'font-semibold' : undefined}>{info.getValue().toFixed(1)}</span>,
        enableSorting: false,
        meta: {
          headerClassName: frameClassName,
          getCellClassName: (gene: GeneCoverage) => {
            const tone = getCellTone(gene, depth, criteria);
            return cn(tone && TONE_CLASSES[tone], frameClassName);
          },
        },
      });
    }),
  ] as TableColumnDef<GeneCoverage, any>[];
}

const defaultColumnSettings = createColumnSettings([
  { id: 'gene', visible: true, label: 'Gene' },
  { id: 'status', visible: true, label: 'Status' },
  { id: 'size', visible: true, label: 'Size (bp)' },
  { id: 'mean', visible: true, label: 'Mean cov.' },
  ...DEPTHS.map(depth => ({ id: `pct_${depth}`, visible: true, label: `% ≥ ${depth}x` })),
]);

// Bar and legend order: best to worst, unmappable last.
const DISTRIBUTION_STATUSES: { status: CoverageStatus; color: DistributionBarColor }[] = [
  { status: 'pass', color: 'emerald' },
  { status: 'warning', color: 'amber' },
  { status: 'fail', color: 'red' },
  { status: 'unmappable', color: 'grey' },
];

function getDistributionItems(genes: GeneCoverage[], criteria: CoverageCriteria): DistributionBarItem[] {
  return DISTRIBUTION_STATUSES.map(({ status, color }) => ({
    key: status,
    label: STATUS_BADGES[status].label,
    value: genes.filter(gene => getStatus(gene, criteria) === status).length,
    color,
  }));
}

function GeneCoveragePrototype() {
  const [depth, setDepth] = useState<number>(DEFAULT_DEPTH);
  const [cutoff, setCutoff] = useState<number>(DEFAULT_CUTOFF);
  const [showAllDepths, setShowAllDepths] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const criteria = useMemo(() => ({ depth, cutoff }), [depth, cutoff]);
  const columns = useMemo(() => getColumns(criteria, showAllDepths), [criteria, showAllDepths]);
  const data = useMemo(
    () =>
      sortWorstFirst(geneCoverageMock, criteria).filter(
        gene => selectedStatuses.length === 0 || selectedStatuses.includes(getStatus(gene, criteria)),
      ),
    [criteria, selectedStatuses],
  );
  const distributionItems = useMemo(() => getDistributionItems(geneCoverageMock, criteria), [criteria]);
  const cutoffLabel = cutoff === 100 ? '100%' : `≥ ${cutoff}%`;

  return (
    <div className="flex flex-col gap-4">
      <style>{SELECTED_DEPTH_FRAME_CSS}</style>
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Minimum depth</span>
            <Select value={String(depth)} onValueChange={value => setDepth(Number(value))}>
              <SelectTrigger className="w-40" aria-label="Minimum depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPTHS.map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Bases at this depth</span>
            <Select value={String(cutoff)} onValueChange={value => setCutoff(Number(value))}>
              <SelectTrigger className="w-40" aria-label="Bases at this depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUTOFFS.map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option === 100 ? '100%' : `≥ ${option}%`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="link"
            onClick={() => {
              setDepth(DEFAULT_DEPTH);
              setCutoff(DEFAULT_CUTOFF);
            }}
          >
            Reset to lab default (15x on 100%)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{`${geneCoverageMock.length} genes · ${depth}x on ${cutoffLabel} of bases`}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          <DistributionBar items={distributionItems} />
          <DistributionFilter
            items={distributionItems}
            value={selectedStatuses}
            onValueChange={setSelectedStatuses}
            allLabel="All"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{`${data.length} Genes`}</CardTitle>
          <Button variant="outline" onClick={() => setShowAllDepths(!showAllDepths)}>
            {showAllDepths ? 'Hide other depths' : 'Show all depths'}
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            key={`${depth}-${cutoff}-${showAllDepths}-${selectedStatuses.join()}`}
            id="qc-gene-coverage-prototype"
            columns={columns}
            defaultColumnSettings={defaultColumnSettings}
            data={data}
            total={data.length}
            loadingStates={{ total: false, list: false }}
            pagination={{ type: 'locale', state: { pageIndex: 0, pageSize: 10 } }}
            enableColumnOrdering={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

const meta = {
  title: 'Prototypes/QC Gene Coverage',
  component: GeneCoveragePrototype,
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <Story />
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof GeneCoveragePrototype>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
