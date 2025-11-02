import type { Content } from '@tiptap/core';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	age: integer('age')
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const books = sqliteTable('books', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	coverImage: text('cover_image'),
	price: integer('price'), // price in cents, null for free books
	isFree: integer('is_free', { mode: 'boolean' }).notNull().default(false)
});

export const chapters = sqliteTable('chapters', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	bookId: integer('book_id').notNull().references(() => books.id),
	title: text('title').notNull(),
	orderIndex: integer('order_index').notNull(),
	nextChapterId: integer('next_chapter_id'),
	tags: text('tags', { mode: 'json' }).$type<string[]>()
});

export enum BlockType {
	MARKDOWN = 'markdown',
	HEADING = 'heading',
	IMAGE = 'image',
	VIDEO = 'video',
	SECTION_TITLE = 'section-title',
	SECOND_TITLE = 'second-title'
}

export interface Block {
	type: BlockType;
	name: string;
	value: string;
	order: number;
	additionalData?: Record<string, string>;
}

export const sections = sqliteTable('sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	chapterId: integer('chapter_id').notNull().references(() => chapters.id),
	title: text('title').notNull(),
	content: text('content', { mode: 'json' }).$type<Content>().notNull(),
	orderIndex: integer('order_index').notNull(),
	nextSectionId: integer('next_section_id'),
	blocks: text('blocks', { mode: 'json' }).$type<Block[]>(),
	tags: text('tags', { mode: 'json' }).$type<string[]>()
});

// User book purchases
export const userBookPurchases = sqliteTable('user_book_purchases', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull().references(() => user.id),
	bookId: integer('book_id').notNull().references(() => books.id),
	purchasedAt: integer('purchased_at', { mode: 'timestamp' }).notNull(),
	price: integer('price').notNull() // price paid at time of purchase
});

// User reading progression
export const userReadingProgress = sqliteTable('user_reading_progress', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull().references(() => user.id),
	bookId: integer('book_id').notNull().references(() => books.id),
	chapterId: integer('chapter_id').references(() => chapters.id),
	sectionId: integer('section_id').references(() => sections.id),
	progressPercentage: integer('progress_percentage').notNull().default(0), // 0-100
	lastReadAt: integer('last_read_at', { mode: 'timestamp' }).notNull(),
	completedAt: integer('completed_at', { mode: 'timestamp' }), // null if not completed
	bookmarked: integer('bookmarked', { mode: 'boolean' }).notNull().default(false)
});

// Blog posts
export const blogPosts = sqliteTable('blog_posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	authorId: text('author_id').notNull().references(() => user.id),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content', { mode: 'json' }).$type<Content>().notNull(),
	excerpt: text('excerpt'),
	coverImage: text('cover_image'),
	published: integer('published', { mode: 'boolean' }).notNull().default(false),
	publishedAt: integer('published_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	tags: text('tags', { mode: 'json' }).$type<string[]>()
});

// Comment sections (can be associated with blog posts, books, chapters, etc.)
export const commentSections = sqliteTable('comment_sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	blogPostId: integer('blog_post_id').references(() => blogPosts.id),
	bookId: integer('book_id').references(() => books.id),
	chapterId: integer('chapter_id').references(() => chapters.id),
	enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Comments
export const comments = sqliteTable('comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	commentSectionId: integer('comment_section_id').notNull().references(() => commentSections.id),
	userId: text('user_id').notNull().references(() => user.id),
	parentCommentId: integer('parent_comment_id'), // for nested replies
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
	deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false)
});

// Reader activity log - tracks detailed reading behavior and time spent
export const readerActivityLog = sqliteTable('reader_activity_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull().references(() => user.id),
	sectionId: integer('section_id').references(() => sections.id),
	blogPostId: integer('blog_post_id').references(() => blogPosts.id),
	sessionId: text('session_id').notNull(), // groups activities in same reading session
	startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
	endedAt: integer('ended_at', { mode: 'timestamp' }), // null if session still active
	timeSpentSeconds: integer('time_spent_seconds').notNull().default(0), // actual reading time
	scrollDepthPercentage: integer('scroll_depth_percentage'), // how far they scrolled (0-100)
	wordsRead: integer('words_read'), // estimated words read based on scroll position
	completedReading: integer('completed_reading', { mode: 'boolean' }).notNull().default(false),
	interactionCount: integer('interaction_count').notNull().default(0), // clicks, highlights, etc.
	deviceType: text('device_type'), // 'mobile', 'tablet', 'desktop'
	referrerSource: text('referrer_source'), // where they came from
	exitedEarly: integer('exited_early', { mode: 'boolean' }).notNull().default(false), // left before finishing
	returnVisit: integer('return_visit', { mode: 'boolean' }).notNull().default(false), // came back to same content
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	purchases: many(userBookPurchases),
	readingProgress: many(userReadingProgress),
	blogPosts: many(blogPosts),
	comments: many(comments),
	activityLogs: many(readerActivityLog)
}));

export const booksRelations = relations(books, ({ many }) => ({
	chapters: many(chapters),
	purchases: many(userBookPurchases),
	readingProgress: many(userReadingProgress),
	commentSections: many(commentSections)
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
	book: one(books, {
		fields: [chapters.bookId],
		references: [books.id]
	}),
	sections: many(sections),
	readingProgress: many(userReadingProgress),
	commentSections: many(commentSections)
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	chapter: one(chapters, {
		fields: [sections.chapterId],
		references: [chapters.id]
	}),
	readingProgress: many(userReadingProgress),
	activityLogs: many(readerActivityLog)
}));

export const userBookPurchasesRelations = relations(userBookPurchases, ({ one }) => ({
	user: one(user, {
		fields: [userBookPurchases.userId],
		references: [user.id]
	}),
	book: one(books, {
		fields: [userBookPurchases.bookId],
		references: [books.id]
	})
}));

export const userReadingProgressRelations = relations(userReadingProgress, ({ one }) => ({
	user: one(user, {
		fields: [userReadingProgress.userId],
		references: [user.id]
	}),
	book: one(books, {
		fields: [userReadingProgress.bookId],
		references: [books.id]
	}),
	chapter: one(chapters, {
		fields: [userReadingProgress.chapterId],
		references: [chapters.id]
	}),
	section: one(sections, {
		fields: [userReadingProgress.sectionId],
		references: [sections.id]
	})
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
	author: one(user, {
		fields: [blogPosts.authorId],
		references: [user.id]
	}),
	commentSections: many(commentSections),
	activityLogs: many(readerActivityLog)
}));

export const commentSectionsRelations = relations(commentSections, ({ one, many }) => ({
	blogPost: one(blogPosts, {
		fields: [commentSections.blogPostId],
		references: [blogPosts.id]
	}),
	book: one(books, {
		fields: [commentSections.bookId],
		references: [books.id]
	}),
	chapter: one(chapters, {
		fields: [commentSections.chapterId],
		references: [chapters.id]
	}),
	comments: many(comments)
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
	commentSection: one(commentSections, {
		fields: [comments.commentSectionId],
		references: [commentSections.id]
	}),
	user: one(user, {
		fields: [comments.userId],
		references: [user.id]
	}),
	parentComment: one(comments, {
		fields: [comments.parentCommentId],
		references: [comments.id]
	}),
	replies: many(comments)
}));

// Type exports
export type Book = typeof books.$inferInsert;
export type Chapter = typeof chapters.$inferInsert;
export type Section = typeof sections.$inferInsert;
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type UserBookPurchase = typeof userBookPurchases.$inferInsert;
export type UserReadingProgress = typeof userReadingProgress.$inferInsert;
export type BlogPost = typeof blogPosts.$inferInsert;
export type CommentSection = typeof commentSections.$inferInsert;
export type Comment = typeof comments.$inferInsert;
export type ReaderActivityLog = typeof readerActivityLog.$inferInsert;