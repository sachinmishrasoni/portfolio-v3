"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ADMIN_BASE, ADMIN_VERSION, SITE_URL } from '@/config/admin.config';

const AdminFooter: React.FC = () => {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="shrink-0 border-t border-border px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono">
                    © {year} Sachin Mishra Soni · Portfolio admin{' '}
                    <span className="text-muted-foreground/70">v{ADMIN_VERSION}</span>
                </p>

                <nav aria-label="Admin footer">
                    <ul className="flex items-center gap-4">
                        <li>
                            <a
                                href={SITE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors hover:text-foreground"
                            >
                                View live site
                            </a>
                        </li>
                        <li>
                            <Link
                                href={`${ADMIN_BASE}/settings`}
                                className="transition-colors hover:text-foreground"
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    )
};

export default AdminFooter;
