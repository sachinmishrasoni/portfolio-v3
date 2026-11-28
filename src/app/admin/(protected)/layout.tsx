import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/layout/admin/AdminShell';
import { requireAdmin } from '@/lib/auth/require.admin';
import { SIDEBAR_COOKIE } from '@/config/admin.config';

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

    // Read the saved sidebar state on the server so the first paint is already correct
    const cookieStore = await cookies();
    const defaultCollapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === '1';

    return (
        <AdminShell
            user={{ name: 'Sachin Mishra Soni', role: 'Owner' }}
            badges={{ messages: 0 }}
            defaultCollapsed={defaultCollapsed}
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