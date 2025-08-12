import ImpactIndicator from '../../base/indicators/impact-indicator';
import { useI18n } from '@/components/hooks/i18n';
import { VepImpact } from '@/api/api';
import { tv, VariantProps } from 'tailwind-variants';
import { replaceUnderscore } from '@/components/lib/string-format';

const consequenceVariant = tv({
  slots: {
    base: 'capitalize gap-[6px] overflow-hidden flex',
    icon: 'mt-[5.25px]',
  },
  variants: {
    size: {
      sm: {
        base: 'text-sm',
        icon: 'size-[10px]',
      },
      default: {
        base: 'text-base font-semibold',
        icon: 'size-[14px]',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
interface ConsequenceLabelProps extends VariantProps<typeof consequenceVariant>, React.HTMLAttributes<HTMLDivElement> {
  consequence: string;
  vepImpact: VepImpact;
}

function ConsequenceLabel({ consequence, vepImpact, size, className, ...props }: ConsequenceLabelProps) {
  const { t } = useI18n();
  const styles = consequenceVariant({ size });

  return (
    <div className={styles.base({ className })} {...props}>
      <ImpactIndicator value={vepImpact} className={styles.icon()} />
      <span className="text-ellipsis overflow-hidden">
        {t(`variant.consequences.${consequence}`, {
          defaultValue: replaceUnderscore(consequence),
        })}
      </span>
    </div>
  );
}

export default ConsequenceLabel;
