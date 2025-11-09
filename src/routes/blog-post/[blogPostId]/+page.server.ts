import { getBlogPostById } from '$lib/server/query/blogPost';

export async function load({ params }) {
	const blogPost = await getBlogPostById(Number(params.blogPostId));
	if (!blogPost) throw Error(`Blog post [ID: ${params.blogPostId}] Not found`);
	return {
		blogPost
	};
}
