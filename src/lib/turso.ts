import { createClient } from '@libsql/client';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

export const turso = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

// Helper types
export interface Product {
  id: string;
  name: string;
  series: 'dellerium' | 'anime_music';
  description: string;
  image_url: string;
  lore: string;
  created_at: string;
}

export interface AuthCode {
  id: string;
  code: string;
  nfc_uid: string | null;
  product_id: string;
  status: 'active' | 'claimed' | 'flagged';
  scan_count: number;
  created_at: string;
}

export interface Collector {
  id: string;
  username: string;
  email: string;
  birthday: string | null;
  created_at: string;
}
