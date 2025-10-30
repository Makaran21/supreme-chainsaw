<script lang="ts">
    import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
    import { AspectRatio } from '$lib/components/ui/aspect-ratio';
    import { Button } from '$lib/components/ui/button';
	import type { Block } from '$lib/server/db/schema';
	import { Pause, Play, VolumeX, Volume2 } from '@lucide/svelte';
    
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
        <div class="relative w-full h-full">
          <video 
            bind:this={videoElement}
            src={block.value}
            controls={controls}
            autoplay={autoplay}
            loop={loop}
            muted={isMuted}
            poster={poster}
            class="w-full h-full object-cover"
            onplay={() => isPlaying = true}
            onpause={() => isPlaying = false}
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
          
          {#if !controls}
            <div class="absolute bottom-4 left-4 right-4 flex gap-2">
              <Button 
                variant="secondary" 
                size="icon"
                onclick={togglePlay}
                class="h-8 w-8"
              >
                {#if isPlaying}
                  <Pause class="h-4 w-4" />
                {:else}
                  <Play class="h-4 w-4" />
                {/if}
              </Button>
              <Button 
                variant="secondary" 
                size="icon"
                onclick={toggleMute}
                class="h-8 w-8"
              >
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