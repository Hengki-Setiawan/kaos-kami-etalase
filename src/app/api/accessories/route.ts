import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// GET - fetch all accessories
export async function GET() {
    try {
        const result = await turso.execute('SELECT * FROM accessories ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching accessories:', error);
        return NextResponse.json([], { status: 200 });
    }
}

// POST - create accessory
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, category, price, image_url } = body;

        const id = crypto.randomUUID();
        await turso.execute({
            sql: `INSERT INTO accessories (id, name, description, category, price, image_url, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
            args: [id, name, description || '', category || 'Ganci', price || 0, image_url || '']
        });

        return NextResponse.json({ id, success: true });
    } catch (error) {
        console.error('Error creating accessory:', error);
        return NextResponse.json({ error: 'Failed to create accessory' }, { status: 500 });
    }
}

// PUT - update accessory
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, description, category, price, image_url } = body;

        await turso.execute({
            sql: `UPDATE accessories SET name = ?, description = ?, category = ?, price = ?, image_url = ? WHERE id = ?`,
            args: [name, description || '', category || 'Ganci', price || 0, image_url || '', id]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating accessory:', error);
        return NextResponse.json({ error: 'Failed to update accessory' }, { status: 500 });
    }
}

// DELETE - delete accessory
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM accessories WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting accessory:', error);
        return NextResponse.json({ error: 'Failed to delete accessory' }, { status: 500 });
    }
}
