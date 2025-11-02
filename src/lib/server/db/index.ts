import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({
    url: env.TURSO_DB_URL ?? 'file:./local.db',
    authToken: env.TURSO_DB_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// const client = createClient({
//     url: process.env.TURSO_DB_URL ?? 'file:./local.db',
//     authToken: process.env.TURSO_DB_AUTH_TOKEN,
// });

// export const db = drizzle(client, { schema });
