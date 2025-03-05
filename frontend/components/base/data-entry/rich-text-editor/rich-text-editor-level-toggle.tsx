import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/base/ui/dropdown-menu";
import { Toggle } from "@/components/base/ui/toggle";
import { ChevronDownIcon, Heading1Icon } from "lucide-react";

interface FormatAction {
  label: string;
  icon?: React.ReactNode;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
  canExecute: (editor: Editor) => boolean;
  shortcuts: string[];
  value: string;
}

interface TextStyle
  extends Omit<
    FormatAction,
    "value" | "icon" | "action" | "isActive" | "canExecute"
  > {
  element: keyof React.JSX.IntrinsicElements;
  level?: Level;
  className: string;
}

const formatActions: TextStyle[] = [
  {
    label: "Normal Text",
    element: "span",
    className: "grow",
    shortcuts: ["mod", "alt", "0"],
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
    className: "m-0 grow text-3xl font-extrabold",
    shortcuts: ["mod", "alt", "1"],
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
    className: "m-0 grow text-xl font-bold",
    shortcuts: ["mod", "alt", "2"],
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
    className: "m-0 grow text-lg font-semibold",
    shortcuts: ["mod", "alt", "3"],
  },
  {
    label: "Heading 4",
    element: "h4",
    level: 4,
    className: "m-0 grow text-base font-semibold",
    shortcuts: ["mod", "alt", "4"],
  },
  {
    label: "Heading 5",
    element: "h5",
    level: 5,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "5"],
  },
  {
    label: "Heading 6",
    element: "h6",
    level: 6,
    className: "m-0 grow text-sm font-normal",
    shortcuts: ["mod", "alt", "6"],
  },
];

interface RichTextEditorLevelToggleProps {
  editor: Editor;
  activeLevels?: Level[];
}

function RichTextEditorLevelToggle({
  editor,
  activeLevels = [1, 2, 3, 4, 5, 6],
}: RichTextEditorLevelToggleProps) {
  const filteredActions = React.useMemo(
    () =>
      formatActions.filter(
        (action) => !action.level || activeLevels.includes(action.level)
      ),
    [activeLevels]
  );

  const handleStyleChange = React.useCallback(
    (level?: Level) => {
      if (level) {
        editor.chain().focus().toggleHeading({ level }).run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    },
    [editor]
  );

  const renderMenuItem = React.useCallback(
    ({ label, element: Element, level, className }: TextStyle) => (
      <DropdownMenuItem
        key={label}
        onClick={() => handleStyleChange(level)}
        className={cn("flex flex-row items-center justify-between gap-4", {
          "bg-accent": level
            ? editor.isActive("heading", { level })
            : editor.isActive("paragraph"),
        })}
        aria-label={label}
      >
        <Element className={className}>{label}</Element>
      </DropdownMenuItem>
    ),
    [editor, handleStyleChange]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toggle size="sm" pressed={editor.isActive("heading")}>
          <Heading1Icon />
          <ChevronDownIcon />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full">
        {filteredActions.map(renderMenuItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RichTextEditorLevelToggle;
