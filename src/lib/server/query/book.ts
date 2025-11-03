import type { Content } from '@tiptap/core';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { books, chapters, sections, type Block, type Chapter, type Section } from '../db/schema';

export type BookWithContent = Awaited<ReturnType<typeof getBookWithContent>>;

export type OrderedChapterWithSections = { chapterId: number, sectionIds: number[] }

export type ChapterWithSections = Chapter & { sections: Section[] }

export type BookDataOperation = {
	dataType: 'CHAPTER' | 'SECTION';
	action: 'CREATE' | 'DELETE' | 'RENAME' | 'MOVE';
	section?: Section;
	chapter?: Chapter;
}

export async function getBookWithContent(bookId: number) {
	const book = await db.query.books.findFirst({
		where: eq(books.id, bookId),
		with: {
			chapters: {
				orderBy: (chapters, { asc }) => [asc(chapters.orderIndex)],
				with: {
					sections: {
						orderBy: (sections, { asc }) => [asc(sections.orderIndex)]
					}
				}
			}
		}
	});

	if (!book) throw Error(`Book [ID: ${book}] not found`)

	return book;
}

export async function getAllBooks() {
	const allBooks = await db.select().from(books).all();
	return allBooks;
}

export async function getAllBooksForHomePage() {
	const booksWithProgress = await db.query.books.findMany({
		with: {
			readingProgress: {
				where: (progress, { eq }) => eq(progress.userId, '2')
			}
		}
	});

	return booksWithProgress.map(book => {
		const progressEntry = book.readingProgress[0];
		const progress = progressEntry ? progressEntry : null;

		return {
			...book,
			readingProgress: progress
		};
	});
}

export async function updateBook(bookId: number, data: {
	title?: string;
	description?: string;
	coverImage?: string;
}) {
	const [updatedBook] = await db
		.update(books)
		.set(data)
		.where(eq(books.id, bookId))
		.returning();

	return updatedBook;
}

export async function getChaptersWithSectionByBookId(bookId: number) {
	const bookChapters = await db.query.chapters.findMany({
		where: eq(chapters.bookId, bookId),
		orderBy: (chapters, { asc }) => [asc(chapters.orderIndex)],
		with: {
			sections: {
				orderBy: (sections, { asc }) => [asc(sections.orderIndex)]
			}
		}
	})
	return bookChapters
}

export async function addChapter(data: Chapter) {
	const [chapter] = await db
		.insert(chapters)
		.values(data)
		.returning();

	return chapter;
}

// Add multiple chapters
export async function addChapters(chapterList: Array<{
	bookId: number;
	title: string;
	orderIndex: number;
	nextChapterId?: number;
}>) {
	const insertedChapters = await db
		.insert(chapters)
		.values(chapterList)
		.returning();

	return insertedChapters;
}

// Add section
export async function addSection(data: Section) {
	const { id, ...fields } = data
	const [section] = await db
		.insert(sections)
		.values(fields)
		.returning();

	return section;
}

export async function getSectionById(id: number): Promise<Section> {
	const section = await db.query.sections.findFirst({ where: eq(sections.id, id) })
	if (!section) throw Error(`Section [ID: ${id}] not found`)
	return section
}

// Add multiple sections
export async function addSections(sectionList: Array<{
	chapterId: number;
	title: string;
	content: string;
	orderIndex: number;
	nextSectionId?: number;
	blocks?: Block[];
}>) {
	const insertedSections = await db
		.insert(sections)
		.values(sectionList)
		.returning();

	return insertedSections;
}

export function findToUpdatesChapter(
	chaptersByBookId: ChapterWithSections[],
	chapterIds: OrderedChapterWithSections[]
) {
	const currentOrderMap = new Map<number, ChapterWithSections>();
	chaptersByBookId.forEach(chapter => {
		if (!chapter.id) return;
		currentOrderMap.set(chapter.id, chapter);
	});

	const chaptersToUpdates: Array<{ id: number; orderIndex: number }> = [];
	const sectionsToUpdates: Array<{ id: number; orderIndex: number }> = [];

	chapterIds.forEach((chapter, newChapterIndex) => {
		const chapterId = chapter.chapterId;
		const currentChapter = currentOrderMap.get(chapterId);
		if (!currentChapter) return;

		if (
			currentChapter.orderIndex !== undefined &&
			currentChapter.orderIndex !== newChapterIndex
		) {
			chaptersToUpdates.push({
				id: chapterId,
				orderIndex: newChapterIndex
			});
		}

		const currentSections = currentChapter.sections || [];
		const newSectionIds = chapter.sectionIds || [];

		newSectionIds.forEach((sectionId, newSectionIndex) => {
			const currentSection = currentSections.find(s => s.id === sectionId);
			if (!currentSection) return;

			if (
				currentSection.orderIndex !== undefined &&
				currentSection.orderIndex !== newSectionIndex
			) {
				sectionsToUpdates.push({
					id: sectionId,
					orderIndex: newSectionIndex
				});
			}
		});
	});

	return {
		chapters: chaptersToUpdates,
		sections: sectionsToUpdates
	};
}

export async function updateSectionsOrders(sectionOrders: {
	id: number;
	orderIndex: number;
}[]) {
	const updatesMap = sectionOrders.reduce((acc, { id, orderIndex }) => {
		acc[id] = orderIndex;
		return acc;
	}, {} as Record<number, number>);

	const cases = Object.entries(updatesMap)
		.map(([id, idx]) => `WHEN ${id} THEN ${idx}`)
		.join(' ');

	const ids = Object.keys(updatesMap).join(',');

	await db.run(`
		UPDATE sections
		SET order_index = CASE id ${cases} ELSE order_index END
		WHERE id IN (${ids});
	`);
}
export async function updateChapterOrders(chapterOrders: {
	id: number;
	orderIndex: number;
}[]) {
	const updatesMap = chapterOrders.reduce((acc, { id, orderIndex }) => {
		acc[id] = orderIndex;
		return acc;
	}, {} as Record<number, number>);

	const cases = Object.entries(updatesMap)
		.map(([id, idx]) => `WHEN ${id} THEN ${idx}`)
		.join(' ');

	const ids = Object.keys(updatesMap).join(',');

	await db.run(`
		UPDATE chapters
		SET order_index = CASE id ${cases} ELSE order_index END
		WHERE id IN (${ids});
	`);
}

export async function reorderChapterAndSection(bookId: number, chapterAndSectionsIds: OrderedChapterWithSections[]) {
	const chaptersByBookId = await getChaptersWithSectionByBookId(bookId)

	const newReorderChapter = findToUpdatesChapter(chaptersByBookId, chapterAndSectionsIds)

	if (newReorderChapter.sections.length) await updateSectionsOrders(newReorderChapter.sections)
	if (newReorderChapter.chapters.length) await updateChapterOrders(newReorderChapter.chapters)
}

export async function renameSection(section: Section) {
	if (!section.id) throw new Error(`Section's id is undefined`);

	const result = await db
		.update(sections)
		.set({ title: section.title })
		.where(eq(sections.id, section.id))
		.returning({ id: sections.id, title: sections.title });

	if (result.length === 0) {
		throw new Error(`Section with id ${section.id} not found`);
	}

	return result[0];

}
export async function updateSectionContent(sectionId: number, content: Content) {
	const result = await db
		.update(sections)
		.set({ content })
		.where(eq(sections.id, sectionId))
		.returning({ id: sections.id, title: sections.title });

	if (result.length === 0) {
		throw new Error(`Section with id ${sectionId} not found`);
	}

	return result[0];
}

export async function renameChapter(chapter: Chapter) {
	if (!chapter.id) throw new Error(`Chapter's id is undefined`);

	const result = await db
		.update(chapters)
		.set({ title: chapter.title })
		.where(eq(chapters.id, chapter.id))
		.returning({ id: chapters.id, title: chapters.title });

	if (result.length === 0) {
		throw new Error(`Chapter with id ${chapter.id} not found`);
	}

	return result[0];
}

export async function deleteSection(section: Section) {
	if (!section.id) throw new Error(`Section's id is undefined`);

	const result = await db
		.delete(sections)
		.where(eq(sections.id, section.id))
		.returning({ id: sections.id, title: sections.title });

	if (result.length === 0) {
		throw new Error(`Section with id ${section.id} not found`);
	}

	return result[0];

}

export async function deleteChapter(chapter: Chapter) {
	if (!chapter.id) throw new Error(`Chapter's id is undefined`);

	const result = await db
		.delete(chapters)
		.where(eq(chapters.id, chapter.id))
		.returning({ id: chapters.id, });

	if (result.length === 0) {
		throw new Error(`Chapter with id ${chapter.id} not found`);
	}

	return result[0];

}

export async function changeSectionChapterId(section: Section) {
	if (!section.id) throw new Error(`Section's id is undefined`);

	const result = await db
		.update(sections)
		.set({ chapterId: section.chapterId, })
		.where(eq(sections.id, section.id))
		.returning({ id: sections.id, title: sections.title });

	if (result.length === 0) {
		throw new Error(`Section with id ${section.id} not found`);
	}

	return result[0];

}

export async function sectionOperationHandler(action: BookDataOperation['action'], section: Section) {
	if (action === 'RENAME') return renameSection(section)
	if (action === 'DELETE') return deleteSection(section)
	if (action === 'CREATE') return addSection(section)
	if (action === 'MOVE') return changeSectionChapterId(section)
}

export async function chapterOperationHandler(action: BookDataOperation['action'], chapter: Chapter) {
	if (action === 'RENAME') return renameChapter(chapter)
	if (action === 'DELETE') return deleteChapter(chapter)
	if (action === 'CREATE') return addChapter(chapter)
}

export async function bookDataOperationHandler(operations: BookDataOperation[]) {
	await Promise.all(operations.map(async (operation) => {
		if (operation.dataType === 'SECTION') {
			if (!operation.section) return null
			await sectionOperationHandler(operation.action, operation.section)
			return
		}

		if (operation.dataType === 'CHAPTER') {
			if (!operation.chapter) return null
			await chapterOperationHandler(operation.action, operation.chapter)
			return
		}
	}))
}