<script lang="ts">
  import {  type Block } from '$lib/server/db/schema';
  import BlockImage from './BlockImage.svelte';
  import BlockMarkdown from './BlockMarkdown.svelte';
	import BlockSecondTitle from './BlockSecondTitle.svelte';
  import BlockSectionTitle from './BlockSectionTitle.svelte';
  import BlockVideo from './BlockVideo.svelte';
  
  interface Props {
    blocks: Block[];
  }
  
  let { blocks }: Props = $props();
  
  const sortedBlocks = $derived([...blocks].sort((a, b) => a.order - b.order));
  </script>
  
  <div class="block-list mx-auto space-y-4">
    {#each sortedBlocks as block (block.order)}
      {#if block.type === "markdown"}
        <BlockMarkdown {block} />
      {:else if block.type === "image"}
        <BlockImage {block} />
      {:else if block.type === "video"}
        <BlockVideo {block} />
      {:else if block.type === "second-title"}
        <BlockSecondTitle {block} />
      {:else if block.type === "section-title"}
        <BlockSectionTitle {block} />
      {/if}
    {/each}
  </div>
  