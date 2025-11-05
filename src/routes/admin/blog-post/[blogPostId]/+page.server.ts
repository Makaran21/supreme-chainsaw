import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getBlogPostById, updateBlogPost, publishBlogPost, unpublishBlogPost } from '$lib/server/query/blogPost';


export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw redirect(302, '/');
    }

    if (!params.blogPostId) {
        throw redirect(302, '/blog-post');
    }

    const post = await getBlogPostById(Number(params.blogPostId));

    return { post };
};

export const actions: Actions = {
    updatePost: async ({ request, locals, params }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        if (!params.blogPostId) {
            throw redirect(302, '/blog-post');
        }

        const formData = await request.formData();

        try {
            const title = formData.get('title') as string;
            const category = formData.get('category') as string;
            const coverImage = (formData.get('coverImage') as string) || null;
            const excerpt = (formData.get('excerpt') as string) || null;
            const content = JSON.parse(formData.get('content') as string);
            const tags = JSON.parse(formData.get('tags') as string || '[]');
            const readTime = Number(formData.get('readTime')) || 5;
            const authorName = (formData.get('authorName') as string) || null;
            const useFakeData = formData.get('useFakeData') === 'true';
            const fakeViewers = Number(formData.get('fakeViewers')) || null;
            const fakePurchases = Number(formData.get('fakePurchases')) || null;

            await updateBlogPost(Number(params.blogPostId), {
                title,
                category,
                coverImage,
                excerpt,
                content,
                tags: tags.length > 0 ? tags : null,
                readTime,
                authorName,
                useFakeData,
                fakeViewers,
                fakePurchases
            });

            return { success: true, message: 'Blog post updated successfully' };
        } catch (error) {
            console.error('Update blog post error:', error);
            return fail(500, { message: 'Failed to update blog post' });
        }
    },

    publishPost: async ({ locals, params }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

           if (!params.blogPostId) {
            throw redirect(302, '/blog-post');
        }

        try {
            await publishBlogPost(Number(params.blogPostId));
            return { success: true, message: 'Blog post published successfully' };
        } catch (error) {
            console.error('Publish blog post error:', error);
            return fail(500, { message: 'Failed to publish blog post' });
        }
    },

    unpublishPost: async ({ locals, params }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

           if (!params.blogPostId) {
            throw redirect(302, '/blog-post');
        }

        try {
            await unpublishBlogPost(Number(params.blogPostId));
            return { success: true, message: 'Blog post unpublished successfully' };
        } catch (error) {
            console.error('Unpublish blog post error:', error);
            return fail(500, { message: 'Failed to unpublish blog post' });
        }
    }
};