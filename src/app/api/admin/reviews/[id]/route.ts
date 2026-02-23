import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        // Assuming authorized users can manage reviews for now
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = (await params).id;
        const body = await request.json();
        const { status, is_featured } = body;

        if (status !== undefined) {
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
            }
            await turso.execute({
                sql: 'UPDATE reviews SET status = ? WHERE id = ?',
                args: [status, id]
            });
        }

        if (is_featured !== undefined) {
            await turso.execute({
                sql: 'UPDATE reviews SET is_featured = ? WHERE id = ?',
                args: [is_featured ? 1 : 0, id]
            });
        }

        return NextResponse.json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Error updating review status:', error);
        return NextResponse.json({ error: 'Failed to update review status' }, { status: 500 });
    }
}
