import type { Content } from '@tiptap/core';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	phone: text('phone').notNull().unique(),
	password: text('password').notNull(),
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
	authorName: text('author_name'),
	description: text('description').notNull(),
	coverImage: text('cover_image'),
	publishedAt: integer('published_at', { mode: 'timestamp' }),
	price: integer('price'),
	isFree: integer('is_free', { mode: 'boolean' }).notNull().default(false),
	fakeViewers: integer('fake_viewers'),
	fakePurchases: integer('fake_purchases'),
	useFakeData: integer('use_fake_data', { mode: 'boolean' }).notNull().default(true)
});

export const chapters = sqliteTable('chapters', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	bookId: integer('book_id')
		.notNull()
		.references(() => books.id),
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
	chapterId: integer('chapter_id')
		.notNull()
		.references(() => chapters.id),
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
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	bookId: integer('book_id')
		.notNull()
		.references(() => books.id),
	purchasedAt: integer('purchased_at', { mode: 'timestamp' }).notNull(),
	price: integer('price').notNull() // price paid at time of purchase
});

// User reading progression
export const userReadingProgress = sqliteTable('user_reading_progress', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	bookId: integer('book_id')
		.notNull()
		.references(() => books.id),
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
	authorId: text('author_id')
		.notNull()
		.references(() => user.id),
	authorName: text('author_name'),
	title: text('title').notNull(),
	category: text('category').notNull(),
	readTime: integer('read_time').notNull(),
	slug: text('slug').notNull().unique(),
	content: text('content', { mode: 'json' }).$type<Content>().notNull(),
	excerpt: text('excerpt'),
	coverImage: text('cover_image'),
	published: integer('published', { mode: 'boolean' }).notNull().default(false),
	publishedAt: integer('published_at', { mode: 'timestamp' }),
	fakeViewers: integer('fake_viewers'),
	fakePurchases: integer('fake_purchases'),
	useFakeData: integer('use_fake_data', { mode: 'boolean' }).notNull().default(true),
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
	commentSectionId: integer('comment_section_id')
		.notNull()
		.references(() => commentSections.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	parentCommentId: integer('parent_comment_id'), // for nested replies
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
	deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false)
});

// Reader activity log - tracks detailed reading behavior and time spent
export const readerActivityLog = sqliteTable('reader_activity_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
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

export const media = sqliteTable('media', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	originalName: text('original_name').notNull(),
	type: text('type').notNull(), // image/jpeg, video/mp4, audio/mpeg, application/pdf
	size: integer('size').notNull(), // bytes
	url: text('url').notNull(), // local path: /uploads/filename.jpg (easy to swap to S3/GCP URL)
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
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

// Basic table types (without relations)
export type Book = typeof books.$inferSelect;
export type BookInsert = typeof books.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type ChapterInsert = typeof chapters.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type SectionInsert = typeof sections.$inferInsert;
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
export type UserBookPurchase = typeof userBookPurchases.$inferSelect;
export type UserBookPurchaseInsert = typeof userBookPurchases.$inferInsert;
export type UserReadingProgress = typeof userReadingProgress.$inferSelect;
export type UserReadingProgressInsert = typeof userReadingProgress.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogPostInsert = typeof blogPosts.$inferInsert;
export type CommentSection = typeof commentSections.$inferSelect;
export type CommentSectionInsert = typeof commentSections.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;
export type ReaderActivityLog = typeof readerActivityLog.$inferSelect;
export type ReaderActivityLogInsert = typeof readerActivityLog.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

// Relation types - use these when you query with relations included
export type UserWithRelations = User & {
	sessions?: Session[];
	purchases?: UserBookPurchase[];
	readingProgress?: UserReadingProgress[];
	blogPosts?: BlogPost[];
	comments?: Comment[];
	activityLogs?: ReaderActivityLog[];
};

export type BookWithRelations = Book & {
	chapters?: Chapter[];
	purchases?: UserBookPurchase[];
	readingProgress?: UserReadingProgress[];
	commentSections?: CommentSection[];
};

export type ChapterWithRelations = Chapter & {
	book?: Book;
	sections?: Section[];
	readingProgress?: UserReadingProgress[];
	commentSections?: CommentSection[];
};

export type SectionWithRelations = Section & {
	chapter?: Chapter;
	readingProgress?: UserReadingProgress[];
	activityLogs?: ReaderActivityLog[];
};

export type BlogPostWithRelations = BlogPost & {
	author?: User;
	commentSections?: CommentSection[];
	activityLogs?: ReaderActivityLog[];
};

export type CommentSectionWithRelations = CommentSection & {
	blogPost?: BlogPost;
	book?: Book;
	chapter?: Chapter;
	comments?: Comment[];
};

export type CommentWithRelations = Comment & {
	commentSection?: CommentSection;
	user?: User;
	parentComment?: Comment;
	replies?: Comment[];
};

export type ReaderActivityLogWithRelations = ReaderActivityLog & {
	user?: User;
	section?: Section;
	blogPost?: BlogPost;
};

// Nested relation types - for deeper queries
export type BookWithChaptersAndSections = Book & {
	chapters?: (Chapter & {
		sections?: Section[];
	})[];
};

export type ChapterWithSectionsAndBook = Chapter & {
	book?: Book;
	sections?: Section[];
};

export type BlogPostWithAuthorAndComments = BlogPost & {
	author?: User;
	commentSections?: (CommentSection & {
		comments?: (Comment & {
			user?: User;
			replies?: Comment[];
		})[];
	})[];
};

export type UserWithFullReadingData = User & {
	readingProgress?: (UserReadingProgress & {
		book?: Book;
		chapter?: Chapter;
		section?: Section;
	})[];
	purchases?: (UserBookPurchase & {
		book?: Book;
	})[];
	activityLogs?: (ReaderActivityLog & {
		section?: Section;
		blogPost?: BlogPost;
	})[];
};
