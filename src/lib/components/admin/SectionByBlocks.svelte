<script lang="ts">
	import { type Block } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';
	import BlockList from './BlockList.svelte';
	let showPreview = $state(false);

	let { blocks }: { blocks: Block[] } = $props();
</script>

<div class={cn('', showPreview ? 'p-4' : 'p-4')}>
	<BlockList {blocks} />
</div>
