import type { TFunction } from 'i18next';

import { thousandNumberFormat } from '@/components/lib/number-format';

export const formatLocus = (t: TFunction<string, undefined>, chromosome: string, start: number, end: number) =>
  t('case_entity.variants.cnv_profile.locus', {
    chromosome,
    start: thousandNumberFormat(start),
    end: thousandNumberFormat(end),
  });
