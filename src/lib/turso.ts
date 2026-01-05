import { createClient, Client, InStatement, ResultSet, InArgs } from '@libsql/client';

let tursoClient: Client | null = null;

function getTursoClient(): Client {
  if (tursoClient) {
    return tursoClient;
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl) {
    throw new Error('TURSO_DATABASE_URL is not defined. Please set it in your environment variables.');
  }

  tursoClient = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });

  return tursoClient;
}

// Export a proxy object that lazily creates the client with proper typing
export const turso = {
  execute: (stmt: InStatement): Promise<ResultSet> => getTursoClient().execute(stmt),
  batch: (stmts: InStatement[], mode?: "write" | "read" | "deferred"): Promise<ResultSet[]> =>
    getTursoClient().batch(stmts, mode),
};

// Helper types
export interface Product {
  id: string;
  name: string;
  series: string;
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
