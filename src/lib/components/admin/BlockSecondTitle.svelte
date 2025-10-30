<script lang="ts">
    import { Input } from '$lib/components/ui/input';
    import type { Block } from '$lib/server/db/schema';
    
    interface Props {
      block: Block;
      onUpdate?: (value: string) => void;
    }
    
    let { block, onUpdate }: Props = $props();
    
    let isEditing = $state(false);
    let editValue = $state(block.value);
    
    function handleBlur() {
      if (editValue !== block.value) {
        onUpdate?.(editValue);
      }
      isEditing = false;
    }
    
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleBlur();
      } else if (e.key === 'Escape') {
        editValue = block.value;
        isEditing = false;
      }
    }
    
    function handleClick() {
      isEditing = true;
    }
    </script>
    
    <div class="px-2" data-order={block.order}>
      <div class="relative flex items-center h-4">
        <div class="absolute -left-2 size-4 rounded-full bg-teal-300"></div>
        <div class="grow h-1 bg-sky-400 rounded-full"></div>
      </div>
      
      <div class="flex items-center justify-between text-2xl font-bold">
        {#if isEditing}
          <Input
            bind:value={editValue}
            onblur={handleBlur}
            onkeydown={handleKeydown}
            class="text-gray-800 text-lg font-normal h-auto border-0 px-0 focus-visible:ring-0"
            autofocus
          />
        {:else}
          <p 
            class="text-gray-800 text-lg cursor-text hover:bg-muted/50 px-1 rounded transition-colors w-full"
            onclick={handleClick}
          >
            {editValue}
          </p>
        {/if}
        
        <div class="flex gap-0">
          <div class="size-4 rounded-full bg-sky-400"></div>
          <div class="size-4 rounded-full bg-sky-400"></div>
        </div>
      </div>
      
      <div class="relative flex items-center h-4">
        <div class="absolute -left-2 size-4 rounded-full bg-teal-300"></div>
        <div class="grow h-1 bg-sky-400 rounded-full"></div>
      </div>
    </div>