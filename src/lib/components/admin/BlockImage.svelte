<script lang="ts">
  import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
  import { AspectRatio } from '$lib/components/ui/aspect-ratio';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Slider } from '$lib/components/ui/slider';
  import type { Block } from '$lib/server/db/schema';
	import { Upload, Maximize2, ImageIcon } from '@lucide/svelte';
  
  interface Props {
    block: Block;
    onUpdate?: (value: string, additionalData?: Record<string, string>) => void;
  }
  
  let { block, onUpdate }: Props = $props();
  
  const alt = $derived(block.additionalData?.alt || block.name);
  const caption = $derived(block.additionalData?.caption);
  const width = $derived(block.additionalData?.width);
  const height = $derived(block.additionalData?.height);
  
  let aspectRatio = $state(parseFloat(block.additionalData?.aspectRatio || '1'));
  let imageUrl = $state(block.value);
  let showUpload = $state(false);
  let fileInput: HTMLInputElement;
  let isResizing = $state(false);
  
  function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        imageUrl = result;
        onUpdate?.(result, {
          ...block.additionalData,
          aspectRatio: aspectRatio.toString()
        });
        showUpload = false;
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  function triggerFileInput() {
    fileInput?.click();
  }
  
  function handleAspectRatioChange(value: number[]) {
    aspectRatio = value[0];
  }
  
  function saveAspectRatio() {
    onUpdate?.(imageUrl, {
      ...block.additionalData,
      aspectRatio: aspectRatio.toString()
    });
    isResizing = false;
  }
  
  function toggleResize() {
    isResizing = !isResizing;
    if (!isResizing) {
      saveAspectRatio();
    }
  }
  </script>
  
  <Card class="image-block group relative overflow-hidden p-0 rounded gap-0" data-order={block.order}>
    <div class="absolute right-2 top-2 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        variant="secondary"
        size="icon"
        class="h-8 w-8"
        onclick={() => showUpload = !showUpload}
      >
        <Upload class="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        class="h-8 w-8"
        onclick={toggleResize}
      >
        <Maximize2 class="h-4 w-4" />
      </Button>
    </div>
  
    <CardContent class="p-0">
      {#if showUpload}
        <div class="flex flex-col items-center justify-center p-8 space-y-4 bg-muted/50">
          <input
            bind:this={fileInput}
            type="file"
            accept="image/*"
            onchange={handleFileUpload}
            class="hidden"
          />
          <Button
            variant="outline"
            size="lg"
            onclick={triggerFileInput}
            class="flex items-center gap-2"
          >
            <ImageIcon class="h-5 w-5" />
            Choose Image
          </Button>
          <p class="text-sm text-muted-foreground">or</p>
          <div class="w-full space-y-2">
            <Label for="image-url">Image URL</Label>
            <div class="flex gap-2">
              <Input
                id="image-url"
                bind:value={imageUrl}
                placeholder="https://example.com/image.jpg"
                class="flex-1"
              />
              <Button
                onclick={() => {
                  onUpdate?.(imageUrl, block.additionalData);
                  showUpload = false;
                }}
              >
                Load
              </Button>
            </div>
          </div>
        </div>
      {:else}
        <AspectRatio ratio={aspectRatio}>
          <img 
            src={imageUrl} 
            alt={alt}
            class="object-cover w-full h-full"
            {width}
            {height}
          />
        </AspectRatio>
      {/if}
    </CardContent>
  
    {#if isResizing}
      <CardFooter class="flex flex-col gap-3 py-4">
        <div class="w-full space-y-2">
          <Label for="aspect-ratio">
            Aspect Ratio: {aspectRatio.toFixed(2)} ({aspectRatio > 1 ? 'Landscape' : aspectRatio < 1 ? 'Portrait' : 'Square'})
          </Label>
          <Slider
            id="aspect-ratio"
            min={0.5}
            max={3}
            type='multiple'
            step={0.1}
            value={[aspectRatio]}
            onValueChange={handleAspectRatioChange}
          />
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>Portrait (0.5)</span>
            <span>Square (1.0)</span>
            <span>Landscape (3.0)</span>
          </div>
        </div>
        <div class="flex gap-2">
          <Button size="sm" onclick={saveAspectRatio}>Apply</Button>
          <Button 
            size="sm" 
            variant="outline" 
            onclick={() => {
              aspectRatio = parseFloat(block.additionalData?.aspectRatio || '1');
              isResizing = false;
            }}
          >
            Cancel
          </Button>
        </div>
      </CardFooter>
    {:else if caption}
      <CardFooter class="flex justify-center py-1">
        <p class="text-sm text-muted-foreground italic">{caption}</p>
      </CardFooter>
    {/if}
  </Card>