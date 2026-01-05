import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        const attributes = [
            // Models
            { type: 'model', value: 'Regular Fit', label: 'Regular Fit' },
            { type: 'model', value: 'Oversize', label: 'Oversize' },
            { type: 'model', value: 'Slim Fit', label: 'Slim Fit' },
            // Materials
            { type: 'material', value: 'Cotton Combed 30s', label: 'Cotton Combed 30s' },
            { type: 'material', value: 'Cotton Combed 24s', label: 'Cotton Combed 24s' },
            { type: 'material', value: 'Fleece', label: 'Fleece' },
            { type: 'material', value: 'Terry', label: 'Terry' },
            // Sizes
            { type: 'size', value: 'S', label: 'S' },
            { type: 'size', value: 'M', label: 'M' },
            { type: 'size', value: 'L', label: 'L' },
            { type: 'size', value: 'XL', label: 'XL' },
            { type: 'size', value: 'XXL', label: 'XXL' },
            { type: 'size', value: 'XXXL', label: 'XXXL' },
        ];

        for (const attr of attributes) {
            const id = crypto.randomUUID();

            // Check if exists first to avoid duplicates
            const existing = await turso.execute({
                sql: "SELECT id FROM product_attributes WHERE type = ? AND value = ?",
                args: [attr.type, attr.value]
            });

            if (existing.rows.length === 0) {
                await turso.execute({
                    sql: "INSERT INTO product_attributes (id, type, value, label) VALUES (?, ?, ?, ?)",
                    args: [id, attr.type, attr.value, attr.label]
                });
            }
        }

        return NextResponse.json({ message: "Seeding successful: Added default models, materials, and sizes" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
