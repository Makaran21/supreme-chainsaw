<script lang="ts">
	import { onMount } from 'svelte';
	let iframe: HTMLIFrameElement;
	let slotHTML = '';
	let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';

	const widths = {
		mobile: '375px',
		tablet: '768px',
		desktop: '100%',
	};

	onMount(() => {
		const slotEl = document.querySelector('[data-preview-slot]');
		if (slotEl) {
			slotHTML = slotEl.innerHTML;
			updateIframe();
		}
	});

	function updateIframe() {
		if (!iframe) return;
		const doc = iframe.contentDocument;
		if (!doc) return;

		doc.open();
		doc.write(`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<link rel="stylesheet" href="/app.css">
				</head>
				<body class="bg-white">
					${slotHTML}
				</body>
			</html>
		`);
		doc.close();
	}
</script>

<div class="flex items-center gap-2 mb-3">
	<button on:click={() => (device = 'mobile')} class="border rounded px-2 py-1">Mobile</button>
	<button on:click={() => (device = 'tablet')} class="border rounded px-2 py-1">Tablet</button>
	<button on:click={() => (device = 'desktop')} class="border rounded px-2 py-1">Desktop</button>
</div>

<div class="border rounded overflow-hidden bg-gray-100 flex justify-center">
	<iframe
		bind:this={iframe}
		style="width: {widths[device]}; height: 800px; border: none;"
		title="Responsive preview"
	></iframe>

	<!-- hidden slot to extract HTML -->
	<div class="hidden" data-preview-slot>
		<slot />
	</div>
</div>
