import { ReactElement } from 'react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';

import DetailSection, { DetailItem } from './detail-section';

type ClinicalAssociationSectionProps = {
  data: ExpandedGermlineSNVOccurrence;
};

const MAX_CLINICAL_ASSOCIATION = 3; // Maximum number of clinical associations to display before showing "see more"

export default function ClinicalAssociationSection({ data }: ClinicalAssociationSectionProps) {
  const { t } = useI18n();

  const clinicalAssociationTitle = t('common.no_data_available');

  const omimCode = useCallback((oc: string[]) => oc.map((ic: string) => <Badge key={ic}>{ic}</Badge>), []);

  const clinicalAssociationValue: ReactElement[] = [];
  data.omim_conditions?.forEach((oc, index) => {
    if (index === MAX_CLINICAL_ASSOCIATION) {
      clinicalAssociationValue.push(
        <AnchorLink
          component={Link}
          to={`/variants/entity/${data.locus_id}#evidenceAndConditions`}
          className="justify-start"
          size="sm"
        >
          <span className="max-w-72 overflow-hidden text-ellipsis">{t('common.actions.see_more')}</span>
        </AnchorLink>,
      );
      return;
    } else if (index > MAX_CLINICAL_ASSOCIATION) {
      return;
    }

    clinicalAssociationValue.push(
      <DetailItem
        title={
          oc.panel ? (
            <AnchorLink href={`https://www.omim.org/entry/${oc.omim_phenotype_id}`} target="_blank" size="sm">
              {oc.panel}
            </AnchorLink>
          ) : (
            clinicalAssociationTitle
          )
        }
        value={
          oc.inheritance_code ? <div className="flex items-center gap-1">{omimCode(oc.inheritance_code)}</div> : '-'
        }
        colon={false}
      />,
    );
  });

  return (
    <DetailSection title={t('occurrence_expand.clinical_association.title')}>
      {data.omim_conditions ? (
        clinicalAssociationValue
      ) : (
        <div className="text-sm text-muted-foreground">{t('common.no_data_available')}</div>
      )}
    </DetailSection>
  );
}
