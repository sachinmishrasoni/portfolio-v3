import "./RichTextContent.css";

interface RichTextContentProps {
    content?: string | null;
    fallback?: string;
    className?: string;
}

const RichTextContent = ({
    content,
    fallback = "No content available.",
    className = "",
}: RichTextContentProps) => {
    const hasContent = Boolean(content?.trim());

    return (
        <div className={`rich-content text-muted-foreground ${className}`}>
            {hasContent ? (
                <div className="rich-content-body" dangerouslySetInnerHTML={{ __html: content! }} />
            ) : (
                <p className="rich-content-fallback">{fallback}</p>
            )}
        </div>
    );
};

export default RichTextContent;