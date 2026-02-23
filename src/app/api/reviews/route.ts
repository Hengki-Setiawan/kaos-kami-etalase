import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        let query = 'SELECT * FROM reviews WHERE status = \'approved\'';
        const params: any[] = [];

        if (productId) {
            query += ' AND product_id = ?';
            params.push(productId);
        }

        const isFeatured = searchParams.get('featured');
        if (isFeatured === 'true') {
            query += ' AND is_featured = 1';
        }

        query += ' ORDER BY created_at DESC';

        const result = await turso.execute({
            sql: query,
            args: params
        });

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userCount = await currentUser();
        const { userId } = await auth();

        if (!userId || !userCount) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { productId, rating, content, imageUrl } = body;

        if (!productId || !rating || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        const userName = userCount.firstName ? `${userCount.firstName} ${userCount.lastName || ''}`.trim() : 'Anonymous';

        await turso.execute({
            sql: 'INSERT INTO reviews (id, product_id, user_id, user_name, rating, content, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            args: [id, productId, userId, userName, rating, content, imageUrl || null, 'pending']
        });

        return NextResponse.json({ message: 'Review submitted successfully', id }, { status: 201 });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
