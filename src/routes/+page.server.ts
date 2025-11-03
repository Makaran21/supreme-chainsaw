import { getAllBlogPostsForHomePage } from '$lib/server/query/blogPost';
import { getAllBooksForHomePage } from '$lib/server/query/book';
import type { PageServerLoad } from './$types';

export type BooksForHomePage = Awaited<ReturnType<typeof getAllBooksForHomePage>>;

export const load: PageServerLoad = async () => {
  const [allBooks, blogPosts] = await Promise.all([
    getAllBooksForHomePage(),
    getAllBlogPostsForHomePage()
  ]);
  return {
    allBooks,
    blogPosts
  };
};