<script lang="ts">
	import { Zap, Lock } from "@lucide/svelte";


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
	class="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 opacity-75"
	role="button"
	aria-label="Coming soon book card"
	tabindex="0"
>
	<!-- Book cover with lock overlay -->
	<div class="relative overflow-hidden bg-gray-100">
		<img
			src={book.cover || '/placeholder.svg'}
			alt={book.title}
			class="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-110 blur-sm"
		/>
		
		<!-- Coming Soon Badge -->
		<div class="absolute top-4 left-4 bg-accent/20 text-accent rounded-lg px-4 py-2 flex items-center gap-2 text-xs font-bold backdrop-blur-sm">
			<Zap class="w-4 h-4" />
			<span>COMING SOON</span>
		</div>

		<!-- Lock overlay -->
		<div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-center justify-center">
			<Lock class="w-12 h-12 text-white/80" />
		</div>
	</div>

	<!-- Book info -->
	<div class="p-6 space-y-3">
		<h3 class="font-black text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
			{book.title}
		</h3>

		<p class="text-sm text-primary font-bold">
			{book.author}
		</p>

		<p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
			{book.description}
		</p>

		<!-- Release date -->
		<div class="text-xs font-bold pt-3 border-t border-border">
			Available: {book.releaseDate}
		</div>
	</div>
</div>
