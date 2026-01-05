import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// GET - Fetch all page content or filter by page
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');

        let result;
        if (page) {
            result = await turso.execute({
                sql: 'SELECT * FROM page_content WHERE page = ? ORDER BY section, key',
                args: [page]
            });
        } else {
            result = await turso.execute('SELECT * FROM page_content ORDER BY page, section, key');
        }

        // Transform to nested object for easier use
        const content: Record<string, Record<string, Record<string, string>>> = {};

        for (const row of result.rows) {
            const pageName = row.page as string;
            const section = row.section as string;
            const key = row.key as string;
            const value = row.value as string;

            if (!content[pageName]) {
                content[pageName] = {};
            }
            if (!content[pageName][section]) {
                content[pageName][section] = {};
            }
            content[pageName][section][key] = value;
        }

        return NextResponse.json(content);
    } catch (error: any) {
        console.error('Error fetching page content:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Update page content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { page, section, key, value } = body;

        if (!page || !section || !key) {
            return NextResponse.json({ error: 'page, section, and key are required' }, { status: 400 });
        }

        // Check if exists
        const existing = await turso.execute({
            sql: 'SELECT id FROM page_content WHERE page = ? AND section = ? AND key = ?',
            args: [page, section, key]
        });

        if (existing.rows.length > 0) {
            // Update
            await turso.execute({
                sql: 'UPDATE page_content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE page = ? AND section = ? AND key = ?',
                args: [value || '', page, section, key]
            });
        } else {
            // Insert
            await turso.execute({
                sql: 'INSERT INTO page_content (id, page, section, key, value) VALUES (?, ?, ?, ?, ?)',
                args: [crypto.randomUUID(), page, section, key, value || '']
            });
        }

        return NextResponse.json({ success: true, message: 'Content updated' });
    } catch (error: any) {
        console.error('Error updating page content:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Bulk update content for a page
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { page, content } = body;

        if (!page || !content) {
            return NextResponse.json({ error: 'page and content are required' }, { status: 400 });
        }

        // content is { section: { key: value } }
        for (const [section, keys] of Object.entries(content)) {
            for (const [key, value] of Object.entries(keys as Record<string, string>)) {
                const existing = await turso.execute({
                    sql: 'SELECT id FROM page_content WHERE page = ? AND section = ? AND key = ?',
                    args: [page, section, key]
                });

                if (existing.rows.length > 0) {
                    await turso.execute({
                        sql: 'UPDATE page_content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE page = ? AND section = ? AND key = ?',
                        args: [value || '', page, section, key]
                    });
                } else {
                    await turso.execute({
                        sql: 'INSERT INTO page_content (id, page, section, key, value) VALUES (?, ?, ?, ?, ?)',
                        args: [crypto.randomUUID(), page, section, key, value || '']
                    });
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Content updated successfully' });
    } catch (error: any) {
        console.error('Error bulk updating page content:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
