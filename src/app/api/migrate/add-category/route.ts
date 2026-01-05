import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET() {
    try {
        await turso.execute("ALTER TABLE products ADD COLUMN category TEXT");
        return NextResponse.json({ message: "Migration successful: Added category column" });
    } catch (error: any) {
        if (error.message.includes("duplicate column name")) {
            return NextResponse.json({ message: "Column already exists" });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
