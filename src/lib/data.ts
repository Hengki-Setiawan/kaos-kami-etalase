import { turso } from './turso';

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

export async function getProductsBySeries(seriesSlug: string): Promise<Product[]> {
    try {
        const result = await turso.execute({
            sql: 'SELECT * FROM products WHERE series = ? ORDER BY created_at DESC',
            args: [seriesSlug]
        });

        // Fetch images
        const imagesResult = await turso.execute('SELECT * FROM product_images ORDER BY display_order');
        const images = imagesResult.rows;

        return result.rows.map(row => {
            // Parse purchase_links
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
                image_url: row.image_url as string,
                images: images.filter(img => img.product_id === row.id).map(img => img.image_url as string),
                model: row.model as string,
                material: row.material as string,
                sizes: row.sizes as string,
                stock: Number(row.stock) || 0,
                purchase_links: purchaseLinks
            };
        });
    } catch (error) {
        console.error(`Error fetching products for series ${seriesSlug}:`, error);
        return [];
    }
}

export async function getAllProducts(): Promise<Product[]> {
    try {
        const result = await turso.execute('SELECT * FROM products ORDER BY created_at DESC');

        // Fetch images
        const imagesResult = await turso.execute('SELECT * FROM product_images ORDER BY display_order');
        const images = imagesResult.rows;

        return result.rows.map(row => {
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
                image_url: row.image_url as string,
                images: images.filter(img => img.product_id === row.id).map(img => img.image_url as string),
                model: row.model as string,
                material: row.material as string,
                sizes: row.sizes as string,
                stock: Number(row.stock) || 0,
                purchase_links: purchaseLinks
            };
        });
    } catch (error) {
        console.error('Error fetching all products:', error);
        return [];
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const result = await turso.execute({
            sql: 'SELECT * FROM products WHERE id = ?',
            args: [id]
        });

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];

        // Fetch images for this product
        const imagesResult = await turso.execute({
            sql: 'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
            args: [id]
        });

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
            image_url: row.image_url as string,
            images: imagesResult.rows.map(img => img.image_url as string),
            model: row.model as string,
            material: row.material as string,
            sizes: row.sizes as string,
            stock: Number(row.stock) || 0,
            purchase_links: purchaseLinks
        };
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}
