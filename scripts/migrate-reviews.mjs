import { createClient } from '@libsql/client';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
    throw new Error('TURSO_DATABASE_URL is not defined in environment variables.');
}

const client = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
});

async function main() {
    console.log('Creating reviews table...');
    try {
        await client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Reviews table created successfully!');
    } catch (error) {
        console.error('Failed to create table:', error);
    }
}

main().catch(console.error);
