import { useEffect, useState } from 'react';
import { VariantProps } from 'tailwind-variants';

import { Button, buttonVariants } from '../ui/button';
import { ButtonGroup, buttonGroupVariants } from '../ui/button-group';

type ItemType = {
  label: string;
  value: string;
};

type ToggleButtonGroupProps = Omit<React.ComponentProps<'div'>, 'defaultValue'> &
  VariantProps<typeof buttonGroupVariants> &
  VariantProps<typeof buttonVariants> & {
    onValueChange: (value: any) => void;
    defaultValue: string;
    items: ItemType[];
  };

function ToggleButtonGroup({ onValueChange, defaultValue, items, size }: ToggleButtonGroupProps) {
  const [active, setActive] = useState<string>(defaultValue);

  useEffect(() => {
    onValueChange(active);
  }, [active]);

  return (
    <ButtonGroup>
      {items.map(item => (
        <Button
          key={item.value}
          onClick={() => setActive(item.value)}
          size={size}
          variant={active === item.value ? 'default' : 'outline'}
        >
          {item.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
export default ToggleButtonGroup;
