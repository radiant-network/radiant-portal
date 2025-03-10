import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/base/ui/button";
import { SearchIcon } from "lucide-react";
import { Input, InputProps } from "@/components/base/ui/input";

export type InputSearchProps = InputProps & {
  onSearch?: (value: InputProps["value"]) => void;
  searchButtonProps?: Omit<ButtonProps, "onClick">;
  ref?: React.Ref<HTMLInputElement>;
};

function InputSearch({
  ref,
  className,
  type,
  onSearch,
  searchButtonProps,
  ...props
}: InputSearchProps) {
  const [value, setValue] = React.useState(props.value);

  return (
    <div className="flex items-center">
      <Input
        type={type}
        className={cn(className, "rounded-r-none focus:z-[2]")}
        {...props}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange?.(e);
        }}
        ref={ref}
      />
      <Button
        color="default"
        variant="outlined"
        {...searchButtonProps}
        className={cn(
          "h-10 rounded-l-none ml-[-1px] hover:z-[2]",
          searchButtonProps?.className
        )}
        onClick={() => onSearch?.(value)}
      >
        {!searchButtonProps?.loading && <SearchIcon />}
      </Button>
    </div>
  );
}

export default InputSearch;
