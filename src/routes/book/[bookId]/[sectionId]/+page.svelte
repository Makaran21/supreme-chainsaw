<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import SectionPreviewLayout from '$lib/components/admin/SectionPreviewLayout.svelte';
	import SectionLoading from '$lib/components/client/SectionLoading.svelte';
	import ToggleSidebar from '$lib/components/client/ToggleSidebar.svelte';
	import { EdraEditor } from '$lib/components/edra/shadcn/index.js';
	import { Button } from '$lib/components/ui/button';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { cn } from '$lib/utils.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { data } = $props();

	const { content, title } = data.section;

	let isLoading = $state(true); // Start as true

	beforeNavigate(() => {
		isLoading = true;
	});

	afterNavigate(() => {
		setTimeout(() => {
			isLoading = false;
		}, 200);
	});

	$effect(() => {
		if (browser && content) {
			isLoading = true;
			const timer = setTimeout(() => {
				isLoading = false;
			}, 0);

			return () => clearTimeout(timer);
		}
	});

	const sidebar = useSidebar();
</script>

<div
	class={cn(
		'fixed z-50 flex h-14 w-full flex-row items-center justify-between bg-background p-2 shadow sm:px-4',
		sidebar.open && 'sm:w-[calc(100vw-22rem)]'
	)}
>
	<div class="flex items-center justify-start gap-2 text-sm">
		<ToggleSidebar hideWhenOpen />
		<span class="font-semibold">{title}</span>
	</div>
	<Button href="/" variant="link" class="text-black">
		<ArrowLeft />
		ទំព័រដើម
	</Button>
</div>

<article
	class="mt-12 max-w-none rounded p-0 pt-2 pb-2 text-black sm:mt-15.5 sm:px-4 sm:pt-2 sm:pb-4"
>
	<div class="flex w-full flex-col rounded border-0 sm:border">
		<SectionPreviewLayout>
			{#if isLoading}
				<SectionLoading />
			{:else if !browser}
				{@html content}
			{:else}
				<EdraEditor {content} editable={false} class="prose prose-slate max-w-none" />
			{/if}
		</SectionPreviewLayout>
	</div>
</article>
