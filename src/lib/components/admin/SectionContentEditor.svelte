<script lang="ts">
	import { EdraDragHandleExtended, EdraEditor, EdraToolBar } from '$lib/components/edra/shadcn';
	import type { Content, Editor } from '@tiptap/core';

	export let content: Content | undefined;
	export let editor: Editor | undefined;
	export let onUpdate: () => void;
	export let hidden = false;
</script>

<div class="flex flex-1 flex-col rounded-md border {hidden ? 'hidden' : ''}">
	{#if editor && !editor.isDestroyed}
		<EdraToolBar class="border-b border-dashed bg-secondary/50 p-0.5" {editor} />
		<EdraDragHandleExtended {editor} />
	{/if}
	<EdraEditor bind:editor {content} class="flex-1 overflow-y-auto p-4" {onUpdate} />
</div>
