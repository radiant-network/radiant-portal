import { useState } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { tv, VariantProps } from 'tailwind-variants';

import { RadioGroup, RadioGroupItem } from '@/components/base/shadcn/radio-group';
import { cn } from '@/components/lib/utils';

export const radioGroupFieldVariants = tv({
  slots: {
    base: 'flex gap-2 w-full max-w-[228px] cursor-pointer justify-between',
    label: 'text-sm font-medium text-foreground',
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

function RadioGroupField({ align = 'start', className, data, box, ...props }: RadioGroupFieldProps) {
  const styles = radioGroupFieldVariants({ align });
  const [selectedValue, setSelectedValue] = useState<string | undefined>(props.defaultValue);

  return (
    <div className={styles.base({ className })}>
      <RadioGroup
        onValueChange={value => {
          setSelectedValue(value);
          props.onValueChange?.(value);
        }}
        {...props}
      >
        {data.map(item => {
          const isChecked = selectedValue === item.id;

          return (
            <div
              key={item.id}
              className={cn(box && styles.box({ className }), box && isChecked && styles.boxChecked({ className }))}
            >
              <div className={styles.itemContainer()}>
                <RadioGroupItem id={item.id} value={item.id} />
                <div className="flex flex-col flex-1 gap-1.5">
                  <label htmlFor={item.id} className={styles.label()}>
                    {item.label}
                  </label>
                  {item.description && <span className={styles.description()}>{item.description}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export default RadioGroupField;
