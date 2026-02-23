import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, platform } = body;

        if (!productId || !platform) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const id = crypto.randomUUID();

        await turso.execute({
            sql: 'INSERT INTO product_clicks (id, product_id, platform) VALUES (?, ?, ?)',
            args: [id, productId, platform]
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error tracking click:', error);
        // Return 200 or 500 but keep it silent to client side
        return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
    }
}
