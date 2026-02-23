import { turso } from './turso';
import { getCached } from './cache';
import { optimizeCloudinaryUrl } from './cloudinary';

export interface Product {
    id: string;
    name: string;
    series: string;
    category: string;
    description: string;
    lore?: string;
    price: number;
    image_url?: string;
    images?: string[];
    model?: string;
    material?: string;
    sizes?: string;
    stock?: number;
    purchase_links?: { platform: string; url: string }[];
}

function parseProductRow(row: any, productImages: any[]): Product {
    let purchaseLinks: { platform: string; url: string }[] = [];
    try {
        if (row.purchase_links && typeof row.purchase_links === 'string') {
            purchaseLinks = JSON.parse(row.purchase_links as string);
        }
    } catch (e) {
        purchaseLinks = [];
    }

    return {
        id: row.id as string,
        name: row.name as string,
        series: row.series as string,
        category: row.category as string || 'T-Shirt',
        description: row.description as string,
        lore: row.lore as string,
        price: Number(row.price),
        image_url: optimizeCloudinaryUrl(row.image_url as string),
        images: productImages
            .filter(img => img.product_id === row.id)
            .map(img => optimizeCloudinaryUrl(img.image_url as string)),
        model: row.model as string,
        material: row.material as string,
        sizes: row.sizes as string,
        stock: Number(row.stock) || 0,
        purchase_links: purchaseLinks
    };
}

export async function getProductsBySeries(seriesSlug: string): Promise<Product[]> {
    return getCached(`products:series:${seriesSlug}`, async () => {
        try {
            // Turso Batch Query — 2 queries in 1 round trip
            const results = await turso.batch([
                {
                    sql: 'SELECT id, name, series, category, description, lore, price, image_url, model, material, sizes, stock, purchase_links FROM products WHERE series = ? ORDER BY created_at DESC',
                    args: [seriesSlug]
                },
                'SELECT product_id, image_url FROM product_images ORDER BY display_order'
            ]);

            const productRows = results[0].rows;
            const images = results[1].rows;

            return productRows.map(row => parseProductRow(row, images));
        } catch (error) {
            console.error(`Error fetching products for series ${seriesSlug}:`, error);
            return [];
        }
    }, 300); // Cache 5 minutes
}

export async function getAllProducts(): Promise<Product[]> {
    return getCached('products:all', async () => {
        try {
            // Turso Batch Query — 2 queries in 1 round trip
            const results = await turso.batch([
                'SELECT id, name, series, category, description, lore, price, image_url, model, material, sizes, stock, purchase_links FROM products ORDER BY created_at DESC',
                'SELECT product_id, image_url FROM product_images ORDER BY display_order'
            ]);

            const productRows = results[0].rows;
            const images = results[1].rows;

            return productRows.map(row => parseProductRow(row, images));
        } catch (error) {
            console.error('Error fetching all products:', error);
            return [];
        }
    }, 300); // Cache 5 minutes
}

export async function getProductById(id: string): Promise<Product | null> {
    return getCached(`products:id:${id}`, async () => {
        try {
            // Turso Batch Query — 2 queries in 1 round trip
            const results = await turso.batch([
                {
                    sql: 'SELECT id, name, series, category, description, lore, price, image_url, model, material, sizes, stock, purchase_links FROM products WHERE id = ?',
                    args: [id]
                },
                {
                    sql: 'SELECT product_id, image_url FROM product_images WHERE product_id = ? ORDER BY display_order',
                    args: [id]
                }
            ]);

            if (results[0].rows.length === 0) {
                return null;
            }

            const row = results[0].rows[0];
            const images = results[1].rows;

            return parseProductRow(row, images);
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }
    }, 300); // Cache 5 minutes
}
