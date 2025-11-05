<script lang="ts">
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import Clock from '@lucide/svelte/icons/clock';
	import type { BooksForHomePage } from '../../../routes/+page.server';

	export let book: BooksForHomePage[number];
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

	const config = statusConfig[!book.readingProgress ? 'reading' : 'completed'];
</script>

<a
	{href}
	class="shadow-xs sanimate-[fadeIn_0.2s_ease-out] block cursor-pointer overflow-hidden rounded-xl border border-border bg-card duration-200 hover:-translate-y-0.5 hover:shadow-md"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	aria-label="View details for {book.title}"
>
	<div class="relative overflow-hidden bg-gray-100">
		<img
			src={book.coverImage || '/placeholder.svg'}
			alt={book.title}
			class="h-[280px] w-full object-cover duration-300 ease-out group-hover:scale-110"
		/>

		<div
			class="absolute top-4 left-4 {config.color} flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold backdrop-blur-sm"
		>
			<config.icon class="h-4 w-4" />
			<span>{config.label}</span>
		</div>

		{#if book.readingProgress && !book.readingProgress.completedAt}
			<div class="absolute right-0 bottom-0 left-0 h-1 bg-gray-300">
				<div
					class="h-full bg-linear-to-r from-primary to-accent duration-300 ease-out"
					style="width: {book.readingProgress.progressPercentage}%"
				></div>
			</div>
		{/if}
	</div>

	<div class="space-y-3 p-6">
		<h3
			class="text-lg leading-tight font-black text-foreground duration-200 group-hover:text-primary"
		>
			{book.title}
		</h3>

		<p class="text-sm font-bold opacity-75">
			<!-- {book.anthor} -->
			Khieu Vicheanon
		</p>

		<p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
			{book.description}
		</p>

		<!-- Progress display -->
		{#if book.readingProgress && !book.readingProgress.completedAt}
			<div class="border-t border-border pt-3 text-xs font-bold text-primary">
				{book.readingProgress.progressPercentage}% read
			</div>
		{/if}
	</div>
</a>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
