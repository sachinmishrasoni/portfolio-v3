import React from 'react';

type AdminPageHeaderProps = {
    title: string;
    description?: string;
    /** Buttons for the right side, e.g. "New project" */
    actions?: React.ReactNode;
};

/** The title row at the top of every admin page, so they all line up the same way. */
const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, description, actions }) => (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:mb-8">
        <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
            {description && (
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    {description}
                </p>
            )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
);

export default AdminPageHeader;
