<script lang="ts">
	import Lock from '@lucide/svelte/icons/lock';
	import Zap from '@lucide/svelte/icons/zap';
	import Calendar from '@lucide/svelte/icons/calendar';

	interface ComingSoonBook {
		id: number;
		title: string;
		author: string;
		releaseDate: string;
		cover: string;
		description: string;
	}

	export let book: ComingSoonBook;
</script>

<div
	class="group animate-[fadeIn_0.2s_ease-out] cursor-pointer overflow-hidden rounded-xl border border-border bg-card opacity-80 shadow-xs duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
	role="button"
	aria-label="Coming soon: {book.title}"
	tabindex="0"
>
	<!-- Book cover with lock overlay -->
	<div class="relative overflow-hidden bg-gray-100">
		<img
			src={book.cover || '/placeholder.svg'}
			alt={book.title}
			class="h-60 w-full object-cover blur-[2px] duration-300 ease-out group-hover:scale-110 group-hover:blur-[1px] sm:h-[280px]"
		/>

		<!-- Coming Soon Badge -->
		<div
			class="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-linear-to-r from-black/80 to-gray-800/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
		>
			<Zap class="h-3.5 w-3.5" />
			<span class="mt-0.5">COMING SOON</span>
		</div>

		<!-- Lock overlay -->
		<div
			class="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/70 via-black/30 to-transparent"
		>
			<div class="flex flex-col items-center gap-2">
				<Lock class="h-10 w-10 text-white/90 drop-shadow-lg sm:h-12 sm:w-12" />
				<span class="text-xs font-bold text-white/90 drop-shadow-md">LOCKED</span>
			</div>
		</div>
	</div>

	<!-- Book info -->
	<div class="p-4 sm:p-5">
		<div class="mb-2 h-12 w-full">
			<h3
				class=" line-clamp-2 text-base leading-tight font-black text-foreground duration-200 group-hover:text-primary sm:text-lg"
			>
				{book.title}
			</h3>
		</div>

		<p class="mb-2 text-sm font-bold text-foreground/70">
			{book.author}
		</p>

		<p class="mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
			{book.description}
		</p>

		<!-- Release date -->
		<div class="flex items-center gap-2 border-t border-border pt-3 text-xs font-bold">
			<span>Available soon...</span>
		</div>
	</div>
</div>

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
