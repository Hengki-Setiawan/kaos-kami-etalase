import { AdminLayout } from '@/components/AdminLayout';
import { checkIsAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <AdminLayout>{children}</AdminLayout>
    );
}
