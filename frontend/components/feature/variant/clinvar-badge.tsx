import ConditionalWrapper from '@/components/base/conditional-wrapper';
import { Badge, BadgeProps } from '@/components/base/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

interface ClinVarBadgeProps extends BadgeProps {
  value: string; // TODO: Should be replace with enum with API exposes one
}

// TODO: Should be replace with enum with API exposes one
export const ClinVarValueMap: Record<
  string,
  {
    color: BadgeProps['variant'];
    tooltipKey?: string;
  }
> = {
  other: {
    color: 'slate',
  },
  association_not_found: {
    color: 'slate',
  },
  uncertain_significance: {
    color: 'yellow',
    tooltipKey: 'variant.clinVarsTooltips.uncertain_significance',
  },
  likely_benign: {
    color: 'blue',
    tooltipKey: 'variant.clinVarsTooltips.likely_benign',
  },
  likely_pathogenic: {
    color: 'orange',
    tooltipKey: 'variant.clinVarsTooltips.likely_pathogenic',
  },
  _low_penetrance: {
    color: 'slate',
  },
  low_penetrance: {
    color: 'slate',
  },
  risk_factor: {
    color: 'slate',
  },
  association: {
    color: 'slate',
  },
  uncertain_risk_allele: {
    color: 'yellow',
    tooltipKey: 'variant.clinVarsTooltips.uncertain_risk_allele',
  },
  pathogenic: {
    color: 'red',
  },
  protective: {
    color: 'slate',
  },
  conflicting_interpretations_of_pathogenicity: {
    color: 'orange',
  },
  not_provided: {
    color: 'slate',
  },
  established_risk_allele: {
    color: 'slate',
  },
  likely_risk_allele: {
    color: 'slate',
  },
  drug_response: {
    color: 'slate',
  },
  benign: {
    color: 'green',
  },
  confers_sensitivity: {
    color: 'slate',
  },
};

function ClinVarBadge({ value, ...props }: ClinVarBadgeProps) {
  const { t } = useI18n();
  const normalizedValue = value.toLowerCase();
  const meta = ClinVarValueMap[normalizedValue];

  return (
    <ConditionalWrapper
      condition={!!meta.tooltipKey}
      wrapper={children => (
        <Tooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent>{t(meta.tooltipKey!)}</TooltipContent>
        </Tooltip>
      )}
    >
      <Badge variant={meta.color || 'slate'} {...props}>
        {t(`variant.clinVars.${normalizedValue}`)}
      </Badge>
    </ConditionalWrapper>
  );
}

export default ClinVarBadge;
