<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { ArrowUpRight, Plus, X } from '@lucide/svelte';

	export let data;

	let blogPosts = data.blogPosts;
	let isCreateDialogOpen = false;

	// New blog post form state
	let newPost = {
		title: '',
		category: '',
		coverImage: '',
		tags: [] as string[],
		tagInput: ''
	};

	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString();
	}

	function formatReadTime(minutes: number): string {
		return `${minutes} min read`;
	}

	function truncateText(text: string | null, maxLength: number = 60): string {
		if (!text) return 'N/A';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}

	function addTag() {
		const tag = newPost.tagInput.trim();
		if (tag && !newPost.tags.includes(tag)) {
			newPost.tags = [...newPost.tags, tag];
			newPost.tagInput = '';
		}
	}

	function removeTag(tag: string) {
		newPost.tags = newPost.tags.filter((t) => t !== tag);
	}

	function handleTagKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	}

	async function createBlogPost() {
		const formData = new FormData();
		formData.append('title', newPost.title);
		formData.append('category', newPost.category);
		formData.append('coverImage', newPost.coverImage || '');
		formData.append('tags', JSON.stringify(newPost.tags));

		try {
			const response = await fetch('?/createBlogPost', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();

				// Reset form
				newPost = {
					title: '',
					category: '',
					coverImage: '',
					tags: [],
					tagInput: ''
				};

				isCreateDialogOpen = false;
			}
		} catch (error) {
			console.error('Error creating blog post:', error);
		}
	}
</script>

<div>
	<div class="flex items-center justify-between border-b p-4 mb-4">
		<div>
			<h1 class="text-3xl font-bold">Blog Posts</h1>
		</div>

		<Dialog bind:open={isCreateDialogOpen}>
			<DialogTrigger>
				<Button>
					<Plus class="mr-2 h-4 w-4" />
					Create Blog Post
				</Button>
			</DialogTrigger>
			<DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Create New Blog Post</DialogTitle>
					<DialogDescription>Create a new blog post. Fill in the details below.</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="grid gap-2">
						<Label for="title">Title</Label>
						<Input id="title" bind:value={newPost.title} placeholder="Enter blog post title" />
					</div>

					<div class="grid gap-2">
						<Label for="category">Category</Label>
						<Input
							id="category"
							bind:value={newPost.category}
							placeholder="e.g., Programming, Web Development, Tutorial"
						/>
					</div>

					<div class="grid gap-2">
						<Label for="coverImage">Cover Image URL</Label>
						<Input
							id="coverImage"
							bind:value={newPost.coverImage}
							placeholder="https://example.com/image.jpg"
						/>
						{#if newPost.coverImage}
							<div class="mt-2">
								<img
									src={newPost.coverImage}
									alt="Cover preview"
									class="h-48 w-full rounded-lg border object-cover"
								/>
							</div>
						{/if}
					</div>

					<div class="grid gap-2">
						<Label for="tags">Tags</Label>
						<div class="flex gap-2">
							<Input
								id="tags"
								bind:value={newPost.tagInput}
								placeholder="Add a tag and press Enter"
								onkeydown={handleTagKeydown}
							/>
							<Button type="button" variant="outline" onclick={addTag}>Add</Button>
						</div>
						{#if newPost.tags.length > 0}
							<div class="mt-2 flex flex-wrap gap-2">
								{#each newPost.tags as tag}
									<Badge variant="secondary" class="flex items-center gap-1">
										{tag}
										<button
											type="button"
											onclick={() => removeTag(tag)}
											class="ml-1 hover:text-destructive"
										>
											<X class="h-3 w-3" />
										</button>
									</Badge>
								{/each}
							</div>
						{/if}
					</div>

					<div class="rounded-lg border bg-muted/50 p-4">
						<Label class="text-sm font-semibold">Content Editor</Label>
						<p class="mt-1 text-xs text-muted-foreground">
							Content will be created with a default TipTap editor structure. You can edit the full
							content after creation.
						</p>
					</div>

					<div class="space-y-1 text-xs text-muted-foreground">
						<p>• Read time will be calculated automatically based on content</p>
						<p>• Post will be created as a draft (unpublished)</p>
						<p>• Slug will be generated from the title</p>
					</div>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onclick={() => (isCreateDialogOpen = false)}>
						Cancel
					</Button>
					<Button
						type="submit"
						onclick={createBlogPost}
						disabled={!newPost.title || !newPost.category}
					>
						Create Post
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>

	<div class="rounded-lg border m-4">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead class="w-[150px]">Author</TableHead>
					<TableHead class="w-[120px]">Category</TableHead>
					<TableHead class="w-[100px]">Read Time</TableHead>
					<TableHead class="w-[100px]">Status</TableHead>
					<TableHead class="w-[120px]">Published</TableHead>
					<TableHead class="w-[120px]">Created</TableHead>
					<TableHead class="w-[100px]">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each blogPosts as post (post.id)}
					<TableRow>
						<TableCell>
							<div>
								<div class="font-medium">{post.title}</div>
								{#if post.excerpt}
									<div class="mt-1 text-xs text-muted-foreground">
										{truncateText(post.excerpt)}
									</div>
								{/if}
								{#if post.tags && post.tags.length > 0}
									<div class="mt-2 flex flex-wrap gap-1">
										{#each post.tags.slice(0, 3) as tag}
											<Badge variant="outline" class="text-xs">{tag}</Badge>
										{/each}
										{#if post.tags.length > 3}
											<Badge variant="outline" class="text-xs">+{post.tags.length - 3}</Badge>
										{/if}
									</div>
								{/if}
							</div>
						</TableCell>
						<TableCell>
							{#if post.author}
								<div class="flex items-center gap-2">
									<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
										<span class="text-xs font-medium">
											{post.author.username.charAt(0).toUpperCase()}
										</span>
									</div>
									<span class="text-sm">{post.author.username}</span>
								</div>
							{:else}
								<span class="text-muted-foreground">Unknown</span>
							{/if}
						</TableCell>
						<TableCell>
							<Badge variant="secondary">{post.category}</Badge>
						</TableCell>
						<TableCell class="text-sm text-muted-foreground">
							{formatReadTime(post.readTime)}
						</TableCell>
						<TableCell>
							{#if post.published}
								<Badge variant="default" class="bg-green-500">Published</Badge>
							{:else}
								<Badge variant="outline">Draft</Badge>
							{/if}
						</TableCell>
						<TableCell class="text-sm">
							{formatDate(post.publishedAt)}
						</TableCell>
						<TableCell class="text-sm text-muted-foreground">
							{formatDate(post.createdAt)}
						</TableCell>
						<TableCell>
							<Button size="sm" variant="outline" href="/admin/blog-post/{post.id}">
								<ArrowUpRight class="h-4 w-4" />
							</Button>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>

	{#if blogPosts.length === 0}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<p class="text-muted-foreground">No blog posts found</p>
			<Button class="mt-4" onclick={() => (isCreateDialogOpen = true)}>
				<Plus class="mr-2 h-4 w-4" />
				Create Your First Post
			</Button>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-color: hsl(0 0% 98%);
	}
</style>
