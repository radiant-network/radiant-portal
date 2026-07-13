import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { tv, VariantProps } from 'tailwind-variants';

import { Checkbox, checkboxVariants } from '@/components/base/shadcn/checkbox';
import { Label } from '@/components/base/shadcn/label';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';
import { cn } from '@/components/lib/utils';

export const checkboxFilterVariants = tv({
  slots: {
    base: 'flex items-start gap-2 w-full max-w-[228px] cursor-pointer justify-between',
    label: 'first-letter:capitalize line-clamp-2 cursor-pointer max-w-[154px] whitespace-normal break-words',
    description: 'w-full',
    icon: '',
  },
  variants: {
    size: {
      default: {
        base: '',
        label: 'text-xs leading-4',
        icon: '[&_svg]:size-4',
      },
      xs: {
        base: '',
        label: 'text-xs leading-[14px]',
        icon: '[&_svg]:size-3.5',
      },
      sm: {
        base: '',
        label: 'text-sm leading-4',
        icon: '[&_svg]:size-4',
      },
      md: {
        base: '',
        label: 'text-md leading-5',
        icon: '[&_svg]:size-4',
      },
      lg: {
        base: 'text-lg',
        label: 'text-lg leading-6',
        icon: '[&_svg]:size-5',
      },
    },
    fluid: {
      true: {
        base: 'max-w-none',
        label: 'max-w-none',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type CheckboxFilterProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {
    label: React.ReactNode;
    icon?: React.ReactElement;
    count?: number;
    description?: string;
    fluid?: boolean;
    dataCy?: string;
  };

function CheckboxFilter({
  size = 'default',
  className,
  label,
  icon,
  count,
  description,
  fluid,
  dataCy,
  ...props
}: CheckboxFilterProps) {
  const styles = checkboxFilterVariants({ size, fluid });
  const name = typeof label === 'string' ? label.toLowerCase().replaceAll(' ', '-') : undefined;

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
      <Checkbox name={name} size={size} data-cy={dataCy} {...props} />

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
