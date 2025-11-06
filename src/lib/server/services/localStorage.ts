import { db } from '$lib/server/db';
import { media } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export default class LocalMediaStorage {
	static uploadDir = 'static/uploads';

	static async saveLocalFile(file: File) {
		if (!fs.existsSync(this.uploadDir)) {
			fs.mkdirSync(this.uploadDir, { recursive: true });
		}

		const id = crypto.randomUUID();

		const buffer = Buffer.from(await file.arrayBuffer());
		const fileName = `${id}${path.extname(file.name)}`;

		const filePath = path.join(this.uploadDir, fileName);

		fs.writeFileSync(filePath, buffer);

		return {
			id,
			fileName,
			url: `/uploads/${fileName}`
		};
	}

	static async createRecord({
		id,
		name,
		originalName,
		type,
		size,
		url
	}: {
		id: string;
		name: string;
		originalName: string;
		type: string;
		size: number;
		url: string;
	}) {
		const now = new Date();

		const [record] = await db
			.insert(media)
			.values({
				id,
				name,
				originalName,
				type,
				size,
				url,
				createdAt: now,
				updatedAt: now
			})
			.returning();

		return record;
	}

	static async deleteRecord(id: string) {
		const mediaRecord = await db.select().from(media).where(eq(media.id, id)).limit(1).execute();

		if (mediaRecord.length === 0) {
			throw new Error('Media record not found');
		}

		const file = mediaRecord[0];

		try {
			fs.unlinkSync('./static' + file.url);
			await db.delete(media).where(eq(media.id, id));
			console.log(`File ${file.name} deleted successfully.`);
			console.log(`Record with ID ${id} deleted from database.`);

			return { success: true, message: 'File and record deleted successfully.' };
		} catch (err) {
			console.error(`Failed to delete file ${file.name}:`, err);
			throw err;
		}
	}
}
