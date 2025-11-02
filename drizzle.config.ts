import { defineConfig } from 'drizzle-kit';

// if (!process.env.TURSO_DB_URL) throw new Error('TURSO_DB_URL is not set');

// export default defineConfig({
// 	schema: './src/lib/server/db/schema.ts',
// 	dialect: 'turso',
// 	dbCredentials: {
// 		url: process.env.TURSO_DB_URL ?? 'file:./local.db',
// 		authToken: process.env.TURSO_DB_AUTH_TOKEN, // Add this for Turso
// 	},
// 	verbose: true,
// 	strict: true
// });

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true
});
