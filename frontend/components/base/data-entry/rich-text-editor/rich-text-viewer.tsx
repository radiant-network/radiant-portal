import { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorContent, EditorContentProps, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { cn } from '@/components/lib/utils';

export type RichTextViewerProps = Omit<EditorContentProps, 'ref' | 'editor' | 'onChange' | 'onBlur'> & {
  ref?: React.Ref<HTMLDivElement>;
  value: string;
  className?: string;
  wrapperClassName?: string;
};

const RichTextViewer = ({ value, className, wrapperClassName, ...props }: RichTextViewerProps) => {
  const editor = useEditor(
    {
      editorProps: {
        attributes: {
          class: cn('w-full bg-transparent text-sm overflow-auto', className),
        },
      },
      editable: false,
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
    editor?.commands.setContent(value);
  }, [value]);

  return (
    <div className={cn('bg-background', wrapperClassName)}>
      <EditorContent editor={editor} {...props} />
    </div>
  );
};

export default RichTextViewer;
