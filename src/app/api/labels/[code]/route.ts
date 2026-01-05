import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Simple hash for IP anonymization
function hashIP(ip: string): string {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash = hash & hash;
    }
    return hash.toString(16);
}

// GET - Fetch label by code
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const result = await turso.execute({
            sql: 'SELECT * FROM labels WHERE code = ? AND is_active = 1',
            args: [code]
        });

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Label not found' }, { status: 404 });
        }

        const row = result.rows[0];

        // Track scan
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || '';

        await turso.execute({
            sql: `INSERT INTO label_scans (id, label_id, ip_hash, user_agent) VALUES (?, ?, ?, ?)`,
            args: [crypto.randomUUID(), row.id, hashIP(ip), userAgent.substring(0, 200)]
        });

        // Update scan count
        await turso.execute({
            sql: `UPDATE labels SET scan_count = scan_count + 1, last_scanned_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [row.id]
        });

        const label = {
            id: row.id,
            code: row.code,
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
            scan_count: Number(row.scan_count) + 1
        };

        return NextResponse.json(label);
    } catch (error: any) {
        console.error('Error fetching label:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
