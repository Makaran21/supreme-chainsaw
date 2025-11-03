<script lang="ts">
	import type { BlogPost } from "$lib/server/db/schema";
	import BlogPostCard from "./BlogPostCard.svelte";
	export let blogPosts: BlogPost[];

</script>
<section class="mx-auto max-w-7xl border-t border-border px-6 py-16 sm:py-20">
		<div class="mb-12">
			<h3 class="mb-4 text-5xl font-black">អត្ថបទថ្មីៗ</h3>
			<div class="h-1.5 w-20 rounded-full bg-linear-to-r from-secondary to-primary"></div>
		</div>
		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each blogPosts as post (post.id)}
				<BlogPostCard {post} />
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