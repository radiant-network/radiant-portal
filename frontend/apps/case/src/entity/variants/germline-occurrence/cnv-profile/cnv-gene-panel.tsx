import { XIcon } from 'lucide-react';

import type { CNVProfileSegment, GeneTrackGene } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';

import { cnvsOnGene, exonsHit } from './libs/overlap';

type CNVGenePanelProps = {
  gene: GeneTrackGene;
  exonIndex?: number;
  segments: CNVProfileSegment[];
  onSegmentClick: (segment: CNVProfileSegment) => void;
  onClose: () => void;
};

const locus = (chromosome: string, start: number, end: number) =>
  `chr${chromosome}:${thousandNumberFormat(start)}-${thousandNumberFormat(end)}`;

function CNVGenePanel({ gene, exonIndex, segments, onSegmentClick, onClose }: CNVGenePanelProps) {
  const { t } = useI18n();
  const exon = exonIndex === undefined ? undefined : gene.exons[exonIndex];
  const cnvs = cnvsOnGene(segments, gene);
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

  const hitText = (segment: CNVProfileSegment) => {
    const hit = exonsHit(gene, segment);
    if (hit === 0) return t('case_entity.variants.cnv_profile.panel.intronic');
    if (hit === gene.exons.length) return t('case_entity.variants.cnv_profile.panel.whole_gene');
    return t('case_entity.variants.cnv_profile.panel.exons_hit', { count: hit, total: gene.exons.length });
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
        {gene.description && <CardDescription>{gene.description}</CardDescription>}
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
                    {locus(segment.chromosome, segment.start, segment.end)} · {toKiloBases(segment.end - segment.start)}{' '}
                    · {hitText(segment)}
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
