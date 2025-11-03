<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import SectionPreviewLayout from '$lib/components/admin/SectionPreviewLayout.svelte';
	import SectionLoading from '$lib/components/client/SectionLoading.svelte';
	import ToggleSidebar from '$lib/components/client/ToggleSidebar.svelte';
	import { EdraEditor } from '$lib/components/edra/shadcn/index.js';
	import { Button } from '$lib/components/ui/button';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { data } = $props();

	const { content, title } = data.section;

	let isLoading = $state(false);

	beforeNavigate(() => {
		isLoading = true;
	});

	afterNavigate(() => {
		isLoading = false;
	});
</script>

<div class="flex w-full items-center justify-between px-2 pt-2 sm:px-4">
	<div class="flex items-center justify-start gap-2 text-sm">
		<ToggleSidebar hideWhenOpen />
		<span class="font-semibold">{title}</span>
	</div>
	<Button href="/" variant="link" class="text-black">
		<ArrowLeft />
		ទំព័រដើម
	</Button>
</div>
<article class="max-w-none rounded p-0 pt-2 text-black sm:px-4 sm:pt-2">
	<div class="flex w-full flex-col rounded border-0 border-t border-b sm:border">
		<SectionPreviewLayout>
			{#if isLoading}
				<SectionLoading />
			{:else if browser}
				<EdraEditor {content} editable={false} class="prose prose-slate max-w-none" />
			{:else}
				{@html content}
			{/if}
		</SectionPreviewLayout>
	</div>
</article>
