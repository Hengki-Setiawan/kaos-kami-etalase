import { NextResponse } from 'next/server';
import { checkIsAdmin } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();
        const token = await client.signInTokens.createSignInToken({
            userId: id,
            expiresInSeconds: 60 * 5 // 5 minutes
        });

        return NextResponse.json({ url: token.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
