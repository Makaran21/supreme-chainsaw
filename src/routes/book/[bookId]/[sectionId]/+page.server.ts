// src/routes/book/[bookId]/[sectionId]/+page.server.ts
import { db } from '$lib/server/db';
import { sections } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';


export const load = async ({ params }) => {
	const sectionId = Number(params.sectionId);

	const section = await db
		.select()
		.from(sections)
		.where(eq(sections.id, sectionId))
		.get(); // or .then(rows => rows[0]) depending on your Drizzle client

	if (!section) {
		return {
			status: 404,
			error: new Error('Section not found')
		};
	}

	return { section, markdownContent: '' };
};
