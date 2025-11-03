import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/me');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const phone = formData.get('phone');
		const password = formData.get('password');

		if (!phone || typeof phone !== 'string') {
			return fail(400, { error: 'Phone number is required' });
		}

		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Password is required' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		// Clean phone
		const cleanPhone = phone.replace(/\s/g, '');
		if (cleanPhone.length < 10) {
			return fail(400, { error: 'Please enter a valid phone number' });
		}

		// Find user by phone
		const existingUser = await db
			.select()
			.from(user)
			.where(eq(user.phone, cleanPhone))
			.limit(1);

		if (existingUser.length === 0) {
			return fail(400, { error: 'Invalid phone number or password' });
		}

		// Verify password
		const validPassword = await verify(existingUser[0].password, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, { error: 'Invalid phone number or password' });
		}

		// Create session
		const token = generateSessionToken();
		const session = await createSession(token, existingUser[0].id);
		setSessionTokenCookie(event, token, session.expiresAt);

		redirect(302, '/');
		return
	}
};