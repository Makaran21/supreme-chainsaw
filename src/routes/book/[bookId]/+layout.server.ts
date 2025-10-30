// /routes/book/[bookId]/+layout.server.ts
import { db } from '$lib/server/db';
import { books, chapters } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load: LayoutServerLoad = async ({ params, url }) => {
  const bookId = parseInt(params.bookId);

  const book = await db.query.books.findFirst({
    where: eq(books.id, bookId)
  });

  if (!book) {
    throw error(404, 'Book not found');
  }

  // Fetch all chapters with their sections
  const allChapters = await db.query.chapters.findMany({
    where: eq(chapters.bookId, bookId),
    orderBy: (chapters, { asc }) => [asc(chapters.orderIndex)],
    with: {
      sections: {
        orderBy: (sections, { asc }) => [asc(sections.orderIndex)]
      }
    }
  });

  const sectionId = params.sectionId ? parseInt(params.sectionId) : null;

  return {
    book,
    chapters: allChapters,
    currentSectionId: sectionId
  };
};