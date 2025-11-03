<script lang="ts">
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import type { Block } from '$lib/server/db/schema';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';

	interface Props {
		block: Block;
	}

	let { block }: Props = $props();

	let videoElement = $state<HTMLVideoElement>();
	let isPlaying = $state(false);
	let isMuted = $state(block.additionalData?.muted === 'true');

	const autoplay = $derived(block.additionalData?.autoplay === 'true');
	const controls = $derived(block.additionalData?.controls !== 'false');
	const loop = $derived(block.additionalData?.loop === 'true');
	const poster = $derived(block.additionalData?.poster);
	const caption = $derived(block.additionalData?.caption);
	const aspectRatio = $derived(block.additionalData?.aspectRatio || '16/9');

	function togglePlay() {
		if (videoElement) {
			if (isPlaying) {
				videoElement.pause();
			} else {
				videoElement.play();
			}
			isPlaying = !isPlaying;
		}
	}

	function toggleMute() {
		if (videoElement) {
			videoElement.muted = !isMuted;
			isMuted = !isMuted;
		}
	}
</script>

<Card class="video-block overflow-hidden" data-order={block.order}>
	<CardContent class="p-0">
		<AspectRatio ratio={1}>
			<div class="relative h-full w-full">
				<video
					bind:this={videoElement}
					src={block.value}
					{controls}
					{autoplay}
					{loop}
					muted={isMuted}
					{poster}
					class="h-full w-full object-cover"
					onplay={() => (isPlaying = true)}
					onpause={() => (isPlaying = false)}
				>
					<track kind="captions" />
					Your browser does not support the video tag.
				</video>

				{#if !controls}
					<div class="absolute right-4 bottom-4 left-4 flex gap-2">
						<Button variant="secondary" size="icon" onclick={togglePlay} class="h-8 w-8">
							{#if isPlaying}
								<Pause class="h-4 w-4" />
							{:else}
								<Play class="h-4 w-4" />
							{/if}
						</Button>
						<Button variant="secondary" size="icon" onclick={toggleMute} class="h-8 w-8">
							{#if isMuted}
								<VolumeX class="h-4 w-4" />
							{:else}
								<Volume2 class="h-4 w-4" />
							{/if}
						</Button>
					</div>
				{/if}
			</div>
		</AspectRatio>
	</CardContent>
	{#if caption}
		<CardFooter class="flex justify-center py-3">
			<p class="text-sm text-muted-foreground italic">{caption}</p>
		</CardFooter>
	{/if}
</Card>
