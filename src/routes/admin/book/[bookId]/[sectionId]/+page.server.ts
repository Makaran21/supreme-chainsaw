// src/routes/admin/books/+page.server.ts

import { bookDataOperationHandler, getSectionById, reorderChapterAndSection, updateSectionContent, type BookDataOperation, type OrderedChapterWithSections } from "$lib/server/query/book";
import { fail } from '@sveltejs/kit';
import type { Content } from "@tiptap/core";
import type { Actions } from './$types';

export async function load({ params }) {
    const section = await getSectionById(Number(params.sectionId))
    return {
        section
    }
}


export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const contentStr = data.get('content');

        if (!contentStr) return fail(400, { message: 'Missing content' });

        const content = JSON.parse(contentStr as string) as Content

        await updateSectionContent(Number(params.sectionId), content,)

        return { success: true };
    },
    saveChaptersAndSections: async ({ request, params }) => {
        const data = await request.formData();

        const chaptersAndSectionsStr = data.get('chaptersAndSections');
        const operationsStr = data.get('operations');
        if (!chaptersAndSectionsStr || !operationsStr) return fail(400, { message: 'Missing content' });

        const chaptersAndSections = JSON.parse(chaptersAndSectionsStr as string) as OrderedChapterWithSections[];
        const operations = JSON.parse(operationsStr as string) as BookDataOperation[];

        await bookDataOperationHandler(operations)
        await reorderChapterAndSection(Number(params.bookId), chaptersAndSections)

        return { success: true };
    },

};
