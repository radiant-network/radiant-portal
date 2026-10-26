import { ChevronLeft, ChevronRight, Move, SquareDashedMousePointer, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Label } from '@/components/base/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Slider } from '@/components/base/shadcn/slider';
import { Switch } from '@/components/base/shadcn/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/base/shadcn/toggle-group';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';

import { chromosomesInView, type Genome, type GenomeView, MIN_SPAN } from './libs/genome';
import CNVProfileSearch from './cnv-profile-search';

export type DragMode = 'pan' | 'zoom';

const ZOOM_STEPS = 1000;

type CNVProfileNavbarProps = {
  genome: Genome;
  view: GenomeView;
  onViewChange: (view: GenomeView) => void;
  dragMode: DragMode;
  onDragModeChange: (mode: DragMode) => void;
  showFiltered: boolean;
  onShowFilteredChange: (show: boolean) => void;
  onSearch: (query: string) => Promise<boolean>;
  pointCount: number;
};

export const zoomView = (genome: Genome, view: GenomeView, span: number): GenomeView => {
  const centre = (view.x0 + view.x1) / 2;
  return { x0: centre - span / 2, x1: centre + span / 2 };
};

export const panView = (view: GenomeView, fraction: number): GenomeView => {
  const shift = (view.x1 - view.x0) * fraction;
  return { x0: view.x0 + shift, x1: view.x1 + shift };
};

function CNVProfileNavbar({
  genome,
  view,
  onViewChange,
  dragMode,
  onDragModeChange,
  showFiltered,
  onShowFilteredChange,
  onSearch,
  pointCount,
}: CNVProfileNavbarProps) {
  const { t } = useI18n();

  const span = view.x1 - view.x0;
  const maxZoom = Math.log10(genome.length / MIN_SPAN);
  const zoomLevel = Math.round((Math.log10(genome.length / span) / maxZoom) * ZOOM_STEPS);
  const inView = chromosomesInView(genome, view);
  const [first] = inView;
  const last = inView[inView.length - 1];

  let viewText = `${first.name} → ${last.name} · ${toKiloBases(span)}`;
  if (span >= genome.length * 0.99) {
    viewText = `${t('case_entity.variants.cnv_profile.navbar.whole_genome')} · ${toKiloBases(span)}`;
  } else if (first === last) {
    viewText = `chr${first.name}:${thousandNumberFormat(Math.round(view.x0 - first.offset))}-${thousandNumberFormat(Math.round(view.x1 - first.offset))} · ${toKiloBases(span)}`;
  }

  return (
    <div className="flex flex-col gap-2 border-b pb-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button size="xs" variant="outline" onClick={() => onViewChange({ x0: 0, x1: genome.length })}>
          {t('case_entity.variants.cnv_profile.navbar.genome')}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            iconOnly
            aria-label={t('a11y.cnv_profile.zoom_out')}
            onClick={() => onViewChange(zoomView(genome, view, span * 2))}
          >
            <ZoomOut />
          </Button>
          <Slider
            className="w-56"
            min={0}
            max={ZOOM_STEPS}
            step={1}
            value={[zoomLevel]}
            aria-label={t('a11y.cnv_profile.zoom_level')}
            onValueChange={([level]) =>
              onViewChange(zoomView(genome, view, genome.length / 10 ** ((level / ZOOM_STEPS) * maxZoom)))
            }
          />
          <Button
            size="xs"
            variant="outline"
            iconOnly
            aria-label={t('a11y.cnv_profile.zoom_in')}
            onClick={() => onViewChange(zoomView(genome, view, span / 2))}
          >
            <ZoomIn />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            iconOnly
            aria-label={t('a11y.cnv_profile.pan_left')}
            onClick={() => onViewChange(panView(view, -0.5))}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="xs"
            variant="outline"
            iconOnly
            aria-label={t('a11y.cnv_profile.pan_right')}
            onClick={() => onViewChange(panView(view, 0.5))}
          >
            <ChevronRight />
          </Button>
        </div>
        <span className="text-sm tabular-nums">{viewText}</span>
        <span className="text-xs text-muted-foreground">{t('case_entity.variants.cnv_profile.navbar.keyboard')}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Select
          value={first === last && span < first.size * 1.01 && span > first.size * 0.99 ? first.name : ''}
          onValueChange={name => {
            const chromosome = genome.byName.get(name);
            if (chromosome) onViewChange({ x0: chromosome.offset, x1: chromosome.offset + chromosome.size });
          }}
        >
          <SelectTrigger size="xs" className="w-36" aria-label={t('a11y.cnv_profile.chromosome')}>
            <SelectValue placeholder={t('case_entity.variants.cnv_profile.navbar.chromosome')} />
          </SelectTrigger>
          <SelectContent>
            {genome.chromosomes.map(chromosome => (
              <SelectItem key={chromosome.name} value={chromosome.name}>
                chr{chromosome.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CNVProfileSearch genome={genome} onSearch={onSearch} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('case_entity.variants.cnv_profile.navbar.drag')}</span>
          <ToggleGroup
            type="single"
            size="xs"
            value={dragMode}
            aria-label={t('a11y.cnv_profile.drag_mode')}
            onValueChange={value => value && onDragModeChange(value as DragMode)}
          >
            <ToggleGroupItem value="pan">
              <Move />
              {t('case_entity.variants.cnv_profile.navbar.drag_pan')}
            </ToggleGroupItem>
            <ToggleGroupItem value="zoom">
              <SquareDashedMousePointer />
              {t('case_entity.variants.cnv_profile.navbar.drag_zoom')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="cnv-profile-show-filtered" checked={showFiltered} onCheckedChange={onShowFilteredChange} />
          <Label htmlFor="cnv-profile-show-filtered" className="text-xs">
            {t('case_entity.variants.cnv_profile.navbar.show_filtered')}
          </Label>
        </div>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {t('case_entity.variants.cnv_profile.navbar.points', {
            count: pointCount,
            formatted: thousandNumberFormat(pointCount),
          })}
        </span>
      </div>
    </div>
  );
}

export default CNVProfileNavbar;
