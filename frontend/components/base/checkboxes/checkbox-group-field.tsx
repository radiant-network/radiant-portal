/* eslint-disable complexity */
import { useId, useState } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

import { Checkbox } from '@/components/base/shadcn/checkbox';
import { cn } from '@/components/lib/utils';

export const checkboxGroupFieldVariants = tv({
  slots: {
    base: 'flex flex-col gap-2 w-full',
    item: 'w-full',
    itemDisabled: 'opacity-50 cursor-not-allowed',
    label: 'block w-full cursor-pointer',
    box: 'border rounded-md border-input has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]',
    boxChecked: 'border-primary bg-accent',
    checkboxInBox: 'focus-visible:ring-0 focus-visible:outline-none',
    checkboxDisabled: 'disabled:opacity-100',
    itemContainer: 'flex items-center gap-3',
    contentWrapper: 'flex flex-1 flex-col items-start gap-1.5',
    labelContent: 'flex w-full items-start gap-2',
    content: 'flex flex-col flex-1 gap-1.5 pt-0.5',
    title: 'text-sm font-medium text-foreground leading-none',
    description: 'text-sm text-muted-foreground font-normal',
    extraContent: 'w-full',
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

export type CheckboxGroupFieldItem = {
  id: string;
  label: string;
  description?: React.ReactNode;
  disabled?: boolean;
  extraTitle?: React.ReactNode;
  extraContent?: React.ReactNode;
};

type CheckboxGroupFieldProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'onChange'> &
  VariantProps<typeof checkboxGroupFieldVariants> & {
    data: CheckboxGroupFieldItem[];
    box?: boolean;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    name?: string;
  };

function CheckboxGroupField({
  align = 'start',
  className,
  data,
  box,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  ...props
}: CheckboxGroupFieldProps) {
  const styles = checkboxGroupFieldVariants({ align });
  const groupId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);

  const isControlled = valueProp !== undefined;
  const selectedValues = isControlled ? valueProp : uncontrolledValue;

  const handleCheckedChange = (id: string, checked: boolean) => {
    let nextValue = selectedValues.filter(value => value !== id);

    if (checked) {
      nextValue = [...nextValue, id];
    }

    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <div role="group" data-slot="checkbox-group" className={styles.base({ className })} {...props}>
      {data.map(item => {
        const isChecked = selectedValues.includes(item.id);
        const isDisabled = item.disabled;
        const itemId = `${groupId}-${item.id}`;
        const labelId = `${itemId}-label`;
        const descriptionId = `${itemId}-description`;

        return (
          <div
            key={item.id}
            data-slot="checkbox-group-item"
            data-state={isChecked ? 'checked' : 'unchecked'}
            data-disabled={isDisabled || undefined}
            className={cn(
              styles.item(),
              box && styles.box(),
              box && isChecked && styles.boxChecked(),
              isDisabled && styles.itemDisabled(),
            )}
          >
            <div className={cn(styles.itemContainer(), box && 'p-4')}>
              <Checkbox
                id={itemId}
                name={name}
                value={item.id}
                checked={isChecked}
                disabled={isDisabled}
                className={cn(box && styles.checkboxInBox(), isDisabled ? styles.checkboxDisabled() : 'cursor-pointer')}
                aria-labelledby={labelId}
                aria-describedby={item.description ? descriptionId : undefined}
                onCheckedChange={state => handleCheckedChange(item.id, state === true)}
              />
              <div className={styles.contentWrapper()}>
                <label htmlFor={itemId} className={cn(styles.label(), isDisabled && 'cursor-not-allowed')}>
                  <div className={styles.labelContent()}>
                    <div className={cn(styles.content())}>
                      <span id={labelId} className={styles.title()}>
                        {item.label}
                      </span>
                      {item.description && (
                        <span id={descriptionId} className={styles.description()}>
                          {item.description}
                        </span>
                      )}
                    </div>
                    {item.extraTitle && <div data-slot="checkbox-group-item-extra-title">{item.extraTitle}</div>}
                  </div>
                </label>

                {isChecked && item.extraContent && (
                  <div data-slot="checkbox-group-item-extra" className={styles.extraContent()}>
                    {item.extraContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CheckboxGroupField;
