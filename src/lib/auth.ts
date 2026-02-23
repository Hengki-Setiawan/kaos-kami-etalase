import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const ADMIN_EMAILS = ['hengkisetiawan461@gmail.com'];

/**
 * Check if the current user is an admin via email or metadata.
 */
export async function checkIsAdmin(): Promise<boolean> {
    const user = await currentUser();
    if (!user) return false;

    if (user.publicMetadata?.role === 'admin') return true;

    const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
    return emails.some(email => ADMIN_EMAILS.includes(email));
}


/**
 * Check if the current request is authenticated.
 * Returns userId if authenticated, or a 401 response if not.
 */
export async function requireAuth(): Promise<{ userId: string } | NextResponse> {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized. Please sign in.' },
            { status: 401 }
        );
    }
    return { userId };
}

/**
 * Helper to check auth and return early if unauthorized.
 * Usage: const authResult = await checkAuth(); if (authResult instanceof NextResponse) return authResult;
 */
export async function checkAuth(): Promise<NextResponse | string> {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: 'Unauthorized. Please sign in.' },
            { status: 401 }
        );
    }
    return userId;
}
