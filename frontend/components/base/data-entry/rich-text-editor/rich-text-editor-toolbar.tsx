import { Editor } from "@tiptap/react";
import { Toggle } from "@/components/base/ui/toggle";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  Link2Icon,
  UnderlineIcon,
} from "lucide-react";
import { Separator } from "@/components/base/ui/separator";
import { useCallback } from "react";
import RichTextEditorLevelToggle from "./rich-text-editor-level-toggle";
import { useI18n } from "@/components/hooks/i18n";

function RichTextEditorToolbar({ editor }: { editor: Editor }) {
  const { t } = useI18n();
  
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(t('common.editor.toolbar.urlPrompt'), previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      console.error(e);
    }
  }, [editor, t]);

  return (
    <div className="border border-input bg-transparent rounded-tr-md rounded-tl-md p-1 flex flex-row items-center gap-1">
      <RichTextEditorLevelToggle editor={editor} />
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon />
      </Toggle>
      <Separator orientation="vertical" className="w-px h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </Toggle>
      <Separator orientation="vertical" className="w-px h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={() => setLink()}
      >
        <Link2Icon />
      </Toggle>
    </div>
  );
}

export default RichTextEditorToolbar;
