import { tv, VariantProps } from 'tailwind-variants';

import { VepImpact } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import ImpactIndicator from '../../base/indicators/impact-indicator';

const consequenceVariant = tv({
  slots: {
    base: 'capitalize gap-[6px] overflow-hidden flex items-baseline',
  },
  variants: {
    size: {
      sm: {
        base: 'text-sm',
      },
      lg: {
        base: 'text-base font-semibold',
      },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});
interface ConsequenceIndicatorProps
  extends VariantProps<typeof consequenceVariant>,
    React.HTMLAttributes<HTMLDivElement> {
  consequence: string;
  vepImpact: VepImpact;
}

function ConsequenceIndicator({ consequence, vepImpact, size, className, ...props }: ConsequenceIndicatorProps) {
  const { t, sanitize } = useI18n();
  const styles = consequenceVariant({ size });

  return (
    <div className={styles.base({ className })} {...props}>
      <ImpactIndicator value={vepImpact} size={size} />
      <span className="text-ellipsis overflow-hidden">
        {t(`common.filters.values.consequence.${sanitize(consequence)}`, {
          defaultValue: consequence,
        })}
      </span>
    </div>
  );
}

export default ConsequenceIndicator;
