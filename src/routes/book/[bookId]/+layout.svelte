<!-- /routes/book/[bookId]/+layout.svelte -->
<script lang="ts">
	import ClientBookSidebar from '$lib/components/client/ClientBookSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: book = data.book;
	$: currentSectionId = data.currentSectionId;
</script>

<svelte:head>
	<title>{book.title || 'Book Reader'}</title>
</svelte:head>

<Sidebar.Provider style="--sidebar-width: 22rem;">
	<ClientBookSidebar {book} {currentSectionId} />
	<main class="grow">
		{#key currentSectionId}
			<slot />
		{/key}
	</main>
</Sidebar.Provider>
