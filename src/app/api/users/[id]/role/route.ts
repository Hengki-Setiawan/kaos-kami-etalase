import { NextResponse } from 'next/server';
import { checkIsAdmin } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        // We must await params in Next.js 15+ if needed, but here it's fine
        const { id } = await params;
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { role } = body;

        const client = await clerkClient();
        await client.users.updateUser(id, {
            publicMetadata: { role }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
