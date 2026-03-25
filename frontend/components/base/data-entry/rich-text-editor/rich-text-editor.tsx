import { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, EditorContentProps, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { cn } from '@/components/lib/utils';

import RichTextEditorToolbar from './rich-text-editor-toolbar';

export const EDITOR_EMPTY_CONTENT = '<p></p>';

export function isEditorHasEmptyContent(content: string) {
  return content.length === 0 || content === EDITOR_EMPTY_CONTENT;
}

export type RichTextEditorProps = Omit<EditorContentProps, 'ref' | 'editor' | 'onChange' | 'onBlur'> & {
  ref?: React.Ref<HTMLDivElement>;
  value?: string;
  className?: string;
  wrapperClassName?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  clearContent?: boolean;
  autofocus?: boolean;
  editable?: boolean;
  resisizable?: boolean;
  actions?: React.ReactElement[];
};

const RichTextEditor = ({
  value,
  actions = [],
  className,
  wrapperClassName,
  onChange,
  clearContent,
  onBlur,
  editable = true,
  resisizable = true,
  autofocus,
  ...props
}: RichTextEditorProps) => {
  const editor = useEditor(
    {
      autofocus: autofocus ? 'end' : false,
      editable: editable,
      editorProps: {
        attributes: {
          class: cn(
            'min-h-[80px] w-full bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
            className,
            {
              ['resize-y']: resisizable,
            },
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
              class: 'list-decimal pl-4',
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc pl-4',
            },
          },
        }),
        Link.configure({
          openOnClick: true,
          autolink: true,
          defaultProtocol: 'https',
          protocols: ['http', 'https'],
          HTMLAttributes: {
            class: 'text-primary underline hover:no-underline hover:cursor-pointer',
          },
          isAllowedUri: (url, ctx) => {
            try {
              const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`);

              if (!ctx.defaultValidate(parsedUrl.href)) {
                return false;
              }

              const disallowedProtocols = ['ftp', 'file', 'mailto'];
              const protocol = parsedUrl.protocol.replace(':', '');

              if (disallowedProtocols.includes(protocol)) {
                return false;
              }

              const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme));

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
      ],
      content: value,
    },
    [],
  );

  useEffect(() => {
    if (editor && clearContent) {
      editor.commands.clearContent();
    }
  }, [editor, clearContent]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <div
      className={cn(
        'shadow-xs rounded-md bg-background border border-input focus-within:ring-1 focus-within:ring-ring overflow-hidden',
        wrapperClassName,
      )}
    >
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
      <EditorContent editor={editor} {...props} />
      {actions.length > 0 && <div className="flex justify-end gap-1.5 px-2 py-2">{actions.map(action => action)}</div>}
    </div>
  );
};

export default RichTextEditor;
