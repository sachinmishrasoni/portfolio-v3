// src/app/admin/(protected)/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/layout/admin/AdminShell';
import { requireAdmin } from '@/features/admin/auth/require-admin';

export const metadata: Metadata = {
    title: { default: 'Admin', template: '%s · Admin' },
    robots: { index: false, follow: false },
};

async function AdminGate({ children }: { children: ReactNode }) {
    try {
        await requireAdmin();
    } catch {
        redirect('/admin/login');
    }

    return (
        <AdminShell
            user={{ name: 'Sachin Mishra Soni', role: 'Owner' }}
            badges={{ messages: 0 }}
        >
            {children}
        </AdminShell>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={null}>
            <AdminGate>{children}</AdminGate>
        </Suspense>
    );
}