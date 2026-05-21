import { Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';

import { Separator } from '@/components/base/shadcn/separator';
import { Toggle } from '@/components/base/shadcn/toggle';

import LinkPopover from './link-popover';

function RichTextEditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border-b bg-transparent p-1 flex flex-row items-center gap-1">
      <Toggle
        size="xs"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </Toggle>
      <Toggle
        size="xs"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </Toggle>
      <Toggle
        size="xs"
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </Toggle>
      <Toggle
        size="xs"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon />
      </Toggle>
      <Separator orientation="vertical" className="w-px h-8" />
      <Toggle
        size="xs"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </Toggle>
      <Toggle
        size="xs"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </Toggle>
      <Separator orientation="vertical" className="w-px h-8" />
      <LinkPopover editor={editor} />
    </div>
  );
}

export default RichTextEditorToolbar;
