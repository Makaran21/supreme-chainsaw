<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import { cn } from '$lib/utils.js';
	import AlignStartVertical from '@lucide/svelte/icons/align-start-vertical';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		title,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<div class="flex items-center gap-2">
	<Button
		data-sidebar="trigger"
		data-slot="sidebar-trigger"
		variant="outline"
		size="icon"
		class={cn(' w-fit px-2 cursor-pointer', className)}
		type="button"
		onclick={(e) => {
			onclick?.(e);
			sidebar.toggle();
		}}
		{...restProps}
	>
		<AlignStartVertical />
		{title}
		<span class="sr-only">Toggle Sidebar</span>
	</Button>
</div>
