<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import type { Block } from '$lib/server/db/schema';

  interface Props {
    block: Block;
    onUpdate?: (value: string) => void;
  }

  let { block, onUpdate }: Props = $props();

  const level = $derived(block.additionalData?.level || '1');
  const variant = $derived(block.additionalData?.variant || 'default');

  let isEditing = $state(false);
  let editValue = $state(block.value);

  function handleBlur() {
    if (editValue !== block.value) {
      onUpdate?.(editValue);
    }
    isEditing = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
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

<div class="section-title-block" data-order={block.order}>
  {#if isEditing}
    <Input
      bind:value={editValue}
      onblur={handleBlur}
      onkeydown={handleKeydown}
      class="text-4xl font-extrabold h-auto border-0 px-0 focus-visible:ring-0"
      autofocus
    />
  {:else}
    {#if level === '1'}
      <h1 
        class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl cursor-text hover:bg-muted/50 px-1 rounded transition-colors"
        onclick={handleClick}
      >
        {editValue}
      </h1>
    {:else if level === '2'}
      <h2 
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 cursor-text hover:bg-muted/50 px-1 rounded transition-colors"
        onclick={handleClick}
      >
        {editValue}
      </h2>
    {:else if level === '3'}
      <h3 
        class="scroll-m-20 text-2xl font-semibold tracking-tight cursor-text hover:bg-muted/50 px-1 rounded transition-colors"
        onclick={handleClick}
      >
        {editValue}
      </h3>
    {:else}
      <h4 
        class="scroll-m-20 text-xl font-semibold tracking-tight cursor-text hover:bg-muted/50 px-1 rounded transition-colors"
        onclick={handleClick}
      >
        {editValue}
      </h4>
    {/if}
  {/if}

  <!-- {#if variant === 'separated'}
    <Separator class="my-2" />
  {/if} -->
</div>