<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import SectionPreviewLayout from '$lib/components/admin/SectionPreviewLayout.svelte';
	import ToggleSidebar from '$lib/components/client/ToggleSidebar.svelte';
	import { EdraEditor } from '$lib/components/edra/shadcn/index.js';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Loader2 } from '@lucide/svelte';

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

<div class="flex w-full items-center justify-between pt-4">
	<ToggleSidebar {title} class="mx-4" />
	<Button href="/" variant="link">
		<ArrowLeft />
		Back to home page
	</Button>
</div>
<article class="max-w-none rounded p-0 pt-4 text-black sm:p-4">
	<div class="flex w-full flex-col rounded border-0 border-t border-b sm:border">
		<!-- Actual content -->
		<SectionPreviewLayout>
			{#if isLoading}
				<div class="flex min-h-[calc(100vh-13rem)] items-center justify-center">
					<div class="relative">
						<div class="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
						<div
							class="relative flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 shadow-lg"
						>
							<Loader2 class="h-6 w-6 animate-spin text-white" />
						</div>
					</div>
				</div>
			{:else if browser}
				<EdraEditor {content} editable={false} class="prose prose-slate max-w-none" />
			{:else}
				{@html content}
			{/if}
		</SectionPreviewLayout>
	</div>
</article>
