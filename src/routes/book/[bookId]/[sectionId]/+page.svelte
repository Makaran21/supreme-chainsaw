<script lang="ts">
	import { EdraEditor } from '$lib/components/edra/shadcn/index.js';
	import type { Section } from '$lib/server/db/schema.js';
	import { marked } from 'marked';
	export let data;

	const section = data.section as Section;
	const htmlContent = data.markdownContent as string;

	const markdownContent = marked(section.content);
</script>

<article class="prose max-w-none text-black prose-neutral rounded">
	<!-- <h1 class="mb-4 text-3xl font-bold">{section.title}</h1> -->
	 <EdraEditor />
	{@html markdownContent}
</article>
