import { useId } from 'react';

import type { PatientCsf } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import LabDate from '../dates/lab-date';

type CsfCellFreeDnaSectionProps = {
  cellFreeDna: PatientCsf['cell_free_dna'];
};

function CsfCellFreeDnaSection({ cellFreeDna }: CsfCellFreeDnaSectionProps) {
  const { t } = useI18n();
  const titleId = useId();
  if (cellFreeDna.day == null && cellFreeDna.date == null) return null;

  return (
    <section className="flex flex-col gap-2" aria-labelledby={titleId}>
      <h3 id={titleId} className="text-sm font-semibold">
        {t('patient_entity.laboratory.csf.specimen.title')}
      </h3>
      <div className="inline-flex max-w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm">
        <span className="font-medium">{t('patient_entity.laboratory.csf.specimen.cell_free_dna')}</span>
        <span className="inline-flex gap-1 text-muted-foreground">
          <span>{t('patient_entity.laboratory.csf.specimen.collected')}</span>
          <LabDate day={cellFreeDna.day} date={cellFreeDna.date} />
        </span>
      </div>
    </section>
  );
}

export default CsfCellFreeDnaSection;
