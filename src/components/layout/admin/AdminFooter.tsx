
import React from 'react';

import { ADMIN_VERSION } from '@/config/admin.config';

const AdminFooter: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="shrink-0 border-t border-border bg-background px-4 py-3 sm:px-6">
            <div className="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row sm:justify-between sm:gap-4">

                {/* Copyright */}
                <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                    © {year} Sachin Mishra Soni. All rights reserved.
                </p>

                {/* Application Version */}
                <p className="font-mono text-[10px] text-muted-foreground/70 sm:text-xs">
                    Portfolio Admin <span className="mx-1">·</span> v{ADMIN_VERSION}
                </p>

            </div>
        </footer>
    );
};

export default AdminFooter;
