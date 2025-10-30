// src/routes/admin/books/+page.server.ts

import { db } from "$lib/server/db";
import { books } from "$lib/server/db/schema";

export async function load() {
  try {
    const bookList = await db.select().from(books).all();
    return { bookList };
  } catch (err) {
    console.error('Failed to load books:', err);
    return { bookList: [] }; // fallback
  }
}
