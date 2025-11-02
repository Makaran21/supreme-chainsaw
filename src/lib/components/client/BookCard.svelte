<script lang="ts">
	import { Clock, CheckCircle } from '@lucide/svelte';

	interface Book {
		id: number;
		title: string;
		author: string;
		status: 'reading' | 'completed';
		progress?: number;
		cover: string;
		description: string;
	}

	export let book: Book
	export let href: string = `/book/${book.id}`; // Allow customizable href

	let isHovered = false;

	const statusConfig = {
		reading: {
			icon: Clock,
			label: 'Reading',
			color: 'bg-secondary/10 text-secondary'
		},
		completed: {
			icon: CheckCircle,
			label: 'Completed',
			color: 'bg-accent/10 text-accent'
		}
	};

	const config = statusConfig[book.status];
</script>

<a
	{href}
	class="group block cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	aria-label="View details for {book.title}"
>
	<!-- Book cover with enhanced styling -->
	<div class="relative overflow-hidden bg-gray-100">
		<img
			src={book.cover || '/placeholder.svg'}
			alt={book.title}
			class="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-110"
		/>

		<!-- Status badge -->
		<div
			class="absolute top-4 left-4 {config.color} flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold backdrop-blur-sm"
		>
			<config.icon class="h-4 w-4" />
			<span>{config.label}</span>
		</div>

		<!-- Progress bar for reading books -->
		{#if book.status === 'reading' && book.progress}
			<div class="absolute right-0 bottom-0 left-0 h-1 bg-gray-300">
				<div
					class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
					style="width: {book.progress}%"
				></div>
			</div>
		{/if}
	</div>

	<!-- Book info with warm styling -->
	<div class="space-y-3 p-6">
		<h3
			class="text-lg leading-tight font-black text-foreground transition-colors group-hover:text-primary"
		>
			{book.title}
		</h3>

		<p class="text-sm font-bold text-primary">
			{book.author}
		</p>

		<p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
			{book.description}
		</p>

		<!-- Progress display -->
		{#if book.status === 'reading' && book.progress}
			<div class="border-t border-border pt-3 text-xs font-bold text-primary">
				{book.progress}% read
			</div>
		{/if}
	</div>
</a>