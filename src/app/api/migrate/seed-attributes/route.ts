import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        const categories = [
            'T-Shirt', 'Hoodie', 'Accessories', 'Ganci', 'Pin',
            'Sticker', 'Bag', 'Lanyard', 'Charm', 'Other'
        ];

        for (const cat of categories) {
            const id = crypto.randomUUID();
            const value = cat; // Use the name as value for simplicity

            // Check if exists first to avoid duplicates if run multiple times
            const existing = await turso.execute({
                sql: "SELECT id FROM product_attributes WHERE type = 'category' AND value = ?",
                args: [value]
            });

            if (existing.rows.length === 0) {
                await turso.execute({
                    sql: "INSERT INTO product_attributes (id, type, value, label) VALUES (?, 'category', ?, ?)",
                    args: [id, value, cat]
                });
            }
        }

        return NextResponse.json({ message: "Seeding successful: Added default categories" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
