import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createBlogPost, getAllBlogPostsForAdminPage } from '$lib/server/query/blogPost';

export type BlogPostsForAdminPage = Awaited<ReturnType<typeof getAllBlogPostsForAdminPage>>;

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
	const blogPosts = await getAllBlogPostsForAdminPage();
	return { blogPosts };
};

export const actions: Actions = {
	createBlogPost: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		
		try {
			const title = formData.get('title') as string;
			const category = formData.get('category') as string;
			const coverImage = (formData.get('coverImage') as string) || null;
			const tags = JSON.parse(formData.get('tags') as string || '[]');
			
			// Generate slug from title
			const slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');
			
			// Default TipTap content structure
			const defaultContent = {
				type: 'doc',
				content: [
					{
						type: 'heading',
						attrs: { level: 1 },
						content: [{ type: 'text', text: title }]
					},
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'Start writing your blog post here...' }]
					}
				]
			};

			await createBlogPost({
				authorId: locals.user.id,
				title: title,
				category: category,
				readTime: 5, // Default 5 min, can be updated later
				slug: slug,
				content: defaultContent,
				excerpt: null,
				coverImage: coverImage,
				published: false,
				publishedAt: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				tags: tags.length > 0 ? tags : null
			});
			
			return { success: true, message: 'Blog post created successfully' };
		} catch (error) {
			console.error('Create blog post error:', error);
			return fail(500, { message: 'Failed to create blog post' });
		}
	}
};