import { getBookWithContent } from "$lib/server/query/book";

export async function load({ params }) {
    if (!params.bookId) throw Error("Book id not found")
    const book = await getBookWithContent(Number(params.bookId))

    const sectionId = params.sectionId ? parseInt(params.sectionId) : null;

    return {
        book,
        sectionId
    }
}