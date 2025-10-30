<script lang="ts">
    import { cn } from '$lib/utils';
    
    let className: string | undefined = undefined;
    export { className as class };
    export let variant: 'default' | 'outline' | 'ghost' = 'default';
  </script>
  
  <button 
    class={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
      variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2",
      variant === 'outline' && "border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2",
      variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground px-4 py-2",
      className
    )}
    {...$$restProps}
    on:click
  >
    <slot />
  </button>