// /routes/book/[bookId]/+layout.server.ts
import { getBookWithContent, type BookWithContent } from '$lib/server/query/book';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load: LayoutServerLoad = async ({ params, url }) => {
  const bookId = parseInt(params.bookId);

  const book: BookWithContent | null = await getBookWithContent(bookId);

  if (!book) {
    throw error(404, 'Book not found');
  }

  const sectionId = params.sectionId ? parseInt(params.sectionId) : null;

  return {
    book,
    currentSectionId: sectionId
  };
};