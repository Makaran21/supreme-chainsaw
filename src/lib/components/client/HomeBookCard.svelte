<script lang="ts">
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import Clock from '@lucide/svelte/icons/clock';
	import type { BooksForHomePage } from '../../../routes/+page.server';

	export let book: BooksForHomePage[number];
	export let href: string = `/book/${book.id}`;

	let isHovered = false;

	const statusConfig = {
		reading: {
			icon: Clock,
			label: 'Reading',
			color: 'bg-blue-500/10 text-blue-600'
		},
		completed: {
			icon: CheckCircle,
			label: 'Completed',
			color: 'bg-emerald-500/10 text-emerald-600'
		}
	};

	const config = statusConfig[!book.readingProgress ? 'reading' : 'completed'];
</script>

<a
	{href}
	class="group block animate-[fadeIn_0.2s_ease-out] cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-xs duration-200 hover:-translate-y-0.5 hover:shadow-md"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	aria-label="View details for {book.title}"
>
	<div class="relative overflow-hidden bg-gray-100">
		<img
			src={book.coverImage || '/placeholder.svg'}
			alt={book.title}
			class="h-60 w-full object-cover duration-300 ease-out group-hover:scale-110 sm:h-[280px]"
		/>

		<!-- Status Badge -->
		<div
			class="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-linear-to-r from-black/80 to-gray-800/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
		>
			<config.icon class="h-3.5 w-3.5" />
			<span class="mt-0.5">{config.label}</span>
		</div>

		<!-- Progress Bar -->
		{#if book.readingProgress && !book.readingProgress.completedAt}
			<div class="absolute right-0 bottom-0 left-0 h-1 bg-gray-300">
				<div
					class="h-full bg-linear-to-r from-primary to-accent duration-300 ease-out"
					style="width: {book.readingProgress.progressPercentage}%"
				></div>
			</div>
		{/if}
	</div>

	<div class="p-4 sm:p-5">
		<!-- Title -->
		<div class="mb-2 w-full h-12">
			<h3
				class=" line-clamp-2 text-base leading-tight font-black text-foreground duration-200 group-hover:text-primary sm:text-lg"
			>
				{book.title}
			</h3>
		</div>

		<!-- Author -->
		<p class="mb-2 text-sm font-bold text-foreground/70">Khieu Vicheanon</p>

		<!-- Description -->
		<p class="mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
			{book.description}
		</p>

		<!-- Progress Info -->
		{#if book.readingProgress && !book.readingProgress.completedAt}
			<div class="flex items-center justify-between border-t border-border pt-3 text-xs">
				<span class="font-bold text-primary">
					{book.readingProgress.progressPercentage}% complete
				</span>
				<span class="font-semibold text-muted-foreground"> Page 122 of 245 </span>
			</div>
		{:else if book.readingProgress?.completedAt}
			<div class="border-t border-border pt-3 text-xs font-semibold text-emerald-600">
				Finished · 245 pages
			</div>
		{:else}
			<div class="border-t border-border pt-3 text-xs font-semibold text-muted-foreground">
				245 pages
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
