import { turso } from '../lib/turso';

// Run this to initialize database tables
async function initDatabase() {
  console.log('🚀 Creating database tables...\n');

  // Series table
  console.log('Creating series table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS series (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            theme_color TEXT DEFAULT '#0a0a0a',
            accent_color TEXT DEFAULT '#00d4ff',
            tagline TEXT,
            jp_name TEXT,
            kr_name TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Products table
  console.log('Creating products table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            series TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            lore TEXT,
            price INTEGER DEFAULT 0,
            edition_total INTEGER DEFAULT 50,
            edition_sold INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Codes table (QR codes)
  console.log('Creating codes table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS codes (
            id TEXT PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            product_id TEXT REFERENCES products(id),
            status TEXT DEFAULT 'active',
            scan_count INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Accessories table
  console.log('Creating accessories table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS accessories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'Ganci',
            price INTEGER DEFAULT 0,
            image_url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // User profiles (extends Supabase auth)
  console.log('Creating profiles table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE,
            display_name TEXT,
            avatar_url TEXT,
            birthday TEXT,
            is_admin INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // Badges
  console.log('Creating badges table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS badges (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            requirement TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  // User badges
  console.log('Creating user_badges table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS user_badges (
            user_id TEXT NOT NULL,
            badge_id TEXT NOT NULL,
            earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, badge_id)
        )
    `);

  // Unlocked content
  console.log('Creating unlocks table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS unlocks (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            code_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, code_id)
        )
    `);

  // Wallpapers
  console.log('Creating wallpapers table...');
  await turso.execute(`
        CREATE TABLE IF NOT EXISTS wallpapers (
            id TEXT PRIMARY KEY,
            product_id TEXT REFERENCES products(id),
            title TEXT,
            image_url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

  console.log('\n📦 Inserting sample data...\n');

  // Insert sample series
  console.log('Inserting series...');
  await turso.execute(`
        INSERT OR IGNORE INTO series (id, name, slug, description, accent_color, jp_name, kr_name) VALUES
        ('ser_1', 'Kami Community', 'kami-community', 'Merchandise eksklusif untuk komunitas Kami', '#bbff00', 'コミュニティ', '커뮤니티'),
        ('ser_2', 'Anime Streetwear', 'anime-streetwear', 'Urban streetwear dengan sentuhan anime', '#00d4ff', 'ストリート', '스트릿'),
        ('ser_3', 'Anime × Music', 'anime-music-fusion', 'J-Pop, K-Pop, Lo-Fi vibes', '#ff3366', 'アニメ音楽', '애니메음악')
    `);

  // Insert sample products
  console.log('Inserting products...');
  await turso.execute(`
        INSERT OR IGNORE INTO products (id, name, series, description, price) VALUES
        ('prod_1', 'Community Basic Tee', 'kami-community', 'Kaos basic dengan logo Kami Community', 150000),
        ('prod_2', 'Street Fighter Oversized', 'anime-streetwear', 'Oversized tee dengan desain anime streetwear', 189000),
        ('prod_3', 'Lofi Beats Hoodie', 'anime-music-fusion', 'Hoodie dengan artwork lofi aesthetic', 299000)
    `);

  // Insert sample accessories
  console.log('Inserting accessories...');
  await turso.execute(`
        INSERT OR IGNORE INTO accessories (id, name, description, category, price) VALUES
        ('acc_1', 'Kamito Keychain', 'Gantungan kunci karakter Kamito', 'Ganci', 35000),
        ('acc_2', 'Kami Logo Pin', 'Pin metal dengan logo Kaos Kami', 'Pin', 25000),
        ('acc_3', 'Sticker Pack Vol.1', 'Pack berisi 5 sticker vinyl', 'Sticker', 20000)
    `);

  // Insert badges
  console.log('Inserting badges...');
  await turso.execute(`
        INSERT OR IGNORE INTO badges (id, name, description, icon, requirement) VALUES
        ('badge_1', 'First Scan', 'Selamat datang di keluarga Kaos Kami!', 'star', 'scan_first'),
        ('badge_2', 'Collector', 'Memiliki 3 atau lebih kaos', 'award', 'owns_3'),
        ('badge_3', 'True Fan', 'Memiliki 5 atau lebih kaos', 'trophy', 'owns_5')
    `);

  console.log('\n✅ Database initialized successfully!');
  console.log('Tables created: series, products, codes, accessories, profiles, badges, user_badges, unlocks, wallpapers');
}

initDatabase().catch(console.error);
