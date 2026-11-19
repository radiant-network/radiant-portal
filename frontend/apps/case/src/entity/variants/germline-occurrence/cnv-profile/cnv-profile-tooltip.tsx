import { type ReactNode, type Ref, useImperativeHandle, useState } from 'react';

import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';

import { geneDescription } from './libs/gene';
import type { ClickTarget } from './libs/hit-test';
import CNVGeneConstraint from './cnv-gene-constraint';

export type CNVProfileTooltipHandle = {
  show: (target: ClickTarget, x: number, y: number) => void;
  hide: () => void;
};

type CNVProfileTooltipProps = {
  ref: Ref<CNVProfileTooltipHandle>;
  segments: CNVProfileSegment[];
  genes: GeneTrackGene[];
};

type Hover = { target: ClickTarget; x: number; y: number };

const locus = (chromosome: string, start: number, end: number) =>
  `chr${chromosome}:${thousandNumberFormat(start)}-${thousandNumberFormat(end)}`;

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt className="opacity-70">{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

function CNVTooltipContent({ segment }: { segment: CNVProfileSegment }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold">
        {segment.type === 'GAIN'
          ? t('case_entity.variants.cnv_profile.hover.gain')
          : t('case_entity.variants.cnv_profile.hover.loss')}{' '}
        {locus(segment.chromosome, segment.start, segment.end)}
      </span>
      <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5">
        <Field
          label={t('case_entity.variants.cnv_profile.panel.size')}
          value={toKiloBases(segment.end - segment.start)}
        />
        <Field label={t('case_entity.variants.cnv_profile.hover.segment_mean')} value={segment.sm ?? '-'} />
        <Field label={t('case_entity.variants.cnv_profile.hover.copy_number')} value={segment.cn ?? '-'} />
        <Field label={t('case_entity.variants.cnv_profile.hover.quality')} value={segment.quality ?? '-'} />
        <Field label={t('case_entity.variants.cnv_profile.hover.filter')} value={segment.filter ?? '-'} />
      </dl>
      <span className="italic opacity-70">{t('case_entity.variants.cnv_profile.hover.click_to_zoom')}</span>
    </div>
  );
}

function GeneTooltipContent({ gene, exonIndex }: { gene: GeneTrackGene; exonIndex?: number }) {
  const { t } = useI18n();
  const exon = exonIndex === undefined ? undefined : gene.exons[exonIndex];
  const description = geneDescription(gene);
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold">
        {gene.symbol}{' '}
        <span className="font-normal opacity-70">
          {exon && exonIndex !== undefined
            ? t('case_entity.variants.cnv_profile.panel.exon', { index: exonIndex + 1, total: gene.exons.length })
            : `(${t('case_entity.variants.cnv_profile.panel.strand', { strand: gene.strand ?? '-' })})`}
        </span>
      </span>
      {!exon && description && <span>{description}</span>}
      <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5">
        {!exon && gene.biotype && (
          <Field
            label={t('case_entity.variants.cnv_profile.panel.biotype')}
            value={gene.biotype.replaceAll('_', ' ')}
          />
        )}
        <Field
          label={t('case_entity.variants.cnv_profile.panel.omim_inheritance')}
          value={gene.omim_inheritance_code?.length ? gene.omim_inheritance_code.join(', ') : '-'}
        />
        <Field
          label={t('case_entity.variants.cnv_profile.panel.pli')}
          value={<CNVGeneConstraint kind="pli" value={gene.gnomad_pli} />}
        />
        <Field
          label={t('case_entity.variants.cnv_profile.panel.loeuf')}
          value={<CNVGeneConstraint kind="loeuf" value={gene.gnomad_loeuf} />}
        />
        <Field
          label={t('case_entity.variants.cnv_profile.panel.locus')}
          value={locus(gene.chromosome, (exon ?? gene).start, (exon ?? gene).end)}
        />
        <Field
          label={t('case_entity.variants.cnv_profile.panel.size')}
          value={toKiloBases((exon ?? gene).end - (exon ?? gene).start)}
        />
        {!exon && <Field label={t('case_entity.variants.cnv_profile.panel.exons')} value={gene.exons.length} />}
      </dl>
      <span className="italic opacity-70">{t('case_entity.variants.cnv_profile.hover.click_for_details')}</span>
    </div>
  );
}

/**
 * The portal tooltip of the CNV or gene under the cursor, anchored on it. The chart drives it through
 * its handle, so that a mouse move renders the tooltip alone and not the plot.
 */
function CNVProfileTooltip({ ref, segments, genes }: CNVProfileTooltipProps) {
  const [hover, setHover] = useState<Hover | undefined>();

  useImperativeHandle(
    ref,
    () => ({ show: (target, x, y) => setHover({ target, x, y }), hide: () => setHover(undefined) }),
    [],
  );

  const { target } = hover ?? {};
  let content = null;
  if (target?.kind === 'cnv' && segments[target.index])
    content = <CNVTooltipContent segment={segments[target.index]} />;
  if (target?.kind === 'gene' && genes[target.index])
    content = <GeneTooltipContent gene={genes[target.index]} exonIndex={target.exonIndex} />;

  return (
    <Tooltip open={content !== null}>
      <TooltipTrigger asChild>
        <span
          aria-hidden
          className="pointer-events-none absolute size-0"
          style={{ left: hover?.x ?? 0, top: hover?.y ?? 0 }}
        />
      </TooltipTrigger>
      {content && (
        <TooltipContent side="top" sideOffset={10} className="max-w-80">
          {content}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export default CNVProfileTooltip;
