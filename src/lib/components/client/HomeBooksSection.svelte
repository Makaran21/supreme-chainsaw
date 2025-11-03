<script lang="ts">
	import type { BooksForHomePage } from '../../../routes/+page.server';
	import HomeBookCard from './HomeBookCard.svelte';
	import ComingSoonBookCard from './HomeComingSoonBookCard.svelte';

	export let allBooks: BooksForHomePage;

	const comingSoonBooks = [
		{
			id: 3,
			title: 'The Silent Patient',
			author: 'Alex Michaelides',
			releaseDate: 'Dec 2025',
			cover: '/placeholder.svg?height=400&width=280',
			description: 'A gripping psychological thriller with jaw-dropping twists.'
		},
		{
			id: 4,
			title: 'Tomorrow and Tomorrow and Tomorrow',
			author: 'Gabrielle Zevin',
			releaseDate: 'Jan 2026',
			cover: '/placeholder.svg?height=400&width=280',
			description: 'An epic tale of friendship, love, and the power of creation.'
		}
	];
</script>

<section id="books" class="mx-auto max-w-7xl border-t px-6 py-16 sm:py-20">
	<div class="mb-12">
		<h3 class="mb-4 text-5xl font-black">សៀវភៅរបស់ខ្ញុំ</h3>
		<div class="h-1.5 w-20 rounded-full bg-linear-to-r from-primary to-accent"></div>
	</div>
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
		{#each allBooks as book (book.id)}
			<HomeBookCard {book} />
		{/each}
		{#each comingSoonBooks as book (book.id)}
			<ComingSoonBookCard {book} />
		{/each}
	</div>
</section>
