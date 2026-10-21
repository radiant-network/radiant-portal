import type { InterpretationSomatic } from '@/api/api';
import ClassificationBadge from '@/components/base/badges/classification-badge';
import { getOncogenicityClassificationCriteriaColor } from '@/components/base/classifications/oncogenicity';
import EmptyField from '@/components/base/information/empty-field';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

import InterpretationViewField from '../../interpretation/interpretation-view-field';
import InterpretationViewGeneric from '../../interpretation/interpretation-view-generic';

type SomaticInterpretationViewProps = {
  interpretation?: InterpretationSomatic;
};

/**
 * Read-only counterpart of SomaticInterpretationForm: same fields, same order, same labels.
 */
function SomaticInterpretationView({ interpretation }: SomaticInterpretationViewProps) {
  const { t } = useI18n();
  const criterias = interpretation?.oncogenicity_classification_criterias ?? [];

  return (
    <div className="space-y-6">
      <InterpretationViewField label={t('variant.interpretation_form.somatic.tumoral_type')}>
        {interpretation?.tumoral_type ? (
          <AnchorLink
            href={`http://purl.obolibrary.org/obo/MONDO_${interpretation.tumoral_type.replace('MONDO:', '')}`}
            target="_blank"
            rel="noreferrer"
            size="sm"
          >
            {interpretation.tumoral_name || interpretation.tumoral_type}
          </AnchorLink>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.somatic.oncogenicity')}>
        {interpretation?.oncogenicity ? (
          <ClassificationBadge value={interpretation.oncogenicity} isSomatic size="lg" />
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField
        label={t('variant.interpretation_form.somatic.classification_criteria')}
        className={criterias.length > 0 ? 'min-h-[38px]' : undefined}
      >
        {criterias.length > 0 ? (
          criterias.map(criteria => (
            <Badge key={criteria} variant={getOncogenicityClassificationCriteriaColor(criteria)}>
              {criteria}
            </Badge>
          ))
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewField label={t('variant.interpretation_form.somatic.clinical_utility')}>
        {interpretation?.clinical_utility ? (
          <span>
            {t(`variant.interpretation_form.somatic.clinical_utility_options.${interpretation.clinical_utility}`)}
          </span>
        ) : (
          <EmptyField />
        )}
      </InterpretationViewField>
      <InterpretationViewGeneric interpretation={interpretation} />
    </div>
  );
}

export default SomaticInterpretationView;
