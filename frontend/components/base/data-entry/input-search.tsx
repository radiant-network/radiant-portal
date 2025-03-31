import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/base/ui/button';
import { SearchIcon } from 'lucide-react';
import { Input, InputProps } from '@/components/base/ui/input';
import { useCallback, useRef, useState } from 'react';

export type InputSearchProps = InputProps & {
  onSearch: (value: string) => void | Promise<void>;
  searchButtonProps?: Omit<ButtonProps, 'onClick'>;
  ref?: React.Ref<HTMLInputElement>;
  wrapperClassName?: string;
};

function InputSearch({
  ref,
  className,
  wrapperClassName,
  type,
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
        className={cn('rounded-r-none focus:z-[2]', className)}
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
        color="default"
        variant="outlined"
        {...searchButtonProps}
        loading={loading || searchButtonProps?.loading}
        className={cn('h-9 px-3 shadow-sm rounded-l-none ml-[-1px] hover:z-[2]', searchButtonProps?.className)}
        onClick={() => handleSearch(value)}
      >
        {!searchButtonProps?.loading && !loading && <SearchIcon />}
      </Button>
    </div>
  );
}

export default InputSearch;
