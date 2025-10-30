import { getBookWithContent } from "$lib/server/query/book";

export async function load() {
    const book = await getBookWithContent(1)
    return {
        book
    }
}