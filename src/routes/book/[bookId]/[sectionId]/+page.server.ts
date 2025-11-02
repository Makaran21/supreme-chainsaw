import { getSectionById } from "$lib/server/query/book"

export async function load({ params }) {
	const section = await getSectionById(Number(params.sectionId))
	return {
		section
	}
}