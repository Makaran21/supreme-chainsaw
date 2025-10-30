<!-- /routes/book/[bookId]/+layout.svelte -->
<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: currentBook = data.book;
	$: chapters = data.chapters;
	$: currentSectionId = data.currentSectionId;
</script>

<svelte:head>
	<title>{currentBook?.title || 'Book Reader'}</title>
</svelte:head>

<div class="flex h-screen bg-gray-50">
	<aside class="w-80 overflow-y-auto border-r border-gray-200 bg-white">
		<div class="p-6">
			<h3 class="mb-4 text-lg font-bold text-gray-900">Table of Contents</h3>

			{#each chapters as chapter}
				<div class="mb-4">
					<div class="mb-2 flex items-center font-semibold text-gray-800">
						<span class="mr-2 text-blue-600">{chapter.orderIndex}.</span>
						{chapter.title}
					</div>

					{#if chapter.sections && chapter.sections.length > 0}
						<ul class="ml-6 space-y-1">
							{#each chapter.sections as section}
								<li>
									<a
										href="/book/{currentBook?.id}/{section.id}"
										class="block rounded px-3 py-2 text-sm transition {currentSectionId ===
										section.id
											? 'bg-blue-100 font-medium text-blue-700'
											: 'text-gray-600 hover:bg-gray-100'}"
										data-sveltekit-preload
									>
										{section.orderIndex}. {section.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</aside>
	<main class="flex-1 overflow-y-auto p-4">
		{#key currentSectionId}
			<slot />
		{/key}
	</main>
</div>
