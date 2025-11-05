<script lang="ts">
	import Grid, { GridItem, type LayoutChangeDetail } from 'svelte-grid-extended';

	let items = [
		{ id: 'Image/Video', x: 0, y: 0, w: 4, h: 6 },
		{ id: 'Markdown', x: 0, y: 6, w: 2, h: 2 }
	];

	let nextId = 1;

	function addBlock() {
		const newBlock = {
			id: `Block ${nextId}`,
			x: 0,
			y: items.length * 2,
			w: 2,
			h: 2
		};
		items = [...items, newBlock];
		nextId++;
	}

	function logBlocksData() {
		// console.log('Current blocks data:', items);
	}

	function handleChange(data: CustomEvent<LayoutChangeDetail>) {
        const updatedBlock = { ...data.detail.item };
        const index = items.findIndex(item => item.id === updatedBlock.id);
        if (index !== -1) {
            items[index] = updatedBlock;
            items = [...items]; // Trigger reactivity
        }
    }
</script>

<div class="flex w-full flex-col">
	<div class="controls">
		<button on:click={addBlock} class="btn">Add Block</button>
		<button on:click={logBlocksData} class="btn btn-log">Console Log Blocks</button>
	</div>

	<Grid
		on:change={handleChange}
		itemSize={{ height: 25 }}
		class="grid-container bg-amber-200"
		cols={8}
		rows={0}
	>
		{#each items as item}
			<GridItem
				id={item.id}
				x={item.x}
				y={item.y}
				w={item.w}
				h={item.h}
				class="grid-item"
				activeClass="grid-item-active"
				previewClass="bg-green-500 rounded"
			>
				<div class="item resize overflow-hidden">
					{#if item.id === 'Image/Video'}
						<img
							src="https://picsum.photos/id/237/400/300"
							class="h-full w-full object-cover"
							alt="Cute dog lying on the floor"
							draggable="false"
							on:dragstart|preventDefault
						/>
					{:else}
						<span class="block-label">{item.id}</span>
					{/if}
				</div>
			</GridItem>
		{/each}
	</Grid>
</div>

<style>
	.controls {
		margin-bottom: 1rem;
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		background-color: rgb(59, 130, 246);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.btn:hover {
		background-color: rgb(37, 99, 235);
	}

	.btn-log {
		background-color: rgb(107, 114, 128);
	}

	.btn-log:hover {
		background-color: rgb(75, 85, 99);
	}

	.item {
		display: grid;
		place-items: center;
		background-color: rgb(150, 150, 150);
		width: 100%;
		height: 100%;
	}

	.block-label {
		color: white;
		font-weight: 500;
	}

	:global(.grid-container) {
		opacity: 0.7;
	}

	:global(.grid-item) {
		transition:
			width 4s,
			height 4s;
		transition:
			transform 4s,
			opacity 4s;
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
