import type { Content } from '@tiptap/core';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
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
	coverImage: text('cover_image')
});

export const chapters = sqliteTable('chapters', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	bookId: integer('book_id').notNull().references(() => books.id),
	title: text('title').notNull(),
	orderIndex: integer('order_index').notNull(),
	nextChapterId: integer('next_chapter_id')
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
	blocks: text('blocks', { mode: 'json' }).$type<Block[]>()
});

// Relations
export const booksRelations = relations(books, ({ many }) => ({
	chapters: many(chapters)
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
	book: one(books, {
		fields: [chapters.bookId],
		references: [books.id]
	}),
	sections: many(sections)
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
	chapter: one(chapters, {
		fields: [sections.chapterId],
		references: [chapters.id]
	})
}));

export type Book = typeof books.$inferInsert

export type Chapter = typeof chapters.$inferInsert

export type Section = typeof sections.$inferInsert

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

