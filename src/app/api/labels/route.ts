import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { checkAuth } from '@/lib/auth';

// Generate short random code
function generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// GET - List all labels
export async function GET(request: NextRequest) {
    try {
        const result = await turso.execute('SELECT * FROM labels ORDER BY created_at DESC');

        const labels = result.rows.map(row => ({
            id: row.id,
            code: row.code,
            product_id: row.product_id,
            name: row.name,
            image_url: row.image_url,
            images: row.images ? JSON.parse(row.images as string) : [],
            size: row.size,
            price: Number(row.price),
            material: row.material,
            color: row.color,
            description: row.description,
            story: row.story,
            care_instructions: row.care_instructions ? JSON.parse(row.care_instructions as string) : [],
            purchase_links: row.purchase_links ? JSON.parse(row.purchase_links as string) : [],
            qr_link: row.qr_link,
            is_active: Boolean(row.is_active),
            scan_count: Number(row.scan_count),
            last_scanned_at: row.last_scanned_at,
            created_at: row.created_at
        }));

        return NextResponse.json(labels);
    } catch (error: any) {
        console.error('Error fetching labels:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new label
export async function POST(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const {
            name, product_id, image_url, images, size, price,
            material, color, description, story, care_instructions, purchase_links, qr_link
        } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        const code = generateCode();

        await turso.execute({
            sql: `INSERT INTO labels (id, code, product_id, name, image_url, images, size, price, material, color, description, story, care_instructions, purchase_links, qr_link) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                id, code, product_id || '', name, image_url || '',
                JSON.stringify(images || []), size || '', price || 0,
                material || '', color || '', description || '', story || '',
                JSON.stringify(care_instructions || []),
                JSON.stringify(purchase_links || []),
                qr_link || ''
            ]
        });

        return NextResponse.json({ success: true, id, code });
    } catch (error: any) {
        console.error('Error creating label:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update label
export async function PUT(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const fields = [];
        const values = [];

        // Build dynamic update query
        const allowedFields = ['name', 'product_id', 'image_url', 'images', 'size', 'price', 'material', 'color', 'description', 'story', 'care_instructions', 'purchase_links', 'qr_link', 'is_active'];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                fields.push(`${field} = ?`);
                if (['images', 'care_instructions', 'purchase_links'].includes(field)) {
                    values.push(JSON.stringify(updates[field]));
                } else if (field === 'is_active') {
                    values.push(updates[field] ? 1 : 0);
                } else {
                    values.push(updates[field]);
                }
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await turso.execute({
            sql: `UPDATE labels SET ${fields.join(', ')} WHERE id = ?`,
            args: values
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating label:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete label
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
            sql: 'DELETE FROM labels WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting label:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
