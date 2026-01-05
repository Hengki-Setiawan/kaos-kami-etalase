import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        // Add qr_link column to labels table
        await turso.execute(`
            ALTER TABLE labels ADD COLUMN qr_link TEXT;
        `);

        return NextResponse.json({
            success: true,
            message: 'Added qr_link column to labels table'
        });
    } catch (error: any) {
        // Ignore error if column already exists
        if (error.message && error.message.includes('duplicate column name')) {
            return NextResponse.json({
                success: true,
                message: 'Column qr_link already exists'
            });
        }

        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
