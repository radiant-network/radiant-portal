import ImpactIcon from './impact-icon';
import { useI18n } from '@/components/hooks/i18n';
import { VepImpact } from '@/api/api';
import { tv, VariantProps } from 'tailwind-variants';

const consequenceVariant = tv({
  slots: {
    base: 'flex gap-[6px]',
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
      <ImpactIcon value={vepImpact} className={styles.icon()} />
      <span>
        {t(`variant.consequences.${consequence}`, {
          defaultValue: consequence.replace(/_/g, ' '),
        })}
      </span>
    </div>
  );
}

export default ConsequenceLabel;
