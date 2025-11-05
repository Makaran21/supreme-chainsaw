<script lang="ts">
	import BookSidebar from '$lib/components/admin/BookSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	export let data;
</script>

<Sidebar.Provider style="--sidebar-width: 22rem;">
	<BookSidebar book={data.book} />
	<main class="grow">
		<div class="mx-4 mt-4 flex flex-row items-center justify-start gap-2">
			<Sidebar.Trigger />
		</div>
		{#key data.sectionId}
			<slot />
		{/key}
	</main>
</Sidebar.Provider>
