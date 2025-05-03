import { Badge, BadgeProps } from '@/components/base/ui/badge';
import { useI18n } from '@/components/hooks/i18n';

interface ClinVarBadgeProps extends BadgeProps {
  value: string; // TODO: Should be replace with enum with API exposes one
}

// TODO: Should be replace with enum with API exposes one
export const ClinVarValueMap: Record<string, BadgeProps['variant']> = {
  other: 'slate',
  association_not_found: 'slate',
  uncertain_significance: 'orange',
  likely_benign: 'lime',
  likely_pathogenic: 'orange',
  _low_penetrance: 'slate',
  low_penetrance: 'slate',
  risk_factor: 'slate',
  association: 'slate',
  uncertain_risk_allele: 'slate',
  pathogenic: 'red',
  protective: 'slate',
  conflicting_interpretations_of_pathogenicity: 'orange',
  not_provided: 'slate',
  established_risk_allele: 'slate',
  likely_risk_allele: 'slate',
  drug_response: 'slate',
  benign: 'green',
  confers_sensitivity: 'slate',
};

function ClinVarBadge({ value, ...props }: ClinVarBadgeProps) {
  const { t } = useI18n();
  const normalizedValue = value.toLowerCase();

  return (
    <Badge variant={ClinVarValueMap[normalizedValue] || 'slate'} {...props}>
      {t(`variant.clinVars.${normalizedValue}`)}
    </Badge>
  );
}

export default ClinVarBadge;
