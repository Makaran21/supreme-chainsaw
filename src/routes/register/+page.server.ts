import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

function generateId(): string {
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}


export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/me');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const phone = formData.get('phone');
		const password = formData.get('password');
		const ageString = formData.get('age');

		if (!username || typeof username !== 'string') {
			return fail(400, { 
				error: 'Username is required',
				username: username as string,
				phone: phone as string,
				age: ageString as string
			});
		}

		if (!phone || typeof phone !== 'string') {
			return fail(400, { 
				error: 'Phone number is required',
				username,
				phone: phone as string,
				age: ageString as string
			});
		}

		if (!password || typeof password !== 'string') {
			return fail(400, { 
				error: 'Password is required',
				username,
				phone,
				age: ageString as string
			});
		}

		// Username validation
		if (username.length < 3) {
			return fail(400, { 
				error: 'Username must be at least 3 characters',
				username,
				phone,
				age: ageString as string
			});
		}

		if (username.length > 31) {
			return fail(400, { 
				error: 'Username must be 31 characters or less',
				username,
				phone,
				age: ageString as string
			});
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return fail(400, { 
				error: 'Username can only contain letters, numbers, and underscores',
				username,
				phone,
				age: ageString as string
			});
		}

		// Password validation
		if (password.length < 6) {
			return fail(400, { 
				error: 'Password must be at least 6 characters',
				username,
				phone,
				age: ageString as string
			});
		}

		// Phone validation
		const cleanPhone = phone.replace(/\s/g, '');
		if (cleanPhone.length < 10) {
			return fail(400, { 
				error: 'Please enter a valid phone number',
				username,
				phone,
				age: ageString as string
			});
		}

		// Parse age
		let age: number | null = null;
		if (ageString && ageString !== '') {
			age = parseInt(ageString as string);
			if (isNaN(age) || age < 1 || age > 150) {
				return fail(400, { 
					error: 'Please enter a valid age between 1 and 150',
					username,
					phone,
					age: ageString as string
				});
			}
		}

		// Check if username or phone already exists
		const existingUser = await db
			.select()
			.from(user)
			.where(or(
				eq(user.username, username),
				eq(user.phone, cleanPhone)
			))
			.limit(1);

		if (existingUser.length > 0) {
			if (existingUser[0].username === username) {
				return fail(400, { 
					error: 'Username already taken',
					username: '',
					phone,
					age: ageString as string
				});
			} else {
				return fail(400, { 
					error: 'Phone number already registered',
					username,
					phone: '',
					age: ageString as string
				});
			}
		}

		// Hash password
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Create user
		const userId = generateId();
		await db.insert(user).values({
			id: userId,
			username,
			phone: cleanPhone,
			password: passwordHash,
			age
		});

		// Create session and log user in
		const token = generateSessionToken();
		const session = await createSession(token, userId);
		setSessionTokenCookie(event, token, session.expiresAt);

		throw redirect(302, '/me');
	}
};