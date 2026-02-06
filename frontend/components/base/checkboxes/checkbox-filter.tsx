import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { tv, VariantProps } from 'tailwind-variants';

import { Checkbox, checkboxVariants } from '@/components/base/shadcn/checkbox';
import { Label } from '@/components/base/shadcn/label';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';
import { cn } from '@/components/lib/utils';

export const checkboxFilterVariants = tv({
  slots: {
    base: 'flex gap-2 w-full max-w-[228px] cursor-pointer justify-between',
    label: 'first-letter:capitalize line-clamp-2 cursor-pointer max-w-[154px] whitespace-normal break-words',
    description: 'w-full',
    icon: '',
  },
  variants: {
    size: {
      default: {
        base: '',
        label: 'text-xs',
        icon: '[&_svg]:size-4',
      },
      xs: {
        base: '',
        label: 'text-xs',
        icon: '[&_svg]:size-3.5',
      },
      sm: {
        base: '',
        label: 'text-sm',
        icon: '[&_svg]:size-4',
      },
      md: {
        base: '',
        label: 'text-md',
        icon: '[&_svg]:size-4',
      },
      lg: {
        base: 'text-lg',
        label: 'text-lg',
        icon: '[&_svg]:size-5',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type CheckboxFilterProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {
    label: string;
    icon?: React.ReactElement;
    count?: number;
    description?: string;
  };

function CheckboxFilter({
  size = 'default',
  className,
  label,
  icon,
  count,
  description,
  ...props
}: CheckboxFilterProps) {
  const styles = checkboxFilterVariants({ size });
  const name = label.toLowerCase().replaceAll(' ', '-');

  return (
    <div
      className={styles.base({ className })}
      onClick={() => {
        if (props.onCheckedChange) {
          const checked = props.checked ?? false;
          props.onCheckedChange(!checked);
        }
      }}
    >
      <Checkbox name={name} size={size} {...props} />

      {icon && <div className={styles.icon({ size })}>{icon}</div>}

      <Label className={cn('flex-1', styles.label({ size }))} htmlFor={name}>
        <span>{label}</span>
        <div className={cn('text-muted-foreground', styles.label({ size }), styles.description())}>{description}</div>
      </Label>

      {count != undefined && (
        <span className={cn('text-muted-foreground font-mono text-right min-w-12', styles.label({ size }))}>
          {numberFormatWithAbbrv(count)}
        </span>
      )}
    </div>
  );
}
export default CheckboxFilter;
