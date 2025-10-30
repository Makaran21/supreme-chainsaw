<script lang="ts">
  export let data;
</script>

<h1 class="text-2xl font-bold mb-6">Books</h1>

<div class="grid gap-6 md:grid-cols-2">
  {#each data.books as book}
    <a
      href={`/book/${book.id}`}
      class="rounded-2xl border border-border p-4 hover:bg-muted/50 transition-colors"
    >
      {#if book.coverImage}
        <img
          src={book.coverImage}
          alt={book.title}
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
      {/if}
      <h2 class="text-lg font-semibold mb-1">{book.title}</h2>
      <p class="text-sm text-muted-foreground">{book.description}</p>
    </a>
  {/each}
</div>
