<script lang="ts">
  import { cn } from '$lib/utils';
  
  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
  <slot />
</div>

<div class="card-header">
  <slot name="header" />
</div>

<div class="card-content">
  <slot name="content" />
</div>

<style>
  .card-header {
    @apply flex flex-col space-y-1.5 p-6;
  }
  
  .card-content {
    @apply p-6 pt-0;
  }
</style>