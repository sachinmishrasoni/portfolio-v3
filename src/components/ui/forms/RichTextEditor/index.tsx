'use client';

import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extensions';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from '../FormField';
import type { FieldBaseProps, FieldVariant } from '../form.types';
import RichTextToolbar from './RichTextToolbar';

export type RichTextEditorProps = Omit<FieldBaseProps, 'variant'> & {
    /** HTML string */
    value: string;
    /** Gets the HTML string ('' when the editor is empty), not an event */
    onChange: (html: string) => void;
    onBlur?: () => void;
    /** 'top' = label above the editor (default). 'border' = label sits on the top border. */
    variant?: Extract<FieldVariant, 'top' | 'border'>;
    /** Min height of the writing area, any CSS length (default 10rem) */
    minHeight?: string;
    /** Max height of the writing area, any CSS length. Not set by default; when set, the area scrolls. */
    maxHeight?: string;
};

// Tailwind's preflight removes list/heading styles, so the content area puts them back
const contentStyles = cn(
    '[&_.tiptap]:min-h-[var(--rte-min-h)] [&_.tiptap]:outline-none [&_.tiptap]:px-4 [&_.tiptap]:py-3 [&_.tiptap]:font-mono [&_.tiptap]:text-base md:[&_.tiptap]:text-sm',
    '[&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold',
    '[&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold',
    '[&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold',
    '[&_.tiptap_p]:my-1.5',
    '[&_.tiptap_ul]:my-2 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6',
    '[&_.tiptap_ol]:my-2 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6',
    '[&_.tiptap_blockquote]:my-2 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-border [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic',
    '[&_.tiptap_code]:rounded [&_.tiptap_code]:bg-muted [&_.tiptap_code]:px-1 [&_.tiptap_code]:py-0.5',
    '[&_.tiptap_a]:text-primary [&_.tiptap_a]:underline',
    // Placeholder
    '[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground/70 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    required,
    disabled,
    error,
    hint,
    className,
    variant = 'top',
    minHeight = '10rem',
    maxHeight,
}) => {
    const invalid = Boolean(error);
    const [focused, setFocused] = useState(false);

    const editor = useEditor({
        // Needed in Next.js so the editor is not rendered on the server
        immediatelyRender: false,
        editable: !disabled,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                link: {
                    openOnClick: false,
                    autolink: true,
                    HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: placeholder ?? '' }),
        ],
        content: value,
        editorProps: {
            attributes: {
                id,
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-invalid': String(invalid),
                ...(describedBy(id, error, hint) ? { 'aria-describedby': describedBy(id, error, hint)! } : {}),
            },
        },
        onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
    });

    // Keep the editor in sync when the value is changed from outside (form reset, loading saved data)
    useEffect(() => {
        if (!editor) return;
        const current = editor.isEmpty ? '' : editor.getHTML();
        if (value !== current) editor.commands.setContent(value, { emitUpdate: false });
    }, [value, editor]);

    useEffect(() => {
        editor?.setEditable(!disabled);
    }, [disabled, editor]);

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            // variant={variant}
            // The border label always sits on the border (there is no "empty" state to detect)
            floated={variant === 'border' ? true : undefined}
            error={error}
            hint={hint}
            className={className}
        >
            {/* So the content is submitted with a normal <form> */}
            <input type="hidden" name={name} value={value} />

            <div
                // Focus is tracked on the whole box, so the ring stays while the toolbar is used
                onFocus={() => setFocused(true)}
                onBlur={(event) => {
                    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                    setFocused(false);
                    onBlur?.();
                }}
                className={cn(
                    'w-full overflow-hidden rounded-xl border bg-background/60 transition-[border-color] duration-200',
                    invalid ? 'border-destructive/70' : 'border-border',
                    focused && (invalid ? 'border-destructive' : 'border-primary/60'),
                    disabled && 'cursor-not-allowed opacity-70',
                )}
            >
                <RichTextToolbar editor={editor} disabled={disabled} />

                <EditorContent
                    editor={editor}
                    className={cn(contentStyles, maxHeight && 'overflow-y-auto')}
                    style={
                        {
                            '--rte-min-h': minHeight,
                            ...(maxHeight ? { maxHeight } : {}),
                        } as React.CSSProperties
                    }
                />
            </div>
        </FormField>
    );
};

export default RichTextEditor;
