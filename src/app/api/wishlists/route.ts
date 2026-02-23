import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await turso.execute({
            sql: 'SELECT product_id FROM wishlists WHERE user_id = ? ORDER BY created_at DESC',
            args: [userId]
        });

        const wishlists = result.rows.map(row => row.product_id);
        return NextResponse.json(wishlists);
    } catch (error) {
        console.error('Error fetching wishlists:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlists' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Missing product_id' }, { status: 400 });
        }

        const id = crypto.randomUUID();

        // Use IGNORE in case it already exists
        await turso.execute({
            sql: 'INSERT OR IGNORE INTO wishlists (id, user_id, product_id) VALUES (?, ?, ?)',
            args: [id, userId, productId]
        });

        return NextResponse.json({ message: 'Added to wishlist' }, { status: 201 });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Missing productId parameter' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
            args: [userId, productId]
        });

        return NextResponse.json({ message: 'Removed from wishlist' }, { status: 200 });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
