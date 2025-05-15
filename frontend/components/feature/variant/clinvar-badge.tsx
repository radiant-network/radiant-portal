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
  other: 'slate',
  association_not_found: 'slate',
  uncertain_significance: 'yellow',
  likely_benign: 'lime',
  likely_pathogenic: 'orange',
  _low_penetrance: 'slate',
  low_penetrance: 'slate',
  risk_factor: 'slate',
  association: 'slate',
  uncertain_risk_allele: 'slate',
  pathogenic: 'red',
  protective: 'slate',
  conflicting_classifications_of_pathogenicity: 'orange',
  conflicting_interpretations_of_pathogenicity: 'yellow',
  not_provided: 'slate',
  established_risk_allele: 'slate',
  likely_risk_allele: 'slate',
  drug_response: 'slate',
  benign: 'green',
  confers_sensitivity: 'slate',
};

function ClinVarBadge({ value, abbreviated, ...props }: ClinVarBadgeProps) {
  const { t } = useI18n();
  const normalizedValue = value.toLowerCase();
  const color = ClinVarValueMap[normalizedValue];

  return (
    <ConditionalWrapper
      condition={!!abbreviated}
      wrapper={children => (
        <Tooltip>
          <TooltipTrigger className="flex">{children}</TooltipTrigger>
          <TooltipContent>{t(`variant.clinVars.${value.toLowerCase()}.tooltip`)}</TooltipContent>
        </Tooltip>
      )}
    >
      <Badge variant={color || 'slate'} {...props}>
        {t(`variant.clinVars.${normalizedValue}${abbreviated ? '.abbrev' : ''}`)}
      </Badge>
    </ConditionalWrapper>
  );
}

export default ClinVarBadge;
