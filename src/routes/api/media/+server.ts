import LocalMediaStorage from '$lib/server/services/localStorage';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { media } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const files = formData.getAll('files') as File[];
		const names = formData.getAll('names') as string[];

		if (!files.length) {
			return new Response('No files uploaded', { status: 400 });
		}

		const saved = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const name = names[i] || file.name;

			const { url, id } = await LocalMediaStorage.saveLocalFile(file);

			const record = await LocalMediaStorage.createRecord({
				id,
				name,
				originalName: file.name,
				type: file.type,
				size: file.size,
				url
			});

			saved.push(record);
		}

		return json({ success: true, data: saved });
	} catch (err) {
		console.error('Upload error:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const GET = async () => {
	try {
		// Fetch all media records from the database
		const mediaRecords = await db.query.media.findMany();

		return json(mediaRecords);
	} catch (err) {
		console.error('Error fetching media records:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const PATCH = async ({ request }) => {
	try {
		const { name, id } = await request.json();

		// Ensure that name is not empty
		if (!id || !name || name.trim() === '') {
			throw error(400, 'Name cannot be empty');
		}

		// Update the media record in the database
		const [updatedMedia] = await db.update(media).set({ name }).where(eq(media.id, id)).returning();

		if (!updatedMedia) {
			throw error(404, 'Media record not found');
		}

		return json(updatedMedia);
	} catch (err) {
		console.error('Error updating media record:', err);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const DELETE = async ({ request }) => {
	try {
		const { id } = await request.json();

		if (!id) {
			throw error(400, 'ID cannot be empty');
		}

		// Call the service to delete the file and the database record
		const result = await LocalMediaStorage.deleteRecord(id);

		return json(result);
	} catch (err) {
		console.error('Error deleting media:', err);
		return error(500, 'Failed to delete media');
	}
};
