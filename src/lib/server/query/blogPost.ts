import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { blogPosts, type BlogPostInsert } from "../db/schema";

export async function getAllBlogPostsForHomePage() {
    return db.query.blogPosts.findMany({
        orderBy: desc(blogPosts.createdAt),
        limit: 3
    });
}

export async function getAllBlogPostsForAdminPage() {
	return await db.query.blogPosts.findMany({
		with: {
			author: {
				columns: {
					id: true,
					username: true
				}
			}
		},
		orderBy: [desc(blogPosts.createdAt)]
	});
}

export async function createBlogPost(data: BlogPostInsert) {
	const [newPost] = await db
		.insert(blogPosts)
		.values(data)
		.returning();

	return newPost;
}
export async function updateBlogPost(id: number, data: Partial<BlogPostInsert>) {
	const [updatedPost] = await db
		.update(blogPosts)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(blogPosts.id, id))
		.returning();

	return updatedPost;
}

export async function getBlogPostById(id: number) {
	const post = await db.query.blogPosts.findFirst({
		where: eq(blogPosts.id, id),
		with: {
			author: {
				columns: {
					id: true,
					username: true
				}
			}
		}
	});

	if (!post) throw Error(`Blog post with slug "${id}" not found`);

	return post;
}

export async function publishBlogPost(id: number) {
	const [publishedPost] = await db
		.update(blogPosts)
		.set({ 
			published: true, 
			publishedAt: new Date(),
			updatedAt: new Date()
		})
		.where(eq(blogPosts.id, id))
		.returning();

	return publishedPost;
}

export async function unpublishBlogPost(id: number) {
	const [unpublishedPost] = await db
		.update(blogPosts)
		.set({ 
			published: false, 
			publishedAt: null,
			updatedAt: new Date()
		})
		.where(eq(blogPosts.id, id))
		.returning();

	return unpublishedPost;
}
