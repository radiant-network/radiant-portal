import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { useCallback } from 'react';

type ClinicalAssociationSectionProps = {
  data: ExpendedOccurrence;
};

export default function ClinicalAssociationSection({ data }: ClinicalAssociationSectionProps) {
  const { t } = useI18n();

  const clinicalAssociationTitle = t('common.noDataAvailable');

  const omimCode = useCallback((oc: string[]) =>
    oc.map((ic: string) => <Badge key={ic}>{ic}</Badge>),
    []);

  const clinicalAssociationValue = (
    <>
<div className="space-x-1">
      {data.omim_conditions?.map((oc) => (
        <DetailItem
          title={oc.panel ? oc.panel : clinicalAssociationTitle}
          value={oc.inheritance_code ? omimCode(oc.inheritance_code) : '-'} />
      ))}
    </div>
        <DetailItem
          title={oc.panel ? oc.panel : clinicalAssociationTitle}
          value={oc.inheritance_code ? omimCode(oc.inheritance_code) : '-'} />
      ))}
    </>
  )

  return (
    <DetailSection title={t('occurrenceExpend.clinicalAssociation.title')}>
      {data.omim_conditions ?
        clinicalAssociationValue :
        <DetailItem title={clinicalAssociationTitle} value="-" />
      }
    </DetailSection>
  );
}

