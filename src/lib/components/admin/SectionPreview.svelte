<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable';
	import type { Content } from '@tiptap/core';
	import SectionPreviewLayout from './SectionPreviewLayout.svelte';
	import { EdraEditor } from '../edra/shadcn';

	type Props = {
		content?: Content;
	};

	const { content }: Props = $props();
</script>

<!-- 
<div class="@container flex h-full flex-col rounded border-0 sm:border w-full">
	<div class="border-b bg-secondary/50 p-2 font-semibold">Preview</div>
	<SectionPreviewLayout>
		<EdraEditor {content} editable={false} class="prose prose-slate max-w-none" />
	</SectionPreviewLayout>
</div> -->

<Resizable.PaneGroup direction="horizontal" class="flex-1">
	<Resizable.Pane defaultSize={100} minSize={20}>
		<div class="@container flex h-full w-full flex-col rounded border-0 sm:border">
			<div class="border-b bg-secondary/50 p-2 font-semibold">Preview</div>
			<SectionPreviewLayout>
				<EdraEditor {content} editable={false} class="prose prose-slate max-w-none" />
			</SectionPreviewLayout>
		</div>
	</Resizable.Pane>
	<Resizable.Handle class="bg-transparent hidden sm:flex" withHandle />
	<Resizable.Pane defaultSize={0} minSize={0} />
</Resizable.PaneGroup>
