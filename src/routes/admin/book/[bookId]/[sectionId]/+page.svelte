<script lang="ts">
	import { page } from '$app/state';

	import SectionByBlocks from '$lib/components/admin/SectionByBlocks.svelte';
	import SectionByMarkdown from '$lib/components/admin/SectionByMarkdown.svelte';

	$: mode = page.url.searchParams.get('mode');

	export let data;

	const section = data.section;
</script>

{#if mode === 'blocks'}
	<SectionByBlocks blocks={[]} />
{/if}
{#if mode === 'markdown'}
	<SectionByMarkdown {section} />
{/if}
