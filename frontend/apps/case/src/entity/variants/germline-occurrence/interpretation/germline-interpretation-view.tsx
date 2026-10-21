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

/**
 * Read-only counterpart of GermlineInterpretationForm: same fields, same order, same labels.
 */
function GermlineInterpretationView({ interpretation }: GermlineInterpretationViewProps) {
  const { t } = useI18n();
  const criterias = interpretation?.classification_criterias ?? [];
  const transmissionModes = interpretation?.transmission_modes ?? [];

  return (
    <div className="space-y-6">
      <InterpretationViewField label={t('variant.interpretation_form.germline.condition')}>
        <PhenotypeConditionLink
          className="capitalize"
          name={interpretation?.condition_name}
          code={interpretation?.condition}
          showCode={false}
        />
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.germline.classification')}>
        <ClassificationBadge value={interpretation?.classification ?? ''} size="lg" />
      </InterpretationViewField>
      <InterpretationViewField
        label={t('variant.interpretation_form.germline.classification_criteria')}
        className={criterias.length > 0 ? 'min-h-[38px]' : undefined}
      >
        {criterias.length > 0 ? (
          criterias.map(criteria => (
            <Badge key={criteria} variant={getClassificationCriteriaColor(criteria)}>
              {criteria}
            </Badge>
          ))
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField
        label={t('variant.interpretation_form.germline.mode_of_transmission')}
        className={transmissionModes.length > 0 ? 'min-h-[38px]' : undefined}
      >
        {transmissionModes.length > 0 ? (
          transmissionModes.map(mode => <TransmissionModeBadge value={mode} key={mode} />)
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewGeneric interpretation={interpretation} />
    </div>
  );
}

export default GermlineInterpretationView;
