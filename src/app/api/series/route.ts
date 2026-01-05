import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// GET all series
export async function GET() {
    try {
        const result = await turso.execute('SELECT * FROM series ORDER BY name ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching series:', error);
        return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
    }
}

// POST create new series
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, description, theme_color, accent_color, tagline } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const id = crypto.randomUUID();

        await turso.execute({
            sql: `INSERT INTO series (id, name, slug, description, theme_color, accent_color, tagline, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            args: [id, name, slug, description || '', theme_color || '#0a0a0a', accent_color || '#8b5cf6', tagline || '']
        });

        return NextResponse.json({ id, message: 'Series created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating series:', error);
        return NextResponse.json({ error: 'Failed to create series' }, { status: 500 });
    }
}

// PUT update series
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, slug, description, theme_color, accent_color, tagline } = body;

        if (!id) {
            return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
        }

        await turso.execute({
            sql: `UPDATE series SET name = ?, slug = ?, description = ?, theme_color = ?, accent_color = ?, tagline = ? WHERE id = ?`,
            args: [name, slug, description, theme_color, accent_color, tagline, id]
        });

        return NextResponse.json({ message: 'Series updated successfully' });
    } catch (error) {
        console.error('Error updating series:', error);
        return NextResponse.json({ error: 'Failed to update series' }, { status: 500 });
    }
}

// DELETE series
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
        }

        // Check if series has products
        const products = await turso.execute({
            sql: 'SELECT COUNT(*) as count FROM products WHERE series = (SELECT slug FROM series WHERE id = ?)',
            args: [id]
        });

        const count = products.rows[0]?.count;
        if (count && Number(count) > 0) {
            return NextResponse.json({ error: 'Cannot delete series with existing products' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM series WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ message: 'Series deleted successfully' });
    } catch (error) {
        console.error('Error deleting series:', error);
        return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 });
    }
}
