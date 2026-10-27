import { XIcon } from 'lucide-react';

import type { CNVGeneOverlap, CNVProfileSegment } from '@/api/api';
import { usePlotlyTheme } from '@/components/base/charts/hooks/use-plotly-theme';
import GnomadCell from '@/components/base/data-table/cells/gnomad-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Spinner } from '@/components/base/spinner';
import { getClingenCnvUrl, getFranklinCnvUrl } from '@/components/base/variant/utils';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';

import { useCNVGeneOverlaps } from './hooks/use-cnv-gene-overlaps';
import type { CNVProfileIds } from './hooks/use-profile-region';
import { exonsHit } from './libs/overlap';
import { getCNVProfilePalette } from './libs/palette';
import { PROTEIN_CODING } from './libs/traces';
import CNVGeneConstraint from './cnv-gene-constraint';

type CNVSegmentPanelProps = {
  ids: CNVProfileIds;
  segment: CNVProfileSegment;
  onGeneClick: (symbol: string) => void;
  onClose: () => void;
};

const locus = (chromosome: string, start: number, end: number) =>
  `chr${chromosome}:${thousandNumberFormat(start)}-${thousandNumberFormat(end)}`;

const percent = (value: number, fractionDigits: number) =>
  thousandNumberFormat(value, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });

/**
 * The details of a called CNV: its calls, its Franklin link and the genes it overlaps, with the
 * columns of the overlapping genes of the CNV table. The exons hit are counted on the merged exons
 * of each gene, as in the gene panel. The protein-coding genes come first, edged in the colour of
 * their track.
 */
function CNVSegmentPanel({ ids, segment, onGeneClick, onClose }: CNVSegmentPanelProps) {
  const { t } = useI18n();
  const { overlaps, trackGenes, isLoading } = useCNVGeneOverlaps(ids, segment);
  const palette = getCNVProfilePalette(usePlotlyTheme().isDark);
  const gain = segment.type === 'GAIN';
  const genes = [...overlaps].sort(
    (a, b) => Number(b.biotype === PROTEIN_CODING) - Number(a.biotype === PROTEIN_CODING),
  );

  const exonsText = (overlap: CNVGeneOverlap) => {
    const gene = trackGenes[overlap.gene_id];
    return gene ? exonsHit(gene, segment) : '-';
  };

  const fields = [
    { label: t('case_entity.variants.cnv_profile.panel.size'), value: toKiloBases(segment.end - segment.start) },
    { label: t('case_entity.variants.cnv_profile.hover.copy_number'), value: segment.cn ?? '-' },
    { label: t('case_entity.variants.cnv_profile.hover.segment_mean'), value: segment.sm ?? '-' },
    { label: t('case_entity.variants.cnv_profile.hover.quality'), value: segment.quality ?? '-' },
    { label: t('case_entity.variants.cnv_profile.hover.filter'), value: segment.filter ?? '-' },
    { label: t('variant.headers.nb_snv'), value: segment.nb_snv ?? '-' },
    { label: t('variant.headers.gnomad_sf'), value: <GnomadCell value={segment.gnomad_sf} /> },
  ];

  return (
    <Card size="sm" className="absolute top-2 right-2 z-10 w-96 max-h-full overflow-y-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant={gain ? 'blue' : 'red'}>
            {gain ? t('case_entity.variants.cnv_profile.hover.gain') : t('case_entity.variants.cnv_profile.hover.loss')}
          </Badge>
          <span className="tabular-nums">{locus(segment.chromosome, segment.start, segment.end)}</span>
        </CardTitle>
        <CardAction>
          <Button
            size="xs"
            variant="ghost"
            iconOnly
            aria-label={t('a11y.cnv_profile.close_cnv_panel')}
            onClick={onClose}
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          {fields.map(field => (
            <div key={field.label} className="contents">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className="tabular-nums">{field.value}</dd>
            </div>
          ))}
        </dl>

        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase text-muted-foreground">
            {t('case_entity.variants.cnv_profile.panel.genes', { count: overlaps.length })}
          </h3>
          {isLoading && <Spinner size={16} />}
          {!isLoading && overlaps.length === 0 && (
            <span className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.no_gene')}</span>
          )}
          <ul className="flex flex-col gap-2">
            {genes.map(overlap => (
              <li key={overlap.gene_id}>
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col items-start gap-1 border-l-4 py-2 text-left"
                  style={{ borderLeftColor: overlap.biotype === PROTEIN_CODING ? palette.gene : palette.geneOther }}
                  onClick={() => onGeneClick(overlap.symbol)}
                >
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold">{overlap.symbol}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      ({t('case_entity.variants.cnv_profile.panel.strand', { strand: overlap.strand ?? '-' })})
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">{overlap.cytoband?.join(', ')}</span>
                    {overlap.biotype && overlap.biotype !== PROTEIN_CODING && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {overlap.biotype.replaceAll('_', ' ')}
                      </span>
                    )}
                    {overlap.omim_inheritance_code?.map(code => (
                      <Badge key={code} variant="outline" title={t(`variant.omim.${code}`)}>
                        {code}
                      </Badge>
                    ))}
                  </span>
                  <span className="flex flex-wrap gap-x-1 text-xs font-normal text-muted-foreground tabular-nums">
                    {[
                      `${t('variant.headers.gene_length')} ${toKiloBases(overlap.gene_length)}`,
                      `${t('variant.headers.nb_overlap_bases')} ${toKiloBases(overlap.nb_overlap_bases)}`,
                      `${t('variant.headers.nb_exons')} ${exonsText(overlap)}`,
                      `${t('variant.headers.overlapping_gene_percent')} ${percent(overlap.overlapping_gene_percent, 0)}`,
                      `${t('variant.headers.overlapping_cnv_percent')} ${percent(overlap.overlapping_cnv_percent, 2)}`,
                    ].map(item => (
                      <span key={item} className="whitespace-nowrap">
                        {item} ·
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t('case_entity.variants.cnv_profile.panel.pli')}{' '}
                      <CNVGeneConstraint kind="pli" value={overlap.gnomad_pli} /> ·
                    </span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      {t('case_entity.variants.cnv_profile.panel.loeuf')}{' '}
                      <CNVGeneConstraint kind="loeuf" value={overlap.gnomad_loeuf} />
                    </span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase text-muted-foreground">
            {t('case_entity.variants.cnv_profile.panel.links')}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <AnchorLink
              href={getFranklinCnvUrl(segment.chromosome, segment.start, segment.end, segment.type)}
              target="_blank"
              rel="noreferrer"
              size="sm"
              external
            >
              Franklin
            </AnchorLink>
            <AnchorLink
              href={getClingenCnvUrl(segment.chromosome, segment.start, segment.end)}
              target="_blank"
              rel="noreferrer"
              size="sm"
              external
            >
              ClinGen
            </AnchorLink>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default CNVSegmentPanel;
