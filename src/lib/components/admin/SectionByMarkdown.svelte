<script lang="ts">
	import type { Section } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';
	import type { Content } from '@tiptap/core';
	import type { Editor } from 'svelte-tiptap';
	import SectionActionBar from './SectionActionBar.svelte';
	import SectionContentEditor from './SectionContentEditor.svelte';
	import SectionPreview from './SectionPreview.svelte';

	const { section }: { section: Section } = $props();

	let content = $state<Content>(section.content);
	let htmlContent = $state();
	let editor = $state<Editor>();
	let showPreview = $state(false);

	function onUpdate() {
		content = editor?.getJSON() as Content;
	}

	function togglePreview() {
		htmlContent = editor?.getHTML();
		showPreview = !showPreview;
	}
</script>

<div class={cn('flex gap-4', showPreview ? 'p-0 pt-4 sm:p-4' : 'h-[calc(100vh-3rem)] p-4')}>
	<SectionActionBar {content} {showPreview} onTogglePreviewHandler={togglePreview} />
	<SectionContentEditor bind:editor {content} {onUpdate} hidden={showPreview} />
	{#if showPreview}
		<SectionPreview {content} />
	{/if}
</div>
