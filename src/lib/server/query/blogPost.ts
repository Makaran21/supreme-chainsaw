import { desc } from "drizzle-orm";
import { db } from "../db";
import { blogPosts } from "../db/schema";

export function getAllBlogPostsForHomePage() {
    return db.query.blogPosts.findMany({
        orderBy: desc(blogPosts.createdAt),
        limit: 3
    });
}