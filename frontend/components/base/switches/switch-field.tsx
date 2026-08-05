/* eslint-disable complexity */
import { useId, useState } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { Switch } from '@/components/base/shadcn/switch';
import { cn } from '@/components/lib/utils';

export const switchFieldVariants = tv({
  slots: {
    base: 'w-full',
    disabled: 'opacity-50 cursor-not-allowed',
    box: 'border rounded-md border-input',
    boxChecked: 'border-primary bg-accent',
    switchDisabled: 'disabled:opacity-100',
    container: 'flex',
    label: 'flex flex-1 flex-col gap-1.5 cursor-pointer',
    title: 'text-sm font-medium text-foreground',
    description: 'text-sm text-muted-foreground font-normal',
  },
  variants: {
    size: {
      default: {
        container: 'gap-2',
      },
      sm: {
        container: 'gap-3',
        title: 'leading-none',
      },
    },
    align: {
      start: {
        container: 'items-start',
      },
      end: {
        container: 'items-start flex-row-reverse',
      },
    },
    invalid: {
      true: {
        title: 'text-destructive',
        boxChecked: 'border-destructive bg-alert-error/20',
      },
    },
  },
  defaultVariants: {
    size: 'default',
    align: 'start',
  },
});

export type SwitchFieldProps = React.ComponentPropsWithoutRef<typeof Switch> &
  VariantProps<typeof switchFieldVariants> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    box?: boolean;
  };

/**
 * A single switch with display option (box, disable, align, ...)
 */
function SwitchField({
  size = 'default',
  align = 'start',
  className,
  label,
  description,
  box,
  id,
  checked: checkedProp,
  defaultChecked,
  disabled,
  onCheckedChange,
  'aria-invalid': ariaInvalid,
  ...props
}: SwitchFieldProps) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  const styles = switchFieldVariants({ size, align, invalid });
  const generatedId = useId();
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);

  const switchId = id ?? generatedId;
  const labelId = `${switchId}-label`;
  const descriptionId = `${switchId}-description`;
  const isControlled = checkedProp !== undefined;
  const isChecked = isControlled ? checkedProp : uncontrolledChecked;

  const handleCheckedChange = (nextChecked: boolean) => {
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
  };

  return (
    <div
      data-slot="switch-field"
      data-state={isChecked ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      className={cn(
        styles.base(),
        box && styles.box(),
        box && isChecked && styles.boxChecked(),
        disabled && styles.disabled(),
        className,
      )}
    >
      <div className={cn(styles.container(), box && 'p-2.5')}>
        <Switch
          id={switchId}
          size={size}
          checked={isChecked}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={cn(disabled ? styles.switchDisabled() : 'cursor-pointer')}
          onCheckedChange={handleCheckedChange}
          {...props}
        />
        {(label || description) && (
          <label htmlFor={switchId} className={cn(styles.label(), disabled && 'cursor-not-allowed')}>
            {label && (
              <span id={labelId} className={styles.title()}>
                {label}
              </span>
            )}
            {description && (
              <span id={descriptionId} className={styles.description()}>
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    </div>
  );
}

export default SwitchField;
