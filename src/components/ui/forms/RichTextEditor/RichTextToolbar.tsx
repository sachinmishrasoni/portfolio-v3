'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditorState, type Editor } from '@tiptap/react';
import {
    LuAlignCenter,
    LuAlignLeft,
    LuAlignRight,
    LuBold,
    LuChevronDown,
    LuChevronLeft,
    LuChevronRight,
    LuCode,
    LuItalic,
    LuLink,
    LuList,
    LuListOrdered,
    LuQuote,
    LuRedo2,
    LuRemoveFormatting,
    LuStrikethrough,
    LuUnderline,
    LuUndo2,
    LuUnlink,
} from 'react-icons/lu';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/* ------------------------------ small pieces ------------------------------ */

type ToolbarButtonProps = {
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
    label,
    active,
    disabled,
    onClick,
    children,
}) => (
    <Button
        type="button"
        variant="ghost"
        size="icon"
        title={label}
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        // Keeps the editor selection when clicking a toolbar button
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className={cn('size-8 rounded-lg', active && 'bg-primary/15 text-primary hover:bg-primary/20')}
    >
        {children}
    </Button>
);

const Divider = () => <Separator orientation="vertical" className="mx-1 h-5" />;

// Trigger styled like a button without `asChild` (works with Radix and Base UI)
const triggerLook = (className?: string) =>
    cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'h-8 gap-1 rounded-lg px-2 font-mono text-xs',
        className,
    );

/** Arrow shown on desktop only, over the left/right edge of the toolbar */
const ScrollArrow: React.FC<{ side: 'left' | 'right'; onClick: () => void }> = ({ side, onClick }) => (
    <div
        className={cn(
            'absolute inset-y-0 z-10 hidden items-center md:flex',
            side === 'left'
                ? 'left-0 bg-gradient-to-r from-background from-60% to-transparent pl-1 pr-4'
                : 'right-0 bg-gradient-to-l from-background from-60% to-transparent pl-4 pr-1',
        )}
    >
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={side === 'left' ? 'Scroll toolbar left' : 'Scroll toolbar right'}
            // Keeps the editor selection
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClick}
            className="size-7 rounded-lg border border-border/70 bg-background"
        >
            {side === 'left' ? <LuChevronLeft className="size-4" /> : <LuChevronRight className="size-4" />}
        </Button>
    </div>
);

/* ------------------------------- link popover ------------------------------ */

const LinkControl: React.FC<{ editor: Editor; active: boolean; disabled?: boolean }> = ({
    editor,
    active,
    disabled,
}) => {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next) setUrl((editor.getAttributes('link').href as string | undefined) ?? '');
    };

    const apply = () => {
        const trimmed = url.trim();
        if (!trimmed) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            const href = /^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        }
        setOpen(false);
    };

    const remove = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger
                type="button"
                title="Link"
                aria-label="Link"
                disabled={disabled}
                onMouseDown={(event: React.MouseEvent) => event.preventDefault()}
                className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'size-8 rounded-lg',
                    active && 'bg-primary/15 text-primary hover:bg-primary/20',
                )}
            >
                <LuLink className="size-4" />
            </PopoverTrigger>

            <PopoverContent align="start" className="w-72 space-y-2 p-3">
                <Input
                    autoFocus
                    value={url}
                    placeholder="https://example.com"
                    onChange={(event) => setUrl(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            apply();
                        }
                    }}
                    className="h-9 font-mono text-base md:text-sm"
                />
                <div className="flex justify-end gap-2">
                    {active && (
                        <Button type="button" variant="ghost" size="sm" onClick={remove}>
                            <LuUnlink className="size-4" /> Remove
                        </Button>
                    )}
                    <Button type="button" size="sm" onClick={apply}>
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

/* --------------------------------- toolbar --------------------------------- */

type RichTextToolbarProps = {
    editor: Editor | null;
    disabled?: boolean;
    className?: string;
};

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor, disabled, className }) => {
    // The editor does not re-render on every transaction, so read the toolbar state like this
    const state = useEditorState({
        editor,
        selector: ({ editor: e }) => ({
            bold: e?.isActive('bold') ?? false,
            italic: e?.isActive('italic') ?? false,
            underline: e?.isActive('underline') ?? false,
            strike: e?.isActive('strike') ?? false,
            code: e?.isActive('code') ?? false,
            bulletList: e?.isActive('bulletList') ?? false,
            orderedList: e?.isActive('orderedList') ?? false,
            blockquote: e?.isActive('blockquote') ?? false,
            link: e?.isActive('link') ?? false,
            h1: e?.isActive('heading', { level: 1 }) ?? false,
            h2: e?.isActive('heading', { level: 2 }) ?? false,
            h3: e?.isActive('heading', { level: 3 }) ?? false,
            alignCenter: e?.isActive({ textAlign: 'center' }) ?? false,
            alignRight: e?.isActive({ textAlign: 'right' }) ?? false,
            canUndo: e?.can().undo() ?? false,
            canRedo: e?.can().redo() ?? false,
        }),
    });

    /* ------------------------------ scroll logic ----------------------------- */
    // These hooks must stay above the early return below.

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const ready = Boolean(editor && state);

    const updateScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 1);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    // Re-check when the toolbar is resized
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScroll();
        const observer = new ResizeObserver(updateScroll);
        observer.observe(el);
        return () => observer.disconnect();
    }, [ready]);

    // Re-check after every render too, because the content width changes
    // (for example "Paragraph" becoming "Heading 1")
    useEffect(updateScroll);

    const scrollBy = (amount: number) =>
        scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

    if (!editor || !state) return null;

    const off = disabled;
    const run = () => editor.chain().focus();

    const headingLabel = state.h1 ? 'Heading 1' : state.h2 ? 'Heading 2' : state.h3 ? 'Heading 3' : 'Paragraph';
    const AlignIcon = state.alignCenter ? LuAlignCenter : state.alignRight ? LuAlignRight : LuAlignLeft;

    return (
        <div className={cn('relative border-b border-border/70', className)}>
            {canScrollLeft && <ScrollArrow side="left" onClick={() => scrollBy(-200)} />}

            <div
                ref={scrollRef}
                onScroll={updateScroll}
                role="toolbar"
                aria-label="Text formatting"
                // className={cn(
                //     'flex flex-nowrap items-center gap-0.5 overflow-x-auto px-2 py-1.5',
                //     // Hide the scrollbar (still scrolls with touch, wheel and the arrows)
                //     '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                //     // Stop the buttons from squeezing together
                //     '[&>*]:shrink-0',
                // )}
                className={cn(
                    'scrollbar-hide flex flex-nowrap items-center gap-0.5 overflow-x-auto px-2 py-1.5',
                    // Stop the buttons from squeezing together
                    '[&>*]:shrink-0',
                )}
            >
                {/* Block type */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        type="button"
                        disabled={off}
                        aria-label="Text style"
                        className={triggerLook('min-w-28 justify-between')}
                    >
                        {headingLabel}
                        <LuChevronDown className="size-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => run().setParagraph().run()}>Paragraph</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => run().toggleHeading({ level: 1 }).run()}>
                            Heading 1
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => run().toggleHeading({ level: 2 }).run()}>
                            Heading 2
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => run().toggleHeading({ level: 3 }).run()}>
                            Heading 3
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Divider />

                {/* Inline marks */}
                <ToolbarButton label="Bold" active={state.bold} disabled={off} onClick={() => run().toggleBold().run()}>
                    <LuBold className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Italic"
                    active={state.italic}
                    disabled={off}
                    onClick={() => run().toggleItalic().run()}
                >
                    <LuItalic className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Underline"
                    active={state.underline}
                    disabled={off}
                    onClick={() => run().toggleUnderline().run()}
                >
                    <LuUnderline className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Strikethrough"
                    active={state.strike}
                    disabled={off}
                    onClick={() => run().toggleStrike().run()}
                >
                    <LuStrikethrough className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Inline code"
                    active={state.code}
                    disabled={off}
                    onClick={() => run().toggleCode().run()}
                >
                    <LuCode className="size-4" />
                </ToolbarButton>

                <Divider />

                {/* Lists + quote */}
                <ToolbarButton
                    label="Bullet list"
                    active={state.bulletList}
                    disabled={off}
                    onClick={() => run().toggleBulletList().run()}
                >
                    <LuList className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Numbered list"
                    active={state.orderedList}
                    disabled={off}
                    onClick={() => run().toggleOrderedList().run()}
                >
                    <LuListOrdered className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Quote"
                    active={state.blockquote}
                    disabled={off}
                    onClick={() => run().toggleBlockquote().run()}
                >
                    <LuQuote className="size-4" />
                </ToolbarButton>

                <Divider />

                {/* Alignment */}
                <DropdownMenu>
                    <DropdownMenuTrigger type="button" disabled={off} aria-label="Alignment" className={triggerLook()}>
                        <AlignIcon className="size-4" />
                        <LuChevronDown className="size-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => run().setTextAlign('left').run()}>
                            <LuAlignLeft className="size-4" /> Left
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => run().setTextAlign('center').run()}>
                            <LuAlignCenter className="size-4" /> Center
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => run().setTextAlign('right').run()}>
                            <LuAlignRight className="size-4" /> Right
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <LinkControl editor={editor} active={state.link} disabled={off} />

                <Divider />

                {/* History + clear */}
                <ToolbarButton label="Undo" disabled={off || !state.canUndo} onClick={() => run().undo().run()}>
                    <LuUndo2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton label="Redo" disabled={off || !state.canRedo} onClick={() => run().redo().run()}>
                    <LuRedo2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Clear formatting"
                    disabled={off}
                    onClick={() => run().clearNodes().unsetAllMarks().run()}
                >
                    <LuRemoveFormatting className="size-4" />
                </ToolbarButton>
            </div>

            {canScrollRight && <ScrollArrow side="right" onClick={() => scrollBy(200)} />}
        </div>
    );
};

export default RichTextToolbar;
