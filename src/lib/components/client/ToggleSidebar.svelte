<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import { cn } from '$lib/utils.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		hideWhenOpen = false, // new prop
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
		hideWhenOpen?: boolean;
	} = $props();

	const sidebar = useSidebar();
	const isOpen = $derived(sidebar.isMobile ? sidebar.openMobile : sidebar.open);
</script>

{#if !(hideWhenOpen && isOpen)}
	<div class="flex items-center gap-2">
		<Button
			data-sidebar="trigger"
			data-slot="sidebar-trigger"
			variant="outline"
			size="icon"
			class={cn('size-8 cursor-pointer', className)}
			type="button"
			onclick={(e) => {
				onclick?.(e);
				sidebar.toggle();
			}}
			{...restProps}
		>
			{#if isOpen}
				<ChevronLeft />
			{:else}
				<PanelLeft />
			{/if}
			<span class="sr-only">Toggle Sidebar</span>
		</Button>
	</div>
{/if}
