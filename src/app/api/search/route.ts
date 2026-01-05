import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ products: [], accessories: [] });
        }

        const searchTerm = `%${query.toLowerCase()}%`;

        // Search products
        const productsResult = await turso.execute({
            sql: `SELECT id, name, series, category, description, price, image_url 
                  FROM products 
                  WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? 
                  LIMIT 10`,
            args: [searchTerm, searchTerm]
        });

        // Search accessories
        const accessoriesResult = await turso.execute({
            sql: `SELECT id, name, category, description, price, image_url 
                  FROM accessories 
                  WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? 
                  LIMIT 10`,
            args: [searchTerm, searchTerm]
        });

        const products = productsResult.rows.map(row => ({
            id: row.id,
            name: row.name,
            series: row.series,
            category: row.category,
            description: row.description,
            price: Number(row.price),
            image_url: row.image_url,
            type: 'product'
        }));

        const accessories = accessoriesResult.rows.map(row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            description: row.description,
            price: Number(row.price),
            image_url: row.image_url,
            type: 'accessory'
        }));

        return NextResponse.json({
            products,
            accessories,
            total: products.length + accessories.length
        });
    } catch (error: any) {
        console.error('Search error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
