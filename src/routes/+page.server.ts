import { getAllBooks } from '$lib/server/query/book';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allBooks = await getAllBooks();
  return {
    allBooks
  };
};