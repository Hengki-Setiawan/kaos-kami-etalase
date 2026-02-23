import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@libsql/client';

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your .env.local file.");
    process.exit(1);
}

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
    console.log("Starting database migration for Advanced Features...");

    try {
        console.log("Creating wishlists table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS wishlists (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            );
        `);
        console.log("wishlists table created or already exists.");

        console.log("Creating product_clicks table...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS product_clicks (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("product_clicks table created or already exists.");

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
