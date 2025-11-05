import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

let TURSO_DB_URL: string | undefined;
let TURSO_DB_AUTH_TOKEN: string | undefined;
let DATABASE_URL: string | undefined;

try {
    // Try to import SvelteKit env
    const { env } = await import('$env/dynamic/private');
    DATABASE_URL = env.DATABASE_URL;
    TURSO_DB_URL = env.TURSO_DB_URL;
    TURSO_DB_AUTH_TOKEN = env.TURSO_DB_AUTH_TOKEN;
} catch {
    // Fallback to process.env for non-SvelteKit environments
    DATABASE_URL = process.env.DATABASE_URL;
    TURSO_DB_URL = process.env.TURSO_DB_URL;
    TURSO_DB_AUTH_TOKEN = process.env.TURSO_DB_AUTH_TOKEN;
}

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({
    url: TURSO_DB_URL ?? 'file:./local.db',
    authToken: TURSO_DB_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
