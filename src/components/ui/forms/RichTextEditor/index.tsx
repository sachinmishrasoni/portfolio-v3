"use client";

import dynamic from "next/dynamic";
import { RichTextEditorProps } from "./RichTextEditorContent";
// import type { RichTextEditorProps } from "./types";

const RichTextEditorContent = dynamic<RichTextEditorProps>(
  () => import("./RichTextEditorContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-40 rounded-xl border border-border bg-background/60" />
    ),
  }
);

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <RichTextEditorContent {...props} />;
};

export default RichTextEditor;
