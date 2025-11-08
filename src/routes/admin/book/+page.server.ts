import { createBook, getAllBooksForAdminPage, updateBook } from '$lib/server/query/book';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export type BooksForAdminPage = Awaited<ReturnType<typeof getAllBooksForAdminPage>>;
export type SingleBookForAdminPage = BooksForAdminPage[number];


export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/');
    }
    const books = await getAllBooksForAdminPage();
    return { books };
};

export const actions: Actions = {
    updateBook: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const bookId = Number(formData.get('id'));

        const bookData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            coverImage: formData.get('coverImage') as string || null,
            price: formData.get('isFree') === 'true' ? null : Number(formData.get('price')),
            isFree: formData.get('isFree') === 'true',
            publishedAt: formData.get('publishedAt') ? new Date(formData.get('publishedAt') as string) : null,
            fakeViewers: Number(formData.get('fakeViewers')) || 0,
            fakePurchases: Number(formData.get('fakePurchases')) || 0,
            useFakeData: formData.get('useFakeData') === 'true'
        };

        try {
            await updateBook(bookId, bookData);
            return { success: true };
        } catch (error) {
            console.error(error)
            return fail(500, { message: 'Failed to update book' });
        }
    },

    createBook: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();

        const bookData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            coverImage: formData.get('coverImage') as string || null,
            price: formData.get('isFree') === 'true' ? null : Number(formData.get('price')),
            isFree: formData.get('isFree') === 'true',
            publishedAt: null,
            fakeViewers: 0,
            fakePurchases: 0,
            useFakeData: true
        };

        try {
            await createBook(bookData);
            return { success: true };
        } catch (error) {
            console.error(error)
            return fail(500, { message: 'Failed to create book' });
        }
    }
};