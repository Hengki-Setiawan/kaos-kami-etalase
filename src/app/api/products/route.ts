import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { checkAuth } from '@/lib/auth';
import { invalidateCache } from '@/lib/cache';

// GET all products or by series
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const series = searchParams.get('series');

        let result;
        if (series) {
            result = await turso.execute({
                sql: 'SELECT * FROM products WHERE series = ? ORDER BY created_at DESC',
                args: [series]
            });
        } else {
            result = await turso.execute('SELECT * FROM products ORDER BY created_at DESC');
        }

        const products = result.rows;

        // Fetch images for all products
        const imagesResult = await turso.execute('SELECT * FROM product_images ORDER BY display_order');
        const images = imagesResult.rows;

        // Attach images to products and parse purchase_links
        const productsWithImages = products.map(p => {
            let purchaseLinks = [];
            try {
                if (p.purchase_links && typeof p.purchase_links === 'string') {
                    purchaseLinks = JSON.parse(p.purchase_links as string);
                }
            } catch (e) {
                purchaseLinks = [];
            }

            return {
                ...p,
                images: images.filter(img => img.product_id === p.id).map(img => img.image_url),
                purchase_links: purchaseLinks
            };
        });

        return NextResponse.json(productsWithImages);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const {
            name, series, category, description, image_url, lore, price, edition_total,
            images, model, material, sizes, stock, purchase_links
        } = body;

        if (!name || !series) {
            return NextResponse.json({ error: 'Name and series are required' }, { status: 400 });
        }

        const id = crypto.randomUUID();

        // Prepare sizes as comma-separated string
        const sizesStr = Array.isArray(sizes) ? sizes.join(',') : (sizes || '');

        // Prepare purchase_links as JSON string
        const purchaseLinksStr = Array.isArray(purchase_links) ? JSON.stringify(purchase_links) : '[]';

        // Insert product with all new fields
        await turso.execute({
            sql: `INSERT INTO products (id, name, series, category, description, image_url, lore, price, edition_total, model, material, sizes, stock, purchase_links, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            args: [
                id,
                name,
                series,
                category || 'T-Shirt',
                description || '',
                image_url || '',
                lore || '',
                price || 0,
                edition_total || 50,
                model || '',
                material || '',
                sizesStr,
                stock || 0,
                purchaseLinksStr
            ]
        });

        // Insert additional images if provided
        if (Array.isArray(images) && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const imgId = crypto.randomUUID();
                await turso.execute({
                    sql: `INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)`,
                    args: [imgId, id, images[i], i]
                });
            }
        }

        // Invalidate product caches
        await invalidateCache('products:all', `products:id:${id}`);

        return NextResponse.json({ id, message: 'Product created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: `Failed to create product: ${error?.message || 'Unknown error'}` }, { status: 500 });
    }
}

// PUT update product
export async function PUT(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const body = await request.json();
        const {
            id, name, series, category, description, image_url, lore, price, edition_total,
            images, model, material, sizes, stock, purchase_links
        } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Prepare sizes as comma-separated string
        const sizesStr = Array.isArray(sizes) ? sizes.join(',') : (sizes || '');

        // Prepare purchase_links as JSON string
        const purchaseLinksStr = Array.isArray(purchase_links) ? JSON.stringify(purchase_links) : '[]';

        // Ensure all values have defaults to prevent null errors
        const updateArgs = [
            name || '',
            series || '',
            category || 'T-Shirt',
            description || '',
            image_url || '',
            lore || '',
            price || 0,
            edition_total || 50,
            model || '',
            material || '',
            sizesStr,
            stock || 0,
            purchaseLinksStr,
            id
        ];

        console.log('Updating product with args:', updateArgs);

        // Update product details
        await turso.execute({
            sql: `UPDATE products SET 
                name = ?, series = ?, category = ?, description = ?, image_url = ?, lore = ?, price = ?, edition_total = ?,
                model = ?, material = ?, sizes = ?, stock = ?, purchase_links = ?
                WHERE id = ?`,
            args: updateArgs
        });

        // Update images: Delete old ones and insert new ones (simple approach)
        if (Array.isArray(images)) {
            await turso.execute({
                sql: 'DELETE FROM product_images WHERE product_id = ?',
                args: [id]
            });

            for (let i = 0; i < images.length; i++) {
                const imgId = crypto.randomUUID();
                await turso.execute({
                    sql: `INSERT INTO product_images (id, product_id, image_url, display_order) VALUES (?, ?, ?, ?)`,
                    args: [imgId, id, images[i], i]
                });
            }
        }

        // Invalidate product caches
        await invalidateCache('products:all', `products:id:${id}`);

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error: any) {
        console.error('Error updating product:', error);
        console.error('Error message:', error?.message);
        return NextResponse.json({ error: `Failed to update product: ${error?.message || 'Unknown error'}` }, { status: 500 });
    }
}

// DELETE product
export async function DELETE(request: NextRequest) {
    const authResult = await checkAuth();
    if (authResult instanceof NextResponse) return authResult;
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await turso.execute({
            sql: 'DELETE FROM products WHERE id = ?',
            args: [id]
        });

        // Invalidate product caches
        await invalidateCache('products:all', `products:id:${id}`);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
