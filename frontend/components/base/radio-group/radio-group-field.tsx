import { useState } from 'react';
import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { tv, type VariantProps } from 'tailwind-variants';

import { RadioGroup, RadioGroupItem } from '@/components/base/shadcn/radio-group';
import { cn } from '@/components/lib/utils';

export const radioGroupFieldVariants = tv({
  slots: {
    base: 'flex gap-2 w-full max-w-[228px] cursor-pointer justify-between',
    label: 'text-sm font-medium text-foreground leading-none',
    description: 'text-sm text-muted-foreground font-normal',
    box: 'border p-4 rounded-md border-input',
    boxChecked: 'border-primary bg-accent',
    itemContainer: 'flex items-center gap-3',
  },
  variants: {
    align: {
      start: {
        itemContainer: 'flex items-start gap-3',
      },
      end: {
        itemContainer: 'flex items-start gap-3 flex-row-reverse',
      },
    },
    invalid: {
      true: {
        label: 'text-destructive',
        boxChecked: 'border-destructive bg-alert-error/20',
      },
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

type RadioGroupFieldProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupFieldVariants> & {
    data: { id: string; label: string; description?: string }[];
    box?: boolean;
  };

function RadioGroupField({
  align = 'start',
  className,
  data,
  box,
  value: valueProp,
  defaultValue,
  onValueChange,
  'aria-invalid': ariaInvalid,
  ...props
}: RadioGroupFieldProps) {
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  const styles = radioGroupFieldVariants({ align, invalid });
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);

  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : uncontrolledValue;

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <div className={styles.base({ className })}>
      <RadioGroup
        {...props}
        aria-invalid={ariaInvalid}
        value={valueProp}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
      >
        {data.map(item => {
          const isChecked = selectedValue === item.id;

          return (
            <label
              key={item.id}
              htmlFor={item.id}
              className={cn(
                box && styles.box({ className }),
                box && isChecked && styles.boxChecked({ className }),
                'cursor-pointer',
              )}
            >
              <div className={styles.itemContainer()}>
                <RadioGroupItem id={item.id} value={item.id} aria-invalid={ariaInvalid} />
                <div className="flex flex-col flex-1 gap-1.5 pt-0.5">
                  <span className={styles.label()}>{item.label}</span>
                  {item.description && <span className={styles.description()}>{item.description}</span>}
                </div>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export default RadioGroupField;
