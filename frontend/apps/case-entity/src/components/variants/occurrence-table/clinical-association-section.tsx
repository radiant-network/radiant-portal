import { ReactElement } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';
import { Badge } from '@/components/base/ui/badge';
import { useCallback } from 'react';
import { Link } from 'react-router';
import AnchorLink from '@/components/base/navigation/anchor-link';

type ClinicalAssociationSectionProps = {
  data: ExpandedOccurrence;
};

const MAX_CLINICAL_ASSOCIATION = 3; // Maximum number of clinical associations to display before showing "see more"

export default function ClinicalAssociationSection({ data }: ClinicalAssociationSectionProps) {
  const { t } = useI18n();

  const clinicalAssociationTitle = t('common.noDataAvailable');

  const omimCode = useCallback((oc: string[]) => oc.map((ic: string) => <Badge key={ic}>{ic}</Badge>), []);

  let clinicalAssociationValue: ReactElement[] = [];
  data.omim_conditions?.forEach((oc, index) => {
    if (index === MAX_CLINICAL_ASSOCIATION) {
      clinicalAssociationValue.push(
        <AnchorLink component={Link} to={`/variants/entity/${data.locus_id}`} className="justify-start" size="sm">
          <span className="max-w-72 overflow-hidden text-ellipsis">{t('common.actions.seeMore')}</span>
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
      />,
    );
  });

  return (
    <DetailSection title={t('occurrenceExpand.clinicalAssociation.title')}>
      {data.omim_conditions ? (
        clinicalAssociationValue
      ) : (
        <div className="text-sm text-muted-foreground">{t('common.noDataAvailable')}</div>
      )}
    </DetailSection>
  );
}
