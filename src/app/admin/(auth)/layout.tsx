import React from 'react';
import AuthLayout from '@/components/layout/auth/AuthShell';

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    )
}
