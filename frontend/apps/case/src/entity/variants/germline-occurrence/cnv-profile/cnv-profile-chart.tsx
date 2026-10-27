import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import type { PlotRelayoutEvent } from 'plotly.js';

import type { CNVProfile, CNVProfileSegment, GeneTrackGene, OccurrenceFlagType } from '@/api/api';
import { usePlotlyTheme } from '@/components/base/charts/hooks/use-plotly-theme';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';
import { genesApi } from '@/utils/api';

import { useGeneTrack } from './hooks/use-gene-track';
import { type CNVProfileIds, useProfileRegion } from './hooks/use-profile-region';
import type { CNVProfileFocus } from './libs/focus';
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
import { useCNVProfile } from './cnv-profile-context';
import CNVProfileLegend from './cnv-profile-legend';
import CNVProfileNavbar, { type DragMode, panView, zoomView } from './cnv-profile-navbar';
import CNVProfileTooltip, { type CNVProfileTooltipHandle } from './cnv-profile-tooltip';
import CNVSegmentPanel from './cnv-segment-panel';

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
  focus?: CNVProfileFocus;
};

function CNVProfileChart({ profile, ids, focus }: CNVProfileChartProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const theme = usePlotlyTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const guideLabelRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<CNVProfileTooltipHandle>(null);
  const graphRef = useRef<HTMLElement | null>(null);
  const [plotWidth, setPlotWidth] = useState(1000);
  const [rendered, setRendered] = useState(false);
  const genome = useMemo(() => createGenome(profile.chromosomes), [profile.chromosomes]);
  const [view, setView] = useState<GenomeView>({ x0: 0, x1: genome.length });
  const [dragMode, setDragMode] = useState<DragMode>('zoom');
  const [showFiltered, setShowFiltered] = useState(true);
  const [annotations, setAnnotations] = useState<string[]>([]);
  const [selectedGene, setSelectedGene] = useState<SelectedGene | undefined>();
  const [selectedSegment, setSelectedSegment] = useState<CNVProfileSegment | undefined>();
  const { occurrenceChanged } = useCNVProfile();
  // The comments and flag of each CNV, once they changed in the profile: the profile is not reloaded.
  const [occurrenceChanges, setOccurrenceChanges] = useState<
    Record<string, Partial<Pick<CNVProfileSegment, 'has_note' | 'flag_type'>>>
  >({});
  const segments = useMemo(
    () =>
      profile.segments.map(segment =>
        occurrenceChanges[segment.cnv_id] ? { ...segment, ...occurrenceChanges[segment.cnv_id] } : segment,
      ),
    [profile.segments, occurrenceChanges],
  );
  const shownSegment = selectedSegment && segments.find(segment => segment.cnv_id === selectedSegment.cnv_id);

  const handleNotesChange = useCallback(
    (segment: CNVProfileSegment, hasNote: boolean) => {
      setOccurrenceChanges(current => ({
        ...current,
        [segment.cnv_id]: { ...current[segment.cnv_id], has_note: hasNote },
      }));
      occurrenceChanged();
    },
    [occurrenceChanged],
  );
  const handleFlagChange = useCallback(
    (segment: CNVProfileSegment, flag: OccurrenceFlagType | undefined) => {
      setOccurrenceChanges(current => ({
        ...current,
        [segment.cnv_id]: { ...current[segment.cnv_id], flag_type: flag },
      }));
      occurrenceChanged();
    },
    [occurrenceChanged],
  );
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
      clickToZoom: t('case_entity.variants.cnv_profile.hover.click_to_zoom'),
      roh: t('case_entity.variants.cnv_profile.hover.roh'),
      homozygous: t('case_entity.variants.cnv_profile.hover.homozygous'),
      heterozygous: t('case_entity.variants.cnv_profile.hover.heterozygous'),
      score: t('case_entity.variants.cnv_profile.hover.score'),
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
    () => buildSegmentTraces(segments, genome, palette, theme, showFiltered, annotations),
    [segments, genome, palette, theme, showFiltered, annotations],
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
      ...buildGeneTraces(showGenes ? genes : [], genome, view, pxPerBase, palette, theme, selectedGene?.gene.gene_id),
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
      setSelectedSegment(undefined);
      setSelectedGene({ gene, exonIndex });
    },
    [genome],
  );

  const focusSegment = useCallback(
    (segment: CNVProfileSegment) => {
      zoomOnRegion(segment.chromosome, segment.start, segment.end);
      setSelectedGene(undefined);
      setSelectedSegment(segment);
    },
    [zoomOnRegion],
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

  // Opened on a CNV of the CNV table: zoom on it and show its panel.
  useEffect(() => {
    const segment = focus && profile.segments.find(candidate => candidate.cnv_id === focus.cnvId);
    if (segment) focusSegment(segment);
  }, [focus, profile.segments, focusSegment]);

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
      ...segmentHitAreas(segments, genome, showFiltered, annotations),
      ...geneHitAreas(showGenes ? genes : [], genome, view, pxPerBase),
      ...cytobandHitAreas(profile.cytobands, genome, view),
    ],
    [segments, profile.cytobands, genome, showFiltered, annotations, showGenes, genes, view, pxPerBase],
  );

  const handleTarget = useCallback(
    (target: ClickTarget) => {
      if (target.kind === 'cnv') {
        focusSegment(segments[target.index]);
      } else if (target.kind === 'cytoband') {
        const band = profile.cytobands[target.index];
        zoomOnRegion(band.chromosome, band.start, band.end);
      } else {
        focusGene(genes[target.index], target.exonIndex);
      }
    },
    [profile, genes, zoomOnRegion, focusGene, focusSegment],
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
    const hideOverlays = () => {
      hideGuide();
      tooltipRef.current?.hide();
    };
    // The CNVs and genes get the portal tooltip; the cytobands keep Plotly's, as the other tracks.
    const showTooltip = (event: MouseEvent, target: ClickTarget | undefined) => {
      const container = containerRef.current;
      if (!container || !target || target.kind === 'cytoband') return tooltipRef.current?.hide();
      const bounds = container.getBoundingClientRect();
      tooltipRef.current?.show(target, event.clientX - bounds.left, event.clientY - bounds.top);
    };
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
    // Captured, so that the move over a CNV or a gene stops before Plotly's drag layer: Plotly would
    // also show the hover label of a point next to it. Its mouseout handler clears the label shown.
    const handleMove = (event: MouseEvent) => {
      if (event.buttons === 0) {
        const target = targetAt(event);
        setCursor(target ? 'pointer' : 'default');
        showTooltip(event, target);
        const layer = event.target as HTMLElement;
        if (target && target.kind !== 'cytoband' && layer.classList.contains('nsewdrag')) {
          event.stopPropagation();
          layer.onmouseout?.call(layer, event);
        }
      }
      moveGuide(event);
    };
    // Captured before Plotly's own handler, which copies this cursor onto its drag cover.
    const handlePress = (event: MouseEvent) => {
      tooltipRef.current?.hide();
      if (!targetAt(event)) setCursor(dragMode === 'pan' ? 'move' : 'ew-resize');
    };
    graph.addEventListener('click', handleClick);
    graph.addEventListener('mousemove', handleMove, true);
    graph.addEventListener('mouseleave', hideOverlays);
    graph.addEventListener('mousedown', handlePress, true);
    return () => {
      // The view changed: the guide and the tooltip show the old position until the mouse moves again.
      hideOverlays();
      graph.removeEventListener('click', handleClick);
      graph.removeEventListener('mousemove', handleMove, true);
      graph.removeEventListener('mouseleave', hideOverlays);
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
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
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
        <CNVProfileTooltip ref={tooltipRef} segments={segments} genes={showGenes ? genes : []} />
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Spinner size={32} />
          </div>
        )}
        {selectedGene && (
          <CNVGenePanel
            ids={ids}
            gene={selectedGene.gene}
            exonIndex={selectedGene.exonIndex}
            segments={segments}
            onSegmentClick={focusSegment}
            onClose={() => setSelectedGene(undefined)}
          />
        )}
        {shownSegment && (
          <CNVSegmentPanel
            ids={ids}
            segment={shownSegment}
            onGeneClick={symbol => void handleSearch(symbol)}
            onNotesChange={handleNotesChange}
            onFlagChange={handleFlagChange}
            onClose={() => setSelectedSegment(undefined)}
          />
        )}
      </div>
    </div>
  );
}

export default CNVProfileChart;
