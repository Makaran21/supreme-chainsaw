<script lang="ts">
	import {
		GripVertical,
		Plus,
		Trash2,
		FileText,
		Heading1,
		Image,
		Video,
		Type
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import BlockImage from './BlockImage.svelte';
	import BlockMarkdown from './BlockMarkdown.svelte';
	import BlockSectionTitle from './BlockSectionTitle.svelte';
	import BlockVideo from './BlockVideo.svelte';
	import { type Block } from '$lib/server/db/schema';

	type BlockType = 'markdown' | 'heading' | 'image' | 'video' | 'section-title';

	const blockTypeConfig = {
		markdown: { icon: FileText, label: 'Markdown', color: 'text-blue-600' },
		heading: { icon: Heading1, label: 'Heading', color: 'text-purple-600' },
		image: { icon: Image, label: 'Image', color: 'text-green-600' },
		video: { icon: Video, label: 'Video', color: 'text-red-600' },
		'section-title': { icon: Type, label: 'Section Title', color: 'text-yellow-600' }
	};

	let blocks: Block[] = $state([
		{ type: 'section-title', name: 'intro', value: 'Introduction to React', order: 0 },
		{
			type: 'markdown',
			name: 'content-1',
			value: 'React is a JavaScript library for building user interfaces...',
			order: 1
		},
		{ type: 'heading', name: 'heading-1', value: 'Getting Started', order: 2 },
		{
			type: 'image',
			name: 'image-1',
			value: 'https://example.com/react-logo.png',
			order: 3,
			additionalData: { alt: 'React Logo' }
		},
		{ type: 'video', name: 'video-1', value: 'https://example.com/tutorial.mp4', order: 4 }
	]);

	let draggedIndex: number | null = $state(null);
	let dropdownOpen = $state(false);

	const sortedBlocks = $derived([...blocks].sort((a, b) => a.order - b.order));

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		const newBlocks = [...blocks];
		const draggedBlock = newBlocks[draggedIndex];
		newBlocks.splice(draggedIndex, 1);
		newBlocks.splice(index, 0, draggedBlock);

		newBlocks.forEach((block, i) => {
			block.order = i;
		});

		blocks = newBlocks;
		draggedIndex = index;
	}

	function handleDragEnd() {
		draggedIndex = null;
	}

	function addBlock(type: BlockType) {
		const newBlock: Block = {
			type,
			name: `${type}-${Date.now()}`,
			value: '',
			order: blocks.length,
			additionalData: {}
		};
		blocks = [...blocks, newBlock];
		dropdownOpen = false;
	}

	function deleteBlock(index: number) {
		blocks = blocks.filter((_, i) => i !== index).map((block, i) => ({ ...block, order: i }));
	}

	function saveBlocks() {
		console.log('Saving blocks:', blocks);
		// Here you would save to your database
		alert('Blocks saved! Check console for data.');
	}
</script>

<div class="container mx-auto max-w-5xl p-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Block Editor</h1>
		<div class="flex gap-2">
			<Button variant="outline" onclick={saveBlocks}>Save</Button>
			<DropdownMenu bind:open={dropdownOpen}>
				<DropdownMenuTrigger>
					<Button class="gap-2">
						<Plus class="h-4 w-4" />
						Add Block
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{#each Object.entries(blockTypeConfig) as [type, config]}
						<DropdownMenuItem onclick={() => addBlock(type as BlockType)}>
							<svelte:component this={config.icon} class="mr-2 h-4 w-4 {config.color}" />
							{config.label}
						</DropdownMenuItem>
					{/each}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>

	<div class="block-list mx-auto space-y-3">
		{#each sortedBlocks as block, index (block.order)}
			<Card
				class="group relative transition-all {draggedIndex === index ? 'opacity-50' : ''}"
				draggable="true"
				ondragstart={() => handleDragStart(index)}
				ondragover={(e) => handleDragOver(e, index)}
				ondragend={handleDragEnd}
			>
				<!-- Drag handle and controls -->
				<div
					class="absolute top-0 bottom-0 left-0 flex flex-col items-center justify-between border-r bg-muted/50 p-2 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<button class="cursor-move touch-none rounded p-1 hover:bg-muted">
						<GripVertical class="h-4 w-4 text-muted-foreground" />
					</button>

					<div class="flex flex-col gap-1">
						<div class="flex h-6 w-6 items-center justify-center">
							<svelte:component
								this={blockTypeConfig[block.type].icon}
								class="h-3.5 w-3.5 {blockTypeConfig[block.type].color}"
							/>
						</div>
						<Button variant="ghost" size="icon" class="h-6 w-6" onclick={() => deleteBlock(index)}>
							<Trash2 class="h-3.5 w-3.5 text-destructive" />
						</Button>
					</div>
				</div>

				<!-- Block content with left padding for controls -->
				<div class="p-4 pl-12">
					{#if block.type === 'markdown'}
						<BlockMarkdown {block} />
					{:else if block.type === 'image'}
						<BlockImage {block} />
					{:else if block.type === 'video'}
						<BlockVideo {block} />
					{:else if block.type === 'section-title'}
						<BlockSectionTitle {block} />
					{/if}
				</div>

				<!-- Order badge -->
				<div
					class="absolute top-2 right-2 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
				>
					#{block.order}
				</div>
			</Card>
		{/each}

		{#if blocks.length === 0}
			<div class="rounded-lg border-2 border-dashed py-12 text-center text-muted-foreground">
				<p>No blocks yet. Click "Add Block" to get started.</p>
			</div>
		{/if}
	</div>
</div>
