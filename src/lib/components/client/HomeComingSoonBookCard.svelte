<script lang="ts">
	import Lock from '@lucide/svelte/icons/lock';
	import Zap from '@lucide/svelte/icons/zap';

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
	class="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card opacity-75 shadow-sm duration-200 hover:-translate-y-0.5 hover:shadow-md"
	role="button"
	aria-label="Coming soon book card"
	tabindex="0"
>
	<!-- Book cover with lock overlay -->
	<div class="relative overflow-hidden bg-gray-100">
		<img
			src={book.cover || '/placeholder.svg'}
			alt={book.title}
			class="h-[280px] w-full object-cover blur-sm duration-300 ease-out group-hover:scale-110"
		/>

		<!-- Coming Soon Badge -->
		<div
			class="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-accent/20 px-4 py-2 text-xs font-bold text-accent backdrop-blur-sm"
		>
			<Zap class="h-4 w-4" />
			<span>COMING SOON</span>
		</div>

		<!-- Lock overlay -->
		<div
			class="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/60 to-transparent"
		>
			<Lock class="h-12 w-12 text-white/80" />
		</div>
	</div>

	<!-- Book info -->
	<div class="space-y-3 p-6">
		<h3
			class="text-lg leading-tight font-black text-foreground duration-200 group-hover:text-primary"
		>
			{book.title}
		</h3>

		<p class="text-sm font-bold">
			{book.author}
		</p>

		<p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
			{book.description}
		</p>

		<!-- Release date -->
		<div class="border-t border-border pt-3 text-xs font-bold">
			Available: {book.releaseDate}
		</div>
	</div>
</div>
