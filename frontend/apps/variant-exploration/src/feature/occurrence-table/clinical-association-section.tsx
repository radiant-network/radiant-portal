import React, { ReactElement } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { useCallback } from 'react';
import { Link } from 'react-router';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { Button } from '@/components/base/ui/button';

type ClinicalAssociationSectionProps = {
  data: ExpendedOccurrence;
};

export default function ClinicalAssociationSection({ data }: ClinicalAssociationSectionProps) {
  const { t } = useI18n();

  const clinicalAssociationTitle = t('common.noDataAvailable');

  const omimCode = useCallback((oc: string[]) => oc.map((ic: string) => <Badge key={ic}>{ic}</Badge>), []);

  let clinicalAssociationValue: ReactElement[] = [];
  data.omim_conditions?.forEach((oc, index) => {
    clinicalAssociationValue.push(
      <DetailItem
        title={oc.panel ? oc.panel : clinicalAssociationTitle}
        value={oc.inheritance_code ? <div className="flex items-center gap-1">{omimCode(oc.inheritance_code)}</div> : '-'}
      />
    );
    if (index === 2) {
      clinicalAssociationValue.push(
        <Button variant="link" size="sm" className="px-0 justify-start">
          <Link
            to={`/variants/entity/${data.locus_id}`}
            className="flex gap-2 items-center outline-none"
          >
            <span className="max-w-72 overflow-hidden text-ellipsis">{t('common.actions.seeMore')}</span>
            <SquareArrowOutUpRightIcon />
          </Link>
        </Button>
      );
      return;
    }
  });

  return (
    <DetailSection title={t('occurrenceExpend.clinicalAssociation.title')}>
      {data.omim_conditions ? (
        clinicalAssociationValue
      ) : (
        <div className="text-sm text-muted-foreground">{t('common.noDataAvailable')}</div>
      )}
    </DetailSection>
  );
}
