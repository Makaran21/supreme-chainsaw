export async function load(payload) {
    const { params } = payload

    return {
        bookId: params.bookId,
        blogPostId: params.blogPostId,
    }
}