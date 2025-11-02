<script lang="ts">
	import BookCard from '$lib/components/client/BookCard.svelte';
	import ComingSoonBookCard from '$lib/components/client/ComingSoonBookCard.svelte';
	import type { Book } from '$lib/server/db/schema';
	import { BookOpen, Star } from '@lucide/svelte';

	interface BookV1 {
		id: number;
		title: string;
		author: string;
		status: 'reading' | 'completed';
		progress?: number;
		cover: string;
		description: string;
	}

	interface BlogPost {
		id: number;
		title: string;
		excerpt: string;
		date: string;
		readTime: string;
		category: string;
	}

	interface Feedback {
		id: number;
		author: string;
		role: string;
		content: string;
		rating: number;
		avatar: string;
	}

	export let data: { allBooks: Book[] };

	const allBooks: Book[] = data.allBooks;

	const books: BookV1[] = [
		{
			id: 1,
			title: 'The Midnight Library',
			author: 'Matt Haig',
			status: 'reading',
			progress: 65,
			cover: '/placeholder.svg?height=400&width=280',
			description: 'A contemporary fantasy exploring infinite possibilities.'
		},
		{
			id: 2,
			title: 'Educated',
			author: 'Tara Westover',
			status: 'completed',
			cover: '/placeholder.svg?height=400&width=280',
			description: 'A powerful memoir about education and self-discovery.'
		}
	];

	const blogPosts: BlogPost[] = [
		{
			id: 1,
			title: 'Why Fiction Expands Your Perspective',
			excerpt: 'Exploring how reading fiction can enhance empathy and creative thinking.',
			date: 'Nov 1, 2025',
			readTime: '5 min',
			category: 'Insights'
		},
		{
			id: 2,
			title: 'Building a Reading Habit in 30 Days',
			excerpt: 'A practical guide to establishing consistent reading habits and staying motivated.',
			date: 'Oct 28, 2025',
			readTime: '7 min',
			category: 'Tips'
		},
		{
			id: 3,
			title: 'Top 10 Books That Changed My Life',
			excerpt: 'A curated list of transformative reads that shaped my worldview.',
			date: 'Oct 25, 2025',
			readTime: '6 min',
			category: 'Reviews'
		},
		{
			id: 4,
			title: 'The Power of Re-reading Classics',
			excerpt: 'Discover what makes revisiting classic literature a transformative experience.',
			date: 'Oct 22, 2025',
			readTime: '8 min',
			category: 'Essays'
		},
		{
			id: 5,
			title: 'Digital vs Physical Books: Which is Better?',
			excerpt: 'An honest comparison of reading mediums and their impact on comprehension.',
			date: 'Oct 19, 2025',
			readTime: '6 min',
			category: 'Analysis'
		},
		{
			id: 6,
			title: 'Book Club Tips for First-Time Hosts',
			excerpt: 'Everything you need to know to start and run a successful book club.',
			date: 'Oct 16, 2025',
			readTime: '5 min',
			category: 'Guides'
		}
	];

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

	const feedbackItems: Feedback[] = [
		{
			id: 1,
			author: 'Sarah Johnson',
			role: 'Book Reviewer',
			content:
				'The curated selection of books has transformed my reading habits. Simply exceptional!',
			rating: 5,
			avatar: '/placeholder.svg?height=40&width=40'
		},
		{
			id: 2,
			author: 'Michael Chen',
			role: 'Literary Enthusiast',
			content: 'Amazing platform for discovering new reads. The recommendations are spot on.',
			rating: 5,
			avatar: '/placeholder.svg?height=40&width=40'
		},
		{
			id: 3,
			author: 'Emma Rodriguez',
			role: 'Student',
			content: 'Perfect for organizing my reading lists and tracking progress. Highly recommend!',
			rating: 4,
			avatar: '/placeholder.svg?height=40&width=40'
		}
	];

	let activeNav = 'home';
</script>

<main class="pattern-bg min-h-screen bg-background">
	<!-- Navigation Section -->
	<nav class="sticky top-0 z-50 border-b border-border bg-background/95">
		<div class="mx-auto max-w-7xl px-6 py-4">
			<div class="flex items-center justify-between">
				<!-- Logo -->
				<div class="flex items-center gap-3">
					<BookOpen class="h-6 w-6 text-primary" />
					<h1 class="text-xl font-bold tracking-tight">BOOKLIB</h1>
				</div>

				<!-- Navigation Links -->
				<div class="flex items-center gap-8">
					<button
						onclick={() => (activeNav = 'home')}
						class="text-sm font-semibold transition-all {activeNav === 'home'
							? 'border-b-2 border-primary text-primary'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						Home
					</button>
					<button
						onclick={() => (activeNav = 'books')}
						class="text-sm font-semibold transition-all {activeNav === 'books'
							? 'border-b-2 border-primary text-primary'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						Books
					</button>
					<button
						onclick={() => (activeNav = 'blog')}
						class="text-sm font-semibold transition-all {activeNav === 'blog'
							? 'border-b-2 border-primary text-primary'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						Blog
					</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Banner Section -->
	<section class="mx-auto max-w-7xl px-6 py-16 sm:py-24">
		<div class="text-left">
			<h2 class="mb-6 text-6xl leading-tight font-black sm:text-7xl">
				Discover
				<br />
				<span class="gradient-text-warm">Amazing Books</span>
			</h2>
			<p class="mb-8 max-w-2xl text-lg leading-relaxed font-medium text-muted-foreground">
				Explore our curated collection and find your next favorite book. Track your reading journey
				and connect with literature that inspires.
			</p>
			<div class="flex flex-wrap gap-4">
				<a href="#books">
					<button
						class="rounded bg-primary px-8 py-3 text-sm font-bold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
					>
						EXPLORE NOW
					</button>
				</a>
				<button
					class="rounded border-2 border-primary px-8 py-3 text-sm font-bold tracking-wide text-primary transition-colors hover:bg-primary/5"
				>
					LEARN MORE
				</button>
			</div>
		</div>
	</section>

	<!-- Books Section -->
	<section id="books" class="mx-auto max-w-7xl border-t px-6 py-16 sm:py-20">
		<div class="mb-12">
			<h3 class="mb-4 text-5xl font-black">MY BOOKS</h3>
			<div class="h-1.5 w-20 rounded-full bg-linear-to-r from-primary to-accent"></div>
		</div>
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each allBooks as book (book.id)}
				<BookCard
					book={{
						...book,
						progress: 65,
						author: 'Writer',
						cover: '/placeholder.svg',
						status: 'reading'
					} as BookV1}
				/>
			{/each}
			{#each comingSoonBooks as book (book.id)}
				<ComingSoonBookCard {book} />
			{/each}
		</div>
	</section>

	<!-- Blog Section -->
	<section class="mx-auto max-w-7xl border-t border-border px-6 py-16 sm:py-20">
		<div class="mb-12">
			<h3 class="mb-4 text-5xl font-black">LATEST ARTICLES</h3>
			<div class="h-1.5 w-20 rounded-full bg-linear-to-r from-secondary to-primary"></div>
		</div>
		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each blogPosts as post (post.id)}
				<article
					class="group cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
				>
					<div class="mb-4 flex items-center justify-between">
						<span class="text-xs font-black tracking-widest text-primary uppercase">
							{post.category}
						</span>
						<span class="text-xs text-muted-foreground">{post.readTime}</span>
					</div>
					<h4
						class="mb-4 text-xl leading-tight font-black transition-colors group-hover:text-primary"
					>
						{post.title}
					</h4>
					<p class="mb-6 text-sm leading-relaxed text-muted-foreground">
						{post.excerpt}
					</p>
					<div class="text-xs font-medium text-muted-foreground">
						{post.date}
					</div>
				</article>
			{/each}
		</div>
		<div class="flex justify-center">
			<button
				class="rounded border-2 border-primary px-8 py-3 text-sm font-bold tracking-wide text-primary transition-colors hover:bg-primary/5"
			>
				VIEW MORE
			</button>
		</div>
	</section>

	<!-- Added customer feedback section -->
	<section class="mx-auto max-w-7xl border-t border-border px-6 py-16 sm:py-20">
		<div class="mb-12">
			<h3 class="mb-4 text-5xl font-black">CUSTOMER FEEDBACK</h3>
			<div class="h-1.5 w-20 rounded-full bg-gradient-to-r from-accent to-secondary"></div>
		</div>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each feedbackItems as feedback (feedback.id)}
				<div
					class="rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
				>
					<div class="mb-4 flex items-start justify-between">
						<div class="flex items-center gap-4">
							<img
								src={feedback.avatar || '/placeholder.svg'}
								alt={feedback.author}
								class="h-12 w-12 rounded-full"
							/>
							<div>
								<h4 class="font-black text-foreground">{feedback.author}</h4>
								<p class="text-xs text-muted-foreground">{feedback.role}</p>
							</div>
						</div>
					</div>
					<div class="star-rating mb-4">
						{#each Array(feedback.rating) as _, i (i)}
							<Star class="h-5 w-5 fill-current" />
						{/each}
					</div>
					<p class="text-sm leading-relaxed text-muted-foreground">
						"{feedback.content}"
					</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Updated stats footer to show sell numbers instead of reading metrics -->
	<footer class="mx-auto max-w-7xl border-t border-border px-6 py-16 sm:py-20">
		<div class="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3">
			<div class="group">
				<div class="mb-3 text-6xl font-black transition-colors group-hover:text-primary">
					{books.length}K
				</div>
				<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">Total Sold</p>
			</div>
			<div class="group">
				<div class="mb-3 text-6xl font-black text-primary">12.5K</div>
				<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">
					Monthly Sells
				</p>
			</div>
			<div class="group">
				<div class="mb-3 text-6xl font-black text-accent">98%</div>
				<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">
					Satisfaction
				</p>
			</div>
		</div>
		<div class="border-t border-border pt-8 text-center">
			<p class="text-sm text-muted-foreground">
				© 2025 Book Library • Your trusted source for great reads
			</p>
		</div>
	</footer>
</main>
