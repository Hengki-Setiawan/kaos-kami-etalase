import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { checkAuth } from '@/lib/auth';

export async function GET() {
    try {
        const result = await turso.execute('SELECT * FROM site_settings');
        const settings = result.rows.reduce((acc, row) => {
            acc[row.key as string] = row.value === 'true' ? true : row.value === 'false' ? false : row.value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    // Only admins can update settings
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;

    try {
        const body = await req.json();
        const settings = body.settings;

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
        }

        const stmts = Object.entries(settings).map(([key, value]) => {
            const stringValue = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
            return {
                sql: `
                    INSERT INTO site_settings (key, value, updated_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
                `,
                args: [key, stringValue]
            };
        });

        if (stmts.length > 0) {
            await turso.batch(stmts, 'write');
        }

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
