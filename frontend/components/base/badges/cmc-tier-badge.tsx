import { Badge, type BadgeProps, badgeVariants } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';

// dico.snv.cmc.tier
const CmcTierColorMap: Record<string, BadgeProps['variant']> = {
  '1': 'red',
  '2': 'orange',
  '3': 'amber',
  other: 'neutral',
  no_data: 'neutral',
};

type CmcTierBadgeProps = {
  value?: string;
  href?: string;
};

function CmcTierBadge({ value, href }: CmcTierBadgeProps) {
  const { t } = useI18n();
  const key = value ? value.toLowerCase() : 'no_data';
  const variant = CmcTierColorMap[key] ?? 'neutral';
  const label = t(`variant.cmc_tiers.${key}`);

  if (!value || !href) return <Badge variant={variant}>{label}</Badge>;

  return (
    <a href={href} target="_blank" rel="noreferrer" className={badgeVariants({ variant, clickable: true }).base()}>
      {label}
    </a>
  );
}

export default CmcTierBadge;
