import ConditionalWrapper from '@/components/base/conditional-wrapper';
import { Badge, BadgeProps } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

interface ClassificationBadgeProps extends BadgeProps {
  value: string | null; // TODO: Should be replace with enum with API exposes one
  abbreviated?: boolean;
}

export const ClassificationValueMap: Record<string, BadgeProps['variant']> = {
  other: 'neutral',
  association_not_found: 'neutral',
  uncertain_significance: 'yellow',
  likely_benign: 'lime',
  likely_pathogenic: 'orange',
  low_penetrance: 'neutral',
  risk_factor: 'neutral',
  association: 'neutral',
  uncertain_risk_allele: 'neutral',
  pathogenic: 'red',
  protective: 'neutral',
  conflicting_classifications_of_pathogenicity: 'orange',
  conflicting_interpretations_of_pathogenicity: 'yellow',
  not_provided: 'neutral',
  established_risk_allele: 'neutral',
  likely_risk_allele: 'neutral',
  drug_response: 'neutral',
  benign: 'green',
  confers_sensitivity: 'neutral',
  no_data: 'neutral',
};

/**
 * API can return non-snake-case key. We needs to map
 * the non-snake-case value to the correct classification value
 */
function getClassificationValue(value: string): { color: BadgeProps['variant']; key: string } {
  const color = ClassificationValueMap[value];

  // value is in snake_case
  if (color) {
    return { color, key: value };
  }

  for (const key in ClassificationValueMap) {
    // value has no underscore
    if (key.replaceAll('_', '') === value) {
      return {
        color: ClassificationValueMap[key],
        key,
      };
      // value start with an underscore
    } else if (`_${key}` === value) {
      return {
        color: ClassificationValueMap[key],
        key,
      };
    }
  }

  return {
    color: ClassificationValueMap.no_data,
    key: 'no_data',
  };
}

function ClassificationBadge({ value, abbreviated, ...props }: ClassificationBadgeProps) {
  const { t } = useI18n();
  const result = getClassificationValue((value ?? '').toLowerCase());

  return (
    <ConditionalWrapper
      condition={!!abbreviated}
      wrapper={children => (
        <Tooltip>
          <TooltipTrigger className="flex">{children}</TooltipTrigger>
          <TooltipContent>{t(`common.classification.${result.key}.tooltip`)}</TooltipContent>
        </Tooltip>
      )}
    >
      <Badge variant={result.color || 'neutral'} {...props}>
        {t(`common.classification.${result.key}${abbreviated ? '.abbrev' : ''}`)}
      </Badge>
    </ConditionalWrapper>
  );
}

export default ClassificationBadge;
