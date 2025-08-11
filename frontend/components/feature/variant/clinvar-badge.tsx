import ConditionalWrapper from '@/components/base/conditional-wrapper';
import { Badge, BadgeProps } from '@/components/base/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

interface ClinVarBadgeProps extends BadgeProps {
  value: string; // TODO: Should be replace with enum with API exposes one
  abbreviated?: boolean;
}

// TODO: Should be replace with enum with API exposes one
export const ClinVarValueMap: Record<string, BadgeProps['variant']> = {
  other: 'neutral',
  association_not_found: 'neutral',
  uncertain_significance: 'yellow',
  likely_benign: 'lime',
  likely_pathogenic: 'orange',
  _low_penetrance: 'neutral',
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
  no_data: 'neutral'
};

function ClinVarBadge({ value, abbreviated, ...props }: ClinVarBadgeProps) {
  const { t } = useI18n();
  let normalizedValue = value ? value.toLowerCase() : "no_data";
  const color = ClinVarValueMap[normalizedValue];

  return (
    <ConditionalWrapper
      condition={!!abbreviated}
      wrapper={children => (
        <Tooltip>
          <TooltipTrigger className="flex">{children}</TooltipTrigger>
          <TooltipContent>{t(`variant.clinVars.${normalizedValue}.tooltip`)}</TooltipContent>
        </Tooltip>
      )}
    >
      <Badge variant={color || 'neutral'} {...props}>
        {t(`variant.clinVars.${normalizedValue}${abbreviated ? '.abbrev' : ''}`)}
      </Badge>
    </ConditionalWrapper>
  );
}

export default ClinVarBadge;
