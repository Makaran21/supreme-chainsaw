<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Eye from '@lucide/svelte/icons/eye';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Save from '@lucide/svelte/icons/save';

	import type { Content } from '@tiptap/core';

	export let content: Content | undefined;
	export let showPreview: boolean;
	export let onTogglePreviewHandler: () => void;

	let form: HTMLFormElement;
</script>

<form method="post" use:enhance action="?/save" bind:this={form}>
	<input type="hidden" name="content" value={JSON.stringify(content)} />

	<div class="fixed top-2.5 right-4 flex items-center gap-2">
		<Button
			variant="outline"
			onclick={onTogglePreviewHandler}
			title={showPreview ? 'Show Editor' : 'Show Preview'}
			class="flex w-40 items-center justify-center gap-2 hover:cursor-pointer"
		>
			{#if showPreview}
				<Pencil size={16} />
				<span>Show Editor</span>
			{:else}
				<Eye size={16} />
				<span>Show Preview</span>
			{/if}
		</Button>

		<Button
			type="submit"
			variant="default"
			class="flex items-center gap-2 hover:cursor-pointer"
			title="Save changes"
		>
			<Save size={16} />
			<span>Save</span>
		</Button>
	</div>
</form>
