import ConditionalWrapper from '@/components/base/conditional-wrapper';
import { Badge, BadgeProps } from '@/components/base/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

interface ClassificationBadgeProps extends BadgeProps {
  value: string; // TODO: Should be replace with enum with API exposes one
  abbreviated?: boolean;
}

// TODO: Should be replace with enum with API exposes one
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

function ClassificationBadge({ value, abbreviated, ...props }: ClassificationBadgeProps) {
  const { t } = useI18n();
  const normalizedValue = value ? value.toLowerCase() : 'no_data';
  const color = ClassificationValueMap[normalizedValue];

  return (
    <ConditionalWrapper
      condition={!!abbreviated}
      wrapper={children => (
        <Tooltip>
          <TooltipTrigger className="flex">{children}</TooltipTrigger>
          <TooltipContent>{t(`common.classification.${normalizedValue}.tooltip`)}</TooltipContent>
        </Tooltip>
      )}
    >
      <Badge variant={color || 'neutral'} {...props}>
        {t(`common.classification.${normalizedValue}${abbreviated ? '.abbrev' : ''}`)}
      </Badge>
    </ConditionalWrapper>
  );
}

export default ClassificationBadge;
