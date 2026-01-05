import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST() {
  try {
    // Create series table first
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS series (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        theme_color TEXT DEFAULT '#0a0a0a',
        accent_color TEXT DEFAULT '#8b5cf6',
        tagline TEXT,
        shopee_link TEXT,
        tiktok_link TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table with extra fields
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT NOT NULL DEFAULT 'dellerium',
        description TEXT,
        image_url TEXT,
        lore TEXT,
        price INTEGER DEFAULT 0,
        edition_total INTEGER DEFAULT 50,
        edition_sold INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create auth_codes table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS auth_codes (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        nfc_uid TEXT,
        product_id TEXT,
        owner_id TEXT,
        status TEXT DEFAULT 'active',
        scan_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Create profiles table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE,
        username TEXT UNIQUE,
        email TEXT,
        birthday TEXT,
        avatar_url TEXT,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create badges table
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

    // Create user_badges junction table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        badge_id TEXT,
        earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (badge_id) REFERENCES badges(id)
      )
    `);

    // Create wallpapers table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS wallpapers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT DEFAULT 'dellerium',
        image_url TEXT NOT NULL,
        unlock_requirement TEXT DEFAULT 'own_1',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create drops table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS drops (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT DEFAULT 'dellerium',
        description TEXT,
        release_date TEXT NOT NULL,
        preview_image TEXT,
        shopee_link TEXT,
        tiktok_link TEXT,
        notified INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create outfits table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS outfits (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        product_id TEXT,
        image_url TEXT NOT NULL,
        caption TEXT,
        likes INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Create lore_chapters table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS lore_chapters (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        series TEXT DEFAULT 'dellerium',
        content TEXT NOT NULL,
        chapter_number INTEGER,
        unlock_requirement TEXT DEFAULT 'own_1',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create ownership_transfers table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS ownership_transfers (
        id TEXT PRIMARY KEY,
        code_id TEXT,
        from_user TEXT,
        to_user TEXT,
        transferred_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (code_id) REFERENCES auth_codes(id)
      )
    `);

    // Insert default series if empty
    const existingSeries = await turso.execute('SELECT COUNT(*) as count FROM series');
    if (Number(existingSeries.rows[0]?.count ?? 0) === 0) {
      const seriesData = [
        { name: 'Dellerium & Nightmare', slug: 'dellerium', description: 'Masuki dunia surreal dimana mimpi dan realitas bercampur', theme_color: '#0a0a0a', accent_color: '#8b5cf6', tagline: 'Born from Darkness' },
        { name: 'Anime Music Album', slug: 'anime_music', description: 'Koleksi terinspirasi dari estetika musik anime Jepang', theme_color: '#fdf2f8', accent_color: '#ec4899', tagline: 'Sound of Japan' },
      ];

      for (const s of seriesData) {
        await turso.execute({
          sql: `INSERT INTO series (id, name, slug, description, theme_color, accent_color, tagline, shopee_link, tiktok_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [crypto.randomUUID(), s.name, s.slug, s.description, s.theme_color, s.accent_color, s.tagline, 'https://shopee.co.id/kaoskami', 'https://www.tiktok.com/@kaoskami/shop']
        });
      }
    }

    // Insert sample products if empty
    const existingProducts = await turso.execute('SELECT COUNT(*) as count FROM products');
    if (Number(existingProducts.rows[0]?.count ?? 0) === 0) {
      const products = [
        { name: 'Nightmare Vision', series: 'dellerium', description: 'Dark surrealist artwork', edition_total: 50 },
        { name: 'Delirium State', series: 'dellerium', description: 'Premium hoodie psychedelic', edition_total: 50 },
        { name: 'Shadow Realm', series: 'dellerium', description: 'Eksplorasi dunia bayangan', edition_total: 30 },
        { name: 'Void Walker', series: 'dellerium', description: 'Perjalanan melalui kekosongan', edition_total: 50 },
        { name: 'Lofi Nights', series: 'anime_music', description: 'Aesthetic lofi vibes', edition_total: 100 },
        { name: 'Vaporwave Dreams', series: 'anime_music', description: 'Retro-futuristic design', edition_total: 75 },
        { name: 'City Pop Classic', series: 'anime_music', description: 'Nostalgia musik anime 80s', edition_total: 80 },
        { name: 'Synthwave Sunset', series: 'anime_music', description: 'Neon sunset aesthetics', edition_total: 60 },
      ];

      for (const p of products) {
        await turso.execute({
          sql: `INSERT INTO products (id, name, series, description, edition_total) VALUES (?, ?, ?, ?, ?)`,
          args: [crypto.randomUUID(), p.name, p.series, p.description, p.edition_total]
        });
      }
    }

    // Insert sample badges if empty
    const existingBadges = await turso.execute('SELECT COUNT(*) as count FROM badges');
    if (existingBadges.rows[0]?.count === 0) {
      const badges = [
        { name: 'First Scan', description: 'Verified your first Kaos Kami product', icon: '🎯' },
        { name: 'Collector', description: 'Own 3+ authentic products', icon: '⭐' },
        { name: 'True Fan', description: 'Own products from both series', icon: '💎' },
        { name: 'Early Adopter', description: 'Joined during launch period', icon: '🚀' },
        { name: 'Social Butterfly', description: 'Shared outfit to community', icon: '🦋' },
      ];

      for (const b of badges) {
        await turso.execute({
          sql: `INSERT INTO badges (id, name, description, icon) VALUES (?, ?, ?, ?)`,
          args: [crypto.randomUUID(), b.name, b.description, b.icon]
        });
      }
    }

    // Insert sample wallpapers if empty
    const existingWalls = await turso.execute('SELECT COUNT(*) as count FROM wallpapers');
    if (existingWalls.rows[0]?.count === 0) {
      const wallpapers = [
        { name: 'Nightmare Cityscape', series: 'dellerium', unlock_requirement: 'own_1' },
        { name: 'Dark Matter', series: 'dellerium', unlock_requirement: 'own_2' },
        { name: 'Void Portal', series: 'dellerium', unlock_requirement: 'own_3' },
        { name: 'Lofi Room', series: 'anime_music', unlock_requirement: 'own_1' },
        { name: 'Sunset Highway', series: 'anime_music', unlock_requirement: 'own_2' },
        { name: 'Neo Tokyo', series: 'anime_music', unlock_requirement: 'own_3' },
      ];

      for (const w of wallpapers) {
        await turso.execute({
          sql: `INSERT INTO wallpapers (id, name, series, image_url, unlock_requirement) VALUES (?, ?, ?, ?, ?)`,
          args: [crypto.randomUUID(), w.name, w.series, `/wallpapers/${w.name.toLowerCase().replace(' ', '-')}.jpg`, w.unlock_requirement]
        });
      }
    }

    // Insert sample drops if empty
    const existingDrops = await turso.execute('SELECT COUNT(*) as count FROM drops');
    if (existingDrops.rows[0]?.count === 0) {
      const drops = [
        { name: 'Astral Projection', series: 'dellerium', description: 'Perjalanan ke dimensi astral', release_date: '2025-01-15T20:00:00+07:00' },
        { name: 'Synthwave Sunset', series: 'anime_music', description: 'Sunset di kota masa depan', release_date: '2025-01-30T20:00:00+07:00' },
      ];

      for (const d of drops) {
        await turso.execute({
          sql: `INSERT INTO drops (id, name, series, description, release_date, shopee_link, tiktok_link) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [crypto.randomUUID(), d.name, d.series, d.description, d.release_date, 'https://shopee.co.id/kaoskami', 'https://www.tiktok.com/@kaoskami/shop']
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized with all tables and sample data'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Failed to initialize database', details: String(error) }, { status: 500 });
  }
}
