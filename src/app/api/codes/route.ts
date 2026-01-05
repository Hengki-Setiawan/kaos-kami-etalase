import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// GET - fetch all codes
export async function GET() {
    try {
        const result = await turso.execute(`
            SELECT c.*, p.name as product_name 
            FROM codes c 
            LEFT JOIN products p ON c.product_id = p.id 
            ORDER BY c.created_at DESC
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching codes:', error);
        return NextResponse.json([], { status: 200 });
    }
}

// POST - generate codes
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { product_id, quantity = 1 } = body;

        if (!product_id) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        const codes = [];
        for (let i = 0; i < quantity; i++) {
            const id = crypto.randomUUID();
            const code = generateCode();

            await turso.execute({
                sql: `INSERT INTO codes (id, code, product_id, status, scan_count, created_at) 
                      VALUES (?, ?, ?, 'active', 0, datetime('now'))`,
                args: [id, code, product_id]
            });

            codes.push({ id, code });
        }

        return NextResponse.json({ success: true, codes });
    } catch (error) {
        console.error('Error generating codes:', error);
        return NextResponse.json({ error: 'Failed to generate codes' }, { status: 500 });
    }
}

// DELETE - delete code
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM codes WHERE id = ?',
            args: [id]
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting code:', error);
        return NextResponse.json({ error: 'Failed to delete code' }, { status: 500 });
    }
}

// Generate unique code
function generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'KK-';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
