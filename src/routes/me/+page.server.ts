import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import type { Actions, PageServerLoad } from './$types';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch full user data
	const [userData] = await db
		.select({
			id: user.id,
			username: user.username,
			phone: user.phone,
			age: user.age
		})
		.from(user)
		.where(eq(user.id, locals.user.id))
		.limit(1);

	return {
		user: userData
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const username = formData.get('username');
		const phone = formData.get('phone');
		const password = formData.get('password');
		const ageString = formData.get('age');

		if (!username || typeof username !== 'string') {
			return fail(400, { error: 'Username is required' });
		}

		if (!phone || typeof phone !== 'string') {
			return fail(400, { error: 'Phone number is required' });
		}

		// Username validation
		if (username.length < 3) {
			return fail(400, { error: 'Username must be at least 3 characters' });
		}

		if (username.length > 31) {
			return fail(400, { error: 'Username must be 31 characters or less' });
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return fail(400, { error: 'Username can only contain letters, numbers, and underscores' });
		}

		// Phone validation
		const cleanPhone = phone.replace(/\s/g, '');
		if (cleanPhone.length < 10) {
			return fail(400, { error: 'Please enter a valid phone number' });
		}

		// Password validation (if provided)
		let passwordHash: string | undefined;
		if (password && typeof password === 'string' && password.length > 0) {
			if (password.length < 6) {
				return fail(400, { error: 'Password must be at least 6 characters' });
			}
			passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
		}

		// Parse age
		let age: number | null = null;
		if (ageString && ageString !== '') {
			age = parseInt(ageString as string);
			if (isNaN(age) || age < 1 || age > 150) {
				return fail(400, { error: 'Please enter a valid age between 1 and 150' });
			}
		}

		// Check if username or phone is taken by another user
		const existingUser = await db
			.select()
			.from(user)
			.where(or(
				eq(user.username, username),
				eq(user.phone, cleanPhone)
			))
			.limit(2);

		for (const u of existingUser) {
			if (u.id !== locals.user.id) {
				if (u.username === username) {
					return fail(400, { error: 'Username already taken' });
				}
				if (u.phone === cleanPhone) {
					return fail(400, { error: 'Phone number already registered' });
				}
			}
		}

		// Update user
		const updateData: any = { username, phone: cleanPhone, age };
		if (passwordHash) {
			updateData.password = passwordHash;
		}

		await db
			.update(user)
			.set(updateData)
			.where(eq(user.id, locals.user.id));

		return { success: 'ប្រវត្តិគណនីបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ' };
	},

	logout: async ({ locals, cookies }) => {
		if (!locals.session) {
			throw redirect(302, '/login');
		}

		// Invalidate session using your session utilities
		await invalidateSession(locals.session.id);
		deleteSessionTokenCookie({ cookies } as any);

		throw redirect(302, '/login');
	}
};