import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { checkAuth } from '@/lib/auth';

// GET - Fetch testimonials
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');

        let sql = 'SELECT * FROM testimonials';
        if (featured === 'true') {
            sql += ' WHERE is_featured = 1';
        }
        sql += ' ORDER BY created_at DESC';

        const result = await turso.execute(sql);

        const testimonials = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            role: row.role,
            content: row.content,
            rating: Number(row.rating),
            image_url: row.image_url,
            is_featured: Boolean(row.is_featured),
            created_at: row.created_at
        }));

        return NextResponse.json(testimonials);
    } catch (error: any) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create testimonial
export async function POST(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const { name, role, content, rating, image_url, is_featured } = body;

        if (!name || !content) {
            return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        await turso.execute({
            sql: `INSERT INTO testimonials (id, name, role, content, rating, image_url, is_featured) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [id, name, role || '', content, rating || 5, image_url || '', is_featured ? 1 : 0]
        });

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete testimonial
export async function DELETE(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM testimonials WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update testimonial
export async function PUT(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const { id, name, role, content, rating, image_url, is_featured } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await turso.execute({
            sql: `UPDATE testimonials SET name = ?, role = ?, content = ?, rating = ?, image_url = ?, is_featured = ? WHERE id = ?`,
            args: [name, role || '', content, rating || 5, image_url || '', is_featured ? 1 : 0, id]
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating testimonial:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
