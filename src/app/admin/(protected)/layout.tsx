import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminShell from '@/components/layout/admin/AdminShell';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: { default: 'Admin', template: '%s · Admin' },
    // The admin area should never show up in search results
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    // const admin = await verifyAdmin();
    const admin = false;

    // if (!admin) {
    //     redirect("/admin/login");
    // }

    return (
        <AdminShell
            // TODO: replace with the signed-in user and real counts from your data layer
            user={{ name: 'Sachin Mishra Soni', role: 'Owner' }}
            badges={{ messages: 0 }}
        >
            {children}
        </AdminShell>
    );
}