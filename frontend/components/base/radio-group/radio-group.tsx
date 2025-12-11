import { useState } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { tv, VariantProps } from 'tailwind-variants';

import { RadioGroup, RadioGroupItem } from '@/components/base/shadcn/radio-group';

export const radioGroupVariants = tv({
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

type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> &
  VariantProps<typeof radioGroupVariants> & {
    data: { id: string; label: string; description?: string }[];
    box?: boolean;
  };

function RadioGroupCustom({ align = 'start', className, data, box, ...props }: RadioGroupProps) {
  const styles = radioGroupVariants({ align });
  const [selectedValue, setSelectedValue] = useState<string | undefined>(props.defaultValue);

  return (
    <div className={styles.base({ className })}>
      <RadioGroup
        onValueChange={value => {
          setSelectedValue(value);
        }}
        {...props}
      >
        {data.map(item => {
          const isChecked = selectedValue === item.id;
          const boxClassName = box
            ? `${styles.box({ className })} ${isChecked && styles.boxChecked({ className })}`
            : '';

          return (
            <div key={item.id} className={boxClassName}>
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

export default RadioGroupCustom;
