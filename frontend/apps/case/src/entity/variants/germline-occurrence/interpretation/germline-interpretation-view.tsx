import type { InterpretationGermline } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import TransmissionModeBadge from '@/components/base/badges/transmission-mode-badge';
import { getClassificationCriteriaColor } from '@/components/base/classifications/interpretation';
import EmptyField from '@/components/base/information/empty-field';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import InterpretationViewField from '../../interpretation/interpretation-view-field';
import InterpretationViewGeneric from '../../interpretation/interpretation-view-generic';

type GermlineInterpretationViewProps = {
  interpretation?: InterpretationGermline;
};

function GermlineInterpretationView({ interpretation }: GermlineInterpretationViewProps) {
  const { t } = useI18n();
  const classificationCriterias = interpretation?.classification_criterias ?? [];
  const transmissionModes = interpretation?.transmission_modes ?? [];

  return (
    <dl className="space-y-6">
      <InterpretationViewField label={t('variant.interpretation_form.germline.condition')}>
        <PhenotypeConditionLink
          name={interpretation?.condition_name}
          code={interpretation?.condition}
          showCode={false}
        />
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.germline.classification')}>
        {interpretation?.classification ? (
          <ClassificationBadge value={interpretation.classification} size="lg" />
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.germline.classification_criteria')}>
        {classificationCriterias.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {classificationCriterias.map(criteria => (
              <Badge key={criteria} variant={getClassificationCriteriaColor(criteria)}>
                {criteria}
              </Badge>
            ))}
          </div>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.germline.mode_of_transmission')}>
        {transmissionModes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {transmissionModes.map(mode => (
              <TransmissionModeBadge key={mode} value={mode} />
            ))}
          </div>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewGeneric interpretation={interpretation?.interpretation} pubmed={interpretation?.pubmed} />
    </dl>
  );
}

export default GermlineInterpretationView;
