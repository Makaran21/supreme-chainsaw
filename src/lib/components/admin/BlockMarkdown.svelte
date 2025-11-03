<script lang="ts">
	import { EdraDragHandleExtended, EdraEditor, EdraToolBar } from '$lib/components/edra/shadcn';
	import { Button } from '$lib/components/ui/button';
	import type { Block } from '$lib/server/db/schema';
	import Eye from '@lucide/svelte/icons/eye';
	import Pencil from '@lucide/svelte/icons/pencil';
	import type { Content, Editor } from '@tiptap/core';

	interface Props {
		block: Block;
		onUpdate?: (value: string) => void;
	}

	let { block, onUpdate }: Props = $props();

	let isEditing = $state(false);
	let editor: Editor | undefined = $state();
	let content: Content = $state(block.value);

	function toggleEdit() {
		if (isEditing && editor) {
			const htmlContent = editor.getHTML();
			if (htmlContent !== block.value) {
				onUpdate?.(htmlContent);
			}
		}
		isEditing = !isEditing;
	}

	function handleUpdate() {
		if (editor) {
			content = editor?.getJSON();
		}
	}
</script>

<div class="markdown-block group relative" data-order={block.order}>
	<div class="absolute right-2 bottom-2 z-10">
		<Button
			variant="ghost"
			size="icon"
			class="opacity-0 transition-opacity group-hover:opacity-100"
			onclick={toggleEdit}
		>
			{#if isEditing}
				<Eye class="h-4 w-4" />
			{:else}
				<Pencil class="h-4 w-4" />
			{/if}
		</Button>
	</div>

	{#if isEditing}
		<div class="flex flex-1 flex-col rounded-md border">
			{#if editor && !editor.isDestroyed}
				<EdraToolBar class="border-b border-dashed bg-secondary/50 p-0.5" {editor} />
				<EdraDragHandleExtended {editor} />
			{/if}
			<EdraEditor
				bind:editor
				{content}
				class="flex-1 overflow-y-auto p-4"
				onUpdate={handleUpdate}
			/>
		</div>
	{:else}
		<div>
			<EdraEditor {content} editable={false} class="prose prose-slate max-w-none" />
		</div>
	{/if}
</div>
