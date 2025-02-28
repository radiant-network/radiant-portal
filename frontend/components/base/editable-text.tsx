import { LucideProps, PencilLineIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { IconButton } from "./Buttons";

export type EditableTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children: string;
  onChangeText?: (text: string) => void;
};

const EditableText = ({
  children,
  icon = PencilLineIcon,
  onChangeText,
  ...props
}: EditableTextProps) => {
  const [edit, setEdit] = useState(false);

  return (
    <div {...props}>
      {edit ? (
        <Input
          defaultValue={children}
          autoFocus
          onBlur={(e) => {
            setEdit(false);
            onChangeText?.(e.currentTarget.value);
          }}
          className="max-w-96 w-full"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setEdit(false);
              onChangeText?.(e.currentTarget.value);
            }
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          <span>{children}</span>
          <IconButton icon={icon} onClick={() => setEdit(true)} />
        </div>
      )}
    </div>
  );
};

export default EditableText;
