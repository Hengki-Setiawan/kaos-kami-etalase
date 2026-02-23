import { NextResponse } from 'next/server';
import { checkIsAdmin } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();
        const users = await client.users.getUserList({
            limit: 100,
            orderBy: '-created_at'
        });

        const mappedUsers = users.data.map((u: any) => ({
            id: u.id,
            email: u.emailAddresses[0]?.emailAddress,
            firstName: u.firstName,
            lastName: u.lastName,
            createdAt: u.createdAt,
            role: u.publicMetadata?.role || 'member'
        }));

        return NextResponse.json(mappedUsers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
