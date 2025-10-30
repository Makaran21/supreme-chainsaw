<script lang="ts">
    import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { db } from '$lib/server/db';
	import { books } from '$lib/server/db/schema';
  
    let title = '';
    let description = '';
    let coverImage = '';
  
    async function handleSubmit() {
      const inserted = await db.insert(books).values({ title, description, coverImage });
      goto(`/admin/books/${inserted.lastInsertRowid}`); // navigate to book detail
    }
  </script>

<div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Create Book</h1>
  
    <form on:submit|preventDefault={handleSubmit} class="space-y-4 max-w-lg">
      <Input bind:value={title} title="Title" required />
      <Textarea bind:value={description} title="Description" required />
      <Input bind:value={coverImage} title="Cover Image URL" />
      <Button type="submit">Create Book</Button>
    </form>
  </div>
  