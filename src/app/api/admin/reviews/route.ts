import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        // Here you would typically check if user is admin
        // For now, assuming authorized users can view
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await turso.execute('SELECT * FROM reviews ORDER BY created_at DESC');

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
