import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import type { PlotRelayoutEvent } from 'plotly.js';

import type { CNVProfile, GeneTrackGene } from '@/api/api';
import { usePlotlyTheme } from '@/components/base/charts/hooks/use-plotly-theme';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';
import { genesApi } from '@/utils/api';

import { useGeneTrack } from './hooks/use-gene-track';
import { type CNVProfileIds, useProfileRegion } from './hooks/use-profile-region';
import { clampView, createGenome, type GenomeView, parseLocus, regionWindow, viewAround } from './libs/genome';
import {
  type ClickTarget,
  cytobandHitAreas,
  geneHitAreas,
  hitTest,
  locusAt,
  plotFrame,
  segmentHitAreas,
} from './libs/hit-test';
import { getCNVProfilePalette } from './libs/palette';
import { withRegion } from './libs/region';
import {
  buildCloudTraces,
  buildCytobandTraces,
  buildGeneTraces,
  buildLayout,
  buildRohTraces,
  buildSegmentTraces,
  cloudMarker,
  COPY_RATIO_OUT_OF_SCALE,
  GENE_TRACK_MAX_SPAN,
  OUT_OF_SCALE_SIZE_BOOST,
  PLOT_MARGIN,
} from './libs/traces';
import CNVGenePanel from './cnv-gene-panel';
import CNVProfileLegend from './cnv-profile-legend';
import CNVProfileNavbar, { type DragMode, panView, zoomView } from './cnv-profile-navbar';

const PLOT_MARGIN_PX = PLOT_MARGIN.l + PLOT_MARGIN.r;
const PLOT_CONFIG = {
  displayModeBar: false,
  scrollZoom: false,
  doubleClick: false,
  showTips: false,
  responsive: true,
} as const;
const FORMAT = { number: (value: number) => thousandNumberFormat(value), size: toKiloBases };

type SelectedGene = { gene: GeneTrackGene; exonIndex?: number };

const rangeOf = (event: PlotRelayoutEvent): [number, number] | undefined => {
  for (const axis of ['xaxis', 'xaxis2']) {
    const range = (event as Record<string, unknown>)[`${axis}.range`] as [number, number] | undefined;
    if (range) return [Number(range[0]), Number(range[1])];
    const start = (event as Record<string, unknown>)[`${axis}.range[0]`];
    if (start !== undefined) return [Number(start), Number((event as Record<string, unknown>)[`${axis}.range[1]`])];
  }
  return undefined;
};

type CNVProfileChartProps = {
  profile: CNVProfile;
  ids: CNVProfileIds;
};

function CNVProfileChart({ profile, ids }: CNVProfileChartProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const theme = usePlotlyTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const guideLabelRef = useRef<HTMLSpanElement>(null);
  const graphRef = useRef<HTMLElement | null>(null);
  const [plotWidth, setPlotWidth] = useState(1000);
  const [rendered, setRendered] = useState(false);
  const genome = useMemo(() => createGenome(profile.chromosomes), [profile.chromosomes]);
  const [view, setView] = useState<GenomeView>({ x0: 0, x1: genome.length });
  const [dragMode, setDragMode] = useState<DragMode>('zoom');
  const [showFiltered, setShowFiltered] = useState(true);
  const [selectedGene, setSelectedGene] = useState<SelectedGene | undefined>();
  const { genes } = useGeneTrack(regionWindow(genome, view, GENE_TRACK_MAX_SPAN));
  const { overview } = profile;
  const { region, isLoading: regionLoading } = useProfileRegion(
    ids,
    overview ? regionWindow(genome, view, overview.region_max_span) : undefined,
  );
  const copyRatio = useMemo(() => withRegion(profile.copy_ratio, region, r => r.copy_ratio), [profile, region]);
  const baf = useMemo(() => withRegion(profile.baf, region, r => r.baf), [profile, region]);

  const palette = getCNVProfilePalette(theme.isDark);
  const pxPerBase = Math.max(1, plotWidth - PLOT_MARGIN_PX) / (view.x1 - view.x0);
  const showGenes = regionWindow(genome, view, GENE_TRACK_MAX_SPAN) !== undefined;
  const pointCount = useMemo(
    () => [...copyRatio, ...baf].reduce((sum, track) => sum + track.positions.length, 0),
    [copyRatio, baf],
  );

  const traceLabels = useMemo(
    () => ({
      copyRatio: t('case_entity.variants.cnv_profile.tracks.copy_ratio'),
      baf: t('case_entity.variants.cnv_profile.tracks.baf'),
      gain: t('case_entity.variants.cnv_profile.hover.gain'),
      loss: t('case_entity.variants.cnv_profile.hover.loss'),
      clickToZoom: t('case_entity.variants.cnv_profile.hover.click_to_zoom'),
      clickForDetails: t('case_entity.variants.cnv_profile.hover.click_for_details'),
      segmentMean: t('case_entity.variants.cnv_profile.hover.segment_mean'),
      copyNumber: t('case_entity.variants.cnv_profile.hover.copy_number'),
      quality: t('case_entity.variants.cnv_profile.hover.quality'),
      roh: t('case_entity.variants.cnv_profile.hover.roh'),
      homozygous: t('case_entity.variants.cnv_profile.hover.homozygous'),
      heterozygous: t('case_entity.variants.cnv_profile.hover.heterozygous'),
      score: t('case_entity.variants.cnv_profile.hover.score'),
      exons: t('case_entity.variants.cnv_profile.hover.exons'),
      exon: t('case_entity.variants.cnv_profile.hover.exon'),
    }),
    [t],
  );

  // The point clouds keep their arrays across views: Plotly only restyles their markers.
  const clouds = useMemo(
    () => [
      ...buildCloudTraces(copyRatio, genome, 'y', traceLabels.copyRatio, palette, COPY_RATIO_OUT_OF_SCALE),
      ...buildCloudTraces(baf, genome, 'y2', traceLabels.baf, palette),
    ],
    [copyRatio, baf, genome, traceLabels, palette],
  );
  const segmentTraces = useMemo(
    () => buildSegmentTraces(profile.segments, genome, palette, theme, traceLabels, FORMAT, showFiltered),
    [profile.segments, genome, palette, theme, traceLabels, showFiltered],
  );
  const rohTraces = useMemo(
    () => buildRohTraces(profile.roh, genome, palette, theme, traceLabels, FORMAT),
    [profile.roh, genome, palette, theme, traceLabels],
  );

  const data = useMemo(() => {
    const marker = cloudMarker(genome, view);
    const sizedClouds = clouds.map(trace => {
      const cloudTraceMarker = (trace as { marker: { line: object; symbol?: string } }).marker;
      return {
        ...trace,
        marker: {
          ...cloudTraceMarker,
          size: cloudTraceMarker.symbol ? marker.size + OUT_OF_SCALE_SIZE_BOOST : marker.size,
          opacity: marker.opacity,
          line: { ...cloudTraceMarker.line, width: marker.ringWidth },
        },
      };
    });
    return [
      ...sizedClouds,
      ...segmentTraces,
      ...rohTraces,
      ...buildGeneTraces(
        showGenes ? genes : [],
        genome,
        view,
        pxPerBase,
        palette,
        theme,
        traceLabels,
        FORMAT,
        selectedGene?.gene.gene_id,
      ),
      ...buildCytobandTraces(profile.cytobands, genome, view, pxPerBase, theme, traceLabels, FORMAT),
    ];
  }, [
    clouds,
    segmentTraces,
    rohTraces,
    genes,
    showGenes,
    genome,
    view,
    pxPerBase,
    palette,
    theme,
    traceLabels,
    selectedGene,
    profile.cytobands,
  ]);

  const layout = useMemo(
    () => ({
      ...buildLayout(
        genome,
        view,
        theme,
        {
          copyRatio: traceLabels.copyRatio,
          baf: traceLabels.baf,
          roh: t('case_entity.variants.cnv_profile.tracks.roh'),
          genes: t('case_entity.variants.cnv_profile.tracks.genes'),
          zoomForGenes: t('case_entity.variants.cnv_profile.hints.zoom_for_genes'),
          zoomForCytobands: t('case_entity.variants.cnv_profile.hints.zoom_for_cytobands'),
        },
        showGenes,
        position => (view.x1 - view.x0 >= 6e6 ? `${position / 1e6} Mb` : thousandNumberFormat(position)),
      ),
      dragmode: dragMode,
      autosize: true,
    }),
    [genome, view, theme, traceLabels, t, showGenes, dragMode],
  );

  const goTo = useCallback((next: GenomeView) => setView(clampView(genome, next.x0, next.x1)), [genome]);

  const zoomOnRegion = useCallback(
    (chromosome: string, start: number, end: number) =>
      setView(viewAround(genome, chromosome, start, end, Math.max((end - start) * 0.2, 2000))),
    [genome],
  );

  const focusGene = useCallback(
    (gene: GeneTrackGene, exonIndex?: number) => {
      const exon = exonIndex === undefined ? undefined : gene.exons[exonIndex];
      const [start, end] = exon ? [exon.start, exon.end] : [gene.start, gene.end];
      const margin = exon ? Math.max((end - start) * 3, 2000) : Math.max((end - start) * 0.5, 5000);
      setView(viewAround(genome, gene.chromosome, start, end, margin));
      setSelectedGene({ gene, exonIndex });
    },
    [genome],
  );

  const handleSearch = useCallback(
    async (query: string) => {
      const locus = parseLocus(genome, query);
      if (locus) {
        setView(viewAround(genome, locus.chromosome, locus.start, locus.end, (locus.end - locus.start) * 0.1));
        return true;
      }
      const response = await genesApi.geneTrack(tenant, query);
      const [gene] = response.data.filter(found => genome.byName.has(found.chromosome));
      if (!gene) return false;
      focusGene(gene);
      return true;
    },
    [genome, tenant, focusGene],
  );

  const handleRelayout = useCallback(
    (event: PlotRelayoutEvent) => {
      const range = rangeOf(event);
      if (range) goTo({ x0: range[0], x1: range[1] });
    },
    [goTo],
  );

  // Clicks hit the whole span of a CNV, a gene, an exon or a cytoband: Plotly only reports the
  // nearest point, often one of the clouds.
  const hitAreas = useMemo(
    () => [
      ...segmentHitAreas(profile.segments, genome, showFiltered),
      ...geneHitAreas(showGenes ? genes : [], genome, view, pxPerBase),
      ...cytobandHitAreas(profile.cytobands, genome, view),
    ],
    [profile.segments, profile.cytobands, genome, showFiltered, showGenes, genes, view, pxPerBase],
  );

  const handleTarget = useCallback(
    (target: ClickTarget) => {
      if (target.kind === 'cnv') {
        const segment = profile.segments[target.index];
        zoomOnRegion(segment.chromosome, segment.start, segment.end);
      } else if (target.kind === 'cytoband') {
        const band = profile.cytobands[target.index];
        zoomOnRegion(band.chromosome, band.start, band.end);
      } else {
        focusGene(genes[target.index], target.exonIndex);
      }
    },
    [profile, genes, zoomOnRegion, focusGene],
  );

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || !rendered) return;
    const targetAt = (event: MouseEvent) => hitTest(hitAreas, view, plotFrame(graph), event.clientX, event.clientY);
    // Plotly dispatches the click on its drag layer once the mouse is released without a drag.
    const handleClick = (event: MouseEvent) => {
      const target = targetAt(event);
      if (target) handleTarget(target);
    };
    // The guide is moved through the DOM: a React render per mouse move would redraw the plot.
    const hideGuide = () => guideRef.current?.style.setProperty('display', 'none');
    const moveGuide = (event: MouseEvent) => {
      const guide = guideRef.current;
      const container = containerRef.current;
      const frame = plotFrame(graph);
      const locus = locusAt(genome, view, frame, event.clientX, event.clientY);
      if (!guide || !container || !locus) return hideGuide();
      const bounds = container.getBoundingClientRect();
      guide.style.display = 'block';
      guide.style.left = `${event.clientX - bounds.left}px`;
      guide.style.top = `${frame.top - bounds.top}px`;
      guide.style.height = `${frame.height}px`;
      if (guideLabelRef.current) {
        guideLabelRef.current.textContent = `${locus.chromosome}:${thousandNumberFormat(locus.position)}`;
      }
    };
    // Plotly gives its drag layers the cursor of the drag mode; the plot keeps an arrow until a press.
    const setCursor = (cursor: string) =>
      graph.querySelectorAll<HTMLElement>('.nsewdrag').forEach(layer => {
        layer.style.cursor = cursor;
      });
    // The dialog turns off the pointer events of the page, Plotly's drag cover included: the moves of
    // a drag reach the plot, which keeps the cursor of the press while a button is down.
    const handleMove = (event: MouseEvent) => {
      if (event.buttons === 0) setCursor(targetAt(event) ? 'pointer' : 'default');
      moveGuide(event);
    };
    // Captured before Plotly's own handler, which copies this cursor onto its drag cover.
    const handlePress = (event: MouseEvent) => {
      if (!targetAt(event)) setCursor(dragMode === 'pan' ? 'move' : 'ew-resize');
    };
    graph.addEventListener('click', handleClick);
    graph.addEventListener('mousemove', handleMove);
    graph.addEventListener('mouseleave', hideGuide);
    graph.addEventListener('mousedown', handlePress, true);
    return () => {
      // The view changed: the guide shows the old position until the mouse moves again.
      hideGuide();
      graph.removeEventListener('click', handleClick);
      graph.removeEventListener('mousemove', handleMove);
      graph.removeEventListener('mouseleave', hideGuide);
      graph.removeEventListener('mousedown', handlePress, true);
    };
  }, [rendered, hitAreas, genome, view, dragMode, handleTarget]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setPlotWidth(entry.contentRect.width));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('input, select, textarea, [role="combobox"], [role="slider"]')) return;
      const moves: Record<string, (current: GenomeView) => GenomeView> = {
        ArrowLeft: current => panView(current, -0.25),
        ArrowRight: current => panView(current, 0.25),
        '+': current => zoomView(current, (current.x1 - current.x0) / 2),
        '=': current => zoomView(current, (current.x1 - current.x0) / 2),
        '-': current => zoomView(current, (current.x1 - current.x0) * 2),
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      setView(current => {
        const next = move(current);
        return clampView(genome, next.x0, next.x1);
      });
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [genome]);

  return (
    <div className="flex h-full flex-col gap-3">
      <CNVProfileNavbar
        genome={genome}
        view={view}
        onViewChange={goTo}
        dragMode={dragMode}
        onDragModeChange={setDragMode}
        showFiltered={showFiltered}
        onShowFilteredChange={setShowFiltered}
        onSearch={handleSearch}
        pointCount={pointCount}
      />
      <CNVProfileLegend palette={palette} />
      {overview && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          {regionLoading && <Spinner size={12} />}
          {region
            ? t('case_entity.variants.cnv_profile.overview.detailed')
            : t('case_entity.variants.cnv_profile.overview.reduced', {
                copyRatioStride: overview.copy_ratio_stride,
                bafStride: overview.baf_stride,
                span: toKiloBases(overview.region_max_span),
              })}
        </p>
      )}
      <div ref={containerRef} className="relative min-h-0 flex-1">
        <Plot
          data={data}
          layout={layout}
          config={PLOT_CONFIG}
          useResizeHandler
          className="size-full"
          onInitialized={(_, graph) => {
            graphRef.current = graph;
            setRendered(true);
          }}
          onRelayout={handleRelayout}
        />
        <div
          ref={guideRef}
          aria-hidden
          className="pointer-events-none absolute hidden border-l border-dashed border-muted-foreground"
        >
          <span
            ref={guideLabelRef}
            className="absolute -top-5 -translate-x-1/2 whitespace-nowrap rounded-sm bg-background/90 px-1 text-xs text-muted-foreground"
          />
        </div>
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Spinner size={32} />
          </div>
        )}
        {selectedGene && (
          <CNVGenePanel
            gene={selectedGene.gene}
            exonIndex={selectedGene.exonIndex}
            segments={profile.segments}
            onSegmentClick={segment => zoomOnRegion(segment.chromosome, segment.start, segment.end)}
            onClose={() => setSelectedGene(undefined)}
          />
        )}
      </div>
    </div>
  );
}

export default CNVProfileChart;
