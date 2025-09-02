import { tv, VariantProps } from 'tailwind-variants';

const textMutedVariants = tv({
  slots: {
    base: 'text-muted-foreground',
  },
  variants: {
    size: {
      xs: {
        base: 'text-xs',
      },
      sm: {
        base: 'text-sm',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export type TextMutedProps = React.ComponentProps<'div'> & VariantProps<typeof textMutedVariants>;
export function TextMuted({ className, size, children }: TextMutedProps) {
  const style = textMutedVariants({ size });
  return <p className={style.base({ className })}>{children}</p>;
}
