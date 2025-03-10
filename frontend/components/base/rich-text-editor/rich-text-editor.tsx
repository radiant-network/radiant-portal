import { useEditor, EditorContent, EditorContentProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/components/lib/utils";
import RichTextEditorToolbar from "./rich-text-editor-toolbar";
import Heading from "@tiptap/extension-heading";

export type RichTextEditorProps = Omit<
  EditorContentProps,
  "editor" | "onChange" | "onBlur"
> & {
  value?: string;
  className?: string;
  wrapperClassName?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

const RichTextEditor = ({
  value,
  className,
  wrapperClassName,
  onChange,
  onBlur,
  ...props
}: RichTextEditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[80px] w-full rounded-md rounded-tr-none rounded-tl-none border border-input bg-transparent px-3 py-2 border-t-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto resize-y",
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onBlur,
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        HTMLAttributes: {
          class:
            "text-primary underline hover:no-underline hover:cursor-pointer",
        },
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            return true;
          } catch {
            return false;
          }
        },
      }),
      Underline,
      Heading,
    ],
    content: value,
  });

  return (
    <div
      className={cn(
        "bg-white rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        wrapperClassName
      )}
    >
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
      <EditorContent editor={editor} {...props} />
    </div>
  );
};

export default RichTextEditor;
