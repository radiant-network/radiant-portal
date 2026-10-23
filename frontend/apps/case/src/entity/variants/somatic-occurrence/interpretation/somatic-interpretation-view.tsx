import type { InterpretationSomatic } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import { getOncogenicityClassificationCriteriaColor } from '@/components/base/classifications/oncogenicity';
import EmptyField from '@/components/base/information/empty-field';
import PhenotypeConditionLink from '@/components/base/navigation/phenotypes/phenotype-condition-link';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import InterpretationViewField from '../../interpretation/interpretation-view-field';
import InterpretationViewGeneric from '../../interpretation/interpretation-view-generic';

type SomaticInterpretationViewProps = {
  interpretation?: InterpretationSomatic;
};

function SomaticInterpretationView({ interpretation }: SomaticInterpretationViewProps) {
  const { t } = useI18n();
  const classificationCriterias = interpretation?.oncogenicity_classification_criterias ?? [];

  return (
    <dl className="space-y-6">
      <InterpretationViewField label={t('variant.interpretation_form.somatic.tumoral_type')}>
        <PhenotypeConditionLink
          name={interpretation?.tumoral_name}
          code={interpretation?.tumoral_type}
          showCode={false}
        />
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.somatic.oncogenicity')}>
        {interpretation?.oncogenicity ? (
          <ClassificationBadge value={interpretation.oncogenicity} isSomatic size="lg" />
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.somatic.classification_criteria')}>
        {classificationCriterias.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {classificationCriterias.map(criteria => (
              <Badge key={criteria} variant={getOncogenicityClassificationCriteriaColor(criteria)}>
                {criteria}
              </Badge>
            ))}
          </div>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.somatic.clinical_utility')}>
        {interpretation?.clinical_utility ? (
          t(`variant.interpretation_form.somatic.clinical_utility_options.${interpretation.clinical_utility}`)
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewGeneric interpretation={interpretation?.interpretation} pubmed={interpretation?.pubmed} />
    </dl>
  );
}

export default SomaticInterpretationView;
