import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { checkAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET attributes (optionally filtered by type)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        let query = 'SELECT * FROM product_attributes ORDER BY type, label';
        let args: any[] = [];

        if (type) {
            query = 'SELECT * FROM product_attributes WHERE type = ? ORDER BY label';
            args = [type];
        }

        const result = await turso.execute({ sql: query, args });
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching attributes:', error);
        return NextResponse.json({ error: 'Failed to fetch attributes' }, { status: 500 });
    }
}

// POST create attribute
export async function POST(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const { type, value, label } = body;

        if (!type || !value || !label) {
            return NextResponse.json({ error: 'Type, value, and label are required' }, { status: 400 });
        }

        const id = crypto.randomUUID();

        await turso.execute({
            sql: `INSERT INTO product_attributes (id, type, value, label) VALUES (?, ?, ?, ?)`,
            args: [id, type, value, label]
        });

        return NextResponse.json({ id, message: 'Attribute created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating attribute:', error);
        return NextResponse.json({ error: 'Failed to create attribute' }, { status: 500 });
    }
}

// DELETE attribute
export async function DELETE(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Attribute ID is required' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM product_attributes WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ message: 'Attribute deleted successfully' });
    } catch (error) {
        console.error('Error deleting attribute:', error);
        return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 });
    }
}
