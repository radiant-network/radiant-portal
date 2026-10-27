import { XIcon } from 'lucide-react';

import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';
import OmimCell from '@/components/base/data-table/cells/omim-cell';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';

import { useGeneCNVOverlaps } from './hooks/use-gene-cnv-overlaps';
import type { CNVProfileIds } from './hooks/use-profile-region';
import { geneDescription } from './libs/gene';
import { cnvsOnGene, exonsHit } from './libs/overlap';
import CNVGeneConstraint from './cnv-gene-constraint';

type CNVGenePanelProps = {
  ids: CNVProfileIds;
  gene: GeneTrackGene;
  exonIndex?: number;
  segments: CNVProfileSegment[];
  onSegmentClick: (segment: CNVProfileSegment) => void;
  onClose: () => void;
};

const locus = (chromosome: string, start: number, end: number) =>
  `chr${chromosome}:${thousandNumberFormat(start)}-${thousandNumberFormat(end)}`;

function CNVGenePanel({ ids, gene, exonIndex, segments, onSegmentClick, onClose }: CNVGenePanelProps) {
  const { t } = useI18n();
  const exon = exonIndex === undefined ? undefined : gene.exons[exonIndex];
  const cnvs = cnvsOnGene(segments, gene);
  const { overlaps, isLoading: overlapsLoading } = useGeneCNVOverlaps(ids, gene, cnvs);
  const symbol = encodeURIComponent(gene.symbol);
  const links = [
    { name: 'OMIM', href: `https://www.omim.org/search?search=${symbol}` },
    {
      name: 'gnomAD',
      href: `https://gnomad.broadinstitute.org/gene/${encodeURIComponent(gene.gene_id)}?dataset=gnomad_r4`,
    },
    { name: 'ClinGen', href: `https://search.clinicalgenome.org/kb/genes?search=${symbol}` },
    {
      name: 'Ensembl',
      href: `https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${encodeURIComponent(gene.gene_id)}`,
    },
    { name: 'GeneCards', href: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${symbol}` },
  ];

  // The overlap columns of the CNV table, under the same names. The exons are the merged exons of
  // the gene: the table counts every exon id of every transcript, so a CNV over ORM1's 6 exons hits 10.
  const overlapText = (segment: CNVProfileSegment) => {
    const overlap = overlaps[segment.cnv_id];
    const pending = overlapsLoading ? '…' : '-';
    const percent = (value: number, fractionDigits: number) =>
      thousandNumberFormat(value, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    return [
      `${t('variant.headers.nb_overlap_bases')} ${overlap ? toKiloBases(overlap.nb_overlap_bases) : pending}`,
      `${t('variant.headers.nb_exons')} ${exonsHit(gene, segment)}`,
      `${t('variant.headers.overlapping_gene_percent')} ${overlap ? percent(overlap.overlapping_gene_percent, 0) : pending}`,
      `${t('variant.headers.overlapping_cnv_percent')} ${overlap ? percent(overlap.overlapping_cnv_percent, 2) : pending}`,
    ].join(' · ');
  };

  return (
    <Card size="sm" className="absolute top-2 right-2 z-10 w-96 max-h-full overflow-y-auto shadow-lg">
      <CardHeader>
        <CardTitle>
          {gene.symbol}{' '}
          <span className="text-sm font-normal text-muted-foreground">
            ({t('case_entity.variants.cnv_profile.panel.strand', { strand: gene.strand ?? '-' })})
          </span>
        </CardTitle>
        {geneDescription(gene) && <CardDescription>{geneDescription(gene)}</CardDescription>}
        <CardAction>
          <Button size="xs" variant="ghost" iconOnly aria-label={t('a11y.cnv_profile.close_panel')} onClick={onClose}>
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.locus')}</dt>
          <dd className="tabular-nums">{locus(gene.chromosome, gene.start, gene.end)}</dd>
          {gene.biotype && (
            <>
              <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.biotype')}</dt>
              <dd>{gene.biotype.replaceAll('_', ' ')}</dd>
            </>
          )}
          <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.omim_inheritance')}</dt>
          <dd>
            <OmimCell codes={gene.omim_inheritance_code} />
          </dd>
          <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.pli')}</dt>
          <dd>
            <CNVGeneConstraint kind="pli" value={gene.gnomad_pli} />
          </dd>
          <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.loeuf')}</dt>
          <dd>
            <CNVGeneConstraint kind="loeuf" value={gene.gnomad_loeuf} />
          </dd>
          <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.size')}</dt>
          <dd>{toKiloBases(gene.end - gene.start)}</dd>
          <dt className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.exons')}</dt>
          <dd>{gene.exons.length}</dd>
        </dl>

        {exon && exonIndex !== undefined && (
          <section className="flex flex-col gap-1">
            <h3 className="text-xs font-medium uppercase text-muted-foreground">
              {t('case_entity.variants.cnv_profile.panel.exon', { index: exonIndex + 1, total: gene.exons.length })}
            </h3>
            <span className="tabular-nums">
              {locus(gene.chromosome, exon.start, exon.end)} · {toKiloBases(exon.end - exon.start)}
            </span>
          </section>
        )}

        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase text-muted-foreground">
            {t('case_entity.variants.cnv_profile.panel.cnvs')}
          </h3>
          {cnvs.length === 0 && (
            <span className="text-muted-foreground">{t('case_entity.variants.cnv_profile.panel.no_cnv')}</span>
          )}
          <ul className="flex flex-col gap-2">
            {cnvs.map(segment => (
              <li key={segment.cnv_id}>
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col items-start gap-1 py-2 text-left"
                  onClick={() => onSegmentClick(segment)}
                >
                  <span className="flex items-center gap-2">
                    <Badge variant={segment.type === 'GAIN' ? 'blue' : 'red'}>
                      {segment.type === 'GAIN'
                        ? t('case_entity.variants.cnv_profile.hover.gain')
                        : t('case_entity.variants.cnv_profile.hover.loss')}
                    </Badge>
                    {t('case_entity.variants.cnv_profile.hover.copy_number')} {segment.cn ?? '-'} ·{' '}
                    {segment.filter ?? '-'}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground tabular-nums">
                    {locus(segment.chromosome, segment.start, segment.end)} · {toKiloBases(segment.end - segment.start)}
                  </span>
                  <span className="text-xs font-normal whitespace-normal text-muted-foreground tabular-nums">
                    {overlapText(segment)}
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
            {links.map(link => (
              <AnchorLink key={link.name} href={link.href} target="_blank" rel="noreferrer" size="sm" external>
                {link.name}
              </AnchorLink>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default CNVGenePanel;
