import { useCallback, useRef, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { Button, ButtonProps } from '@/components/base/shadcn/button';
import { Input, InputProps } from '@/components/base/shadcn/input';
import { cn } from '@/lib/utils';

export type InputSearchProps = InputProps & {
  onSearch: (value: string) => void | Promise<void>;
  searchButtonProps?: Omit<ButtonProps, 'onClick'>;
  ref?: React.Ref<HTMLInputElement>;
  wrapperClassName?: string;
};

// Match the search button (height + icon size) to the input height (same scale as inputVariants).
const buttonClassBySize: Record<string, string> = {
  default: 'h-9 [&_svg]:size-4',
  sm: 'h-8 [&_svg]:size-4',
  xs: 'h-7 [&_svg]:size-3.5',
  xxs: 'h-6 [&_svg]:size-3',
};

function InputSearch({
  ref,
  className,
  wrapperClassName,
  type,
  size,
  onSearch,
  searchButtonProps,
  ...props
}: InputSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(props.value);

  const handleSearch = useCallback(async (search: any) => {
    setLoading(true);
    await onSearch(search);
    setLoading(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;

      if (!input) return;

      if (e.key === 'Enter') {
        e.preventDefault();

        if (input.value !== '') {
          handleSearch(input.value);
        }
      }

      if (e.key === 'Escape') {
        input.blur();
      }
    },
    [inputRef.current],
  );

  return (
    <div className={cn('flex items-center w-full', wrapperClassName)}>
      <Input
        type={type}
        size={size}
        className={cn('rounded-r-none focus:z-2', className)}
        wrapperClassName="w-full"
        {...props}
        onKeyDown={e => {
          handleKeyDown(e);
          props.onKeyDown?.(e);
        }}
        onChange={e => {
          setValue(e.target.value);
          props.onChange?.(e);
        }}
        ref={iref => {
          inputRef.current = iref;
          if (typeof ref === 'function') {
            ref(iref);
          } else if (ref && 'current' in ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = iref;
          }
        }}
      />
      <Button
        {...searchButtonProps}
        variant="default"
        loading={loading || searchButtonProps?.loading}
        className={cn(
          'px-3 shadow-xs rounded-l-none -ml-px hover:z-2',
          buttonClassBySize[size ?? 'default'],
          searchButtonProps?.className,
        )}
        onClick={() => handleSearch(value)}
      >
        {!searchButtonProps?.loading && !loading && <SearchIcon />}
      </Button>
    </div>
  );
}

export default InputSearch;
