import { db } from '$lib/server/db';
import { books } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allBooks = await db.select().from(books).all();
  
  return {
    books: allBooks
  };
};