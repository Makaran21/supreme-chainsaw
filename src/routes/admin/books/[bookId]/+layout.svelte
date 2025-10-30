<script lang="ts">
	import AdminBookSidebar from '$lib/components/admin/AdminBookSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	export let data

</script>

<Sidebar.Provider style="--sidebar-width: 22rem;">
	<AdminBookSidebar book={data.book} />
	<main class="grow">
		<Sidebar.Trigger class="mx-4 mt-4" />
		<slot />
	</main>
</Sidebar.Provider>
