import { useI18n } from '@/components/hooks/i18n';

import type { CNVProfilePalette } from './libs/palette';

type CNVProfileLegendProps = {
  palette: CNVProfilePalette;
};

function CNVProfileLegend({ palette }: CNVProfileLegendProps) {
  const { t } = useI18n();
  const dot = (color: string, hollow = false) => (
    <span
      aria-hidden
      className="inline-block size-2.5 rounded-full border-2"
      style={{ borderColor: color, backgroundColor: hollow ? 'transparent' : color }}
    />
  );
  const bar = (color: string) => (
    <span aria-hidden className="inline-block h-1.5 w-3.5 rounded-sm" style={{ backgroundColor: color }} />
  );

  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        {dot(palette.gain)}
        {t('case_entity.variants.cnv_profile.legend.gain')}
      </li>
      <li className="flex items-center gap-1.5">
        {dot(palette.loss)}
        {t('case_entity.variants.cnv_profile.legend.loss')}
      </li>
      <li className="flex items-center gap-1.5">
        {dot(palette.gain, true)}
        {dot(palette.loss, true)}
        {t('case_entity.variants.cnv_profile.legend.filtered')}
      </li>
      <li className="flex items-center gap-1.5">
        {dot(palette.pointEven)}
        {dot(palette.pointOdd)}
        {t('case_entity.variants.cnv_profile.tracks.copy_ratio')} / {t('case_entity.variants.cnv_profile.tracks.baf')}
      </li>
      <li className="flex items-center gap-1.5">
        {dot(palette.roh)}
        {t('case_entity.variants.cnv_profile.legend.roh')}
      </li>
      <li className="flex items-center gap-1.5">
        {bar(palette.gene)}
        {t('case_entity.variants.cnv_profile.legend.gene')}
      </li>
      <li className="flex items-center gap-1.5">
        {bar(palette.highlight)}
        {t('case_entity.variants.cnv_profile.legend.highlighted_gene')}
      </li>
    </ul>
  );
}

export default CNVProfileLegend;
