<script lang="ts">
	import ToggleSidebar from "$lib/components/client/ToggleSidebar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeft, BookOpen } from "@lucide/svelte";

	export let data

	const { book } = data;
</script>

<!-- /routes/book/[bookId]/+page.svelte -->

<div class="flex w-full items-center justify-between border-b border-gray-200 bg-background/80 px-2 py-2 backdrop-blur-sm">
	<ToggleSidebar hideWhenOpen class="font-semibold text-lg text-foreground/80" />
	<Button href="/" variant="link" class="text-black">
		<ArrowLeft />
		ទំព័រដើម
	</Button>
</div>

<section class="flex min-h-[100vh - 6rem] items-center justify-center p-4">
	<div class="mx-auto w-full rounded border border-gray-200 bg-card p-10 text-center shadow-sm transition-shadow hover:shadow-md">
		<div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
			<BookOpen class="h-12 w-12" />
		</div>

		<h2 class="mb-3 text-3xl font-bold tracking-tight text-foreground">
			Start Reading
		</h2>

		<p class="mb-8 text-muted-foreground">
			Select a section from the table of contents to begin your journey.
		</p>

		<Button href="/book/{book.id}/{book.chapters[0].id}" variant="default" class="mx-auto mt-2">
			Start Reading
		</Button>
	</div>
</section>
