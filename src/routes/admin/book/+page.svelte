<script lang="ts">
	import BookPanel from '$lib/components/admin/BookPanel.svelte';

	export let data;

	const books = data.books;
</script>

<BookPanel {books} />
