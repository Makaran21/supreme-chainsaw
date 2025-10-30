<script lang="ts">
	import Grid, { GridItem } from 'svelte-grid-extended';

	const items = [
		{ id: 'Image/Video', x: 0, y: 0, w: 2, h: 2 },
		{ id: 'Acrticle', x: 0, y: 2, w: 2, h: 2 },
		{ id: '2', x: 0, y: 4, w: 2, h: 2 },
		{ id: '3', x: 0, y: 6, w: 2, h: 2 },
	];
</script>

<Grid class="grid-container w-[500px]" cols={4} rows={12}>
	{#each items as item}
		<GridItem
			x={item.x}
			y={item.y}
			w={item.w}
			h={item.h}
			class="grid-item"
			activeClass="grid-item-active"
			previewClass="bg-green-500 rounded"
		>
			<div class="item">{item.id}</div>
		</GridItem>
	{/each}
</Grid>

<style>
	.item {
		display: grid;
		place-items: center;
		background-color: rgb(150, 150, 150);
		width: 100%;
		height: 100%;
	}

	:global(.grid-container) {
		opacity: 0.7;
	}

	:global(.grid-item) {
		transition: width 4s, height 4s;
		transition: transform 4s, opacity 4s;
	}

	:global(.grid-item-active) {
		opacity: 0.1;
	}

	/* tailwind classes */
	:global(.bg-green-500) {
		background-color: rgb(33, 202, 33);
	}

	:global(.rounded) {
		border-radius: 0.25rem;
	}
</style>