<script lang="ts">
	import { EdraDragHandleExtended, EdraEditor, EdraToolBar } from '$lib/components/edra/shadcn';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { BlogPost } from '$lib/server/db/schema';
	import { ArrowLeft, Eye, EyeOff, Save, X } from '@lucide/svelte';
	import type { Content, Editor } from '@tiptap/core';

    export let data

	let post = data.post

	// Form state
	let form = {
		title: post.title,
		category: post.category,
		coverImage: post.coverImage || '',
		excerpt: post.excerpt || '',
		authorName: post.authorName || '',
		readTime: post.readTime,
		content: post.content,
		tags: post.tags || [],
		tagInput: '',
		useFakeData: post.useFakeData,
		fakeViewers: post.fakeViewers || 0,
		fakePurchases: post.fakePurchases || 0
	};

	let editor: Editor | undefined;
	let isSaving = false;
	let isPublishing = false;

	function handleEditorUpdate() {
		if (editor) {
			form.content = editor.getJSON() as unknown as Content[];
		}
	}

	function addTag() {
		const tag = form.tagInput.trim();
		if (tag && !form.tags.includes(tag)) {
			form.tags = [...form.tags, tag];
			form.tagInput = '';
		}
	}

	function removeTag(tag: string) {
		form.tags = form.tags.filter((t) => t !== tag);
	}

	function handleTagKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
	}

	async function savePost() {
		isSaving = true;
		console.log('Saving post:', form);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		isSaving = false;
	}

	async function togglePublish() {
		isPublishing = true;
		console.log('Toggling publish:', !post.published);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		post.published = !post.published;
		if (post?.published) {
			post.publishedAt = new Date() as unknown as any;
		} else {
			post.publishedAt = null;
		}
		isPublishing = false;
	}

	function toggleUseFakeData() {
		form.useFakeData = !form.useFakeData;
	}

	function formatDate(date: Date | null): string {
		if (!date) return 'Not published';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-7xl p-4">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="icon" href="/admin/blog-post">
				<ArrowLeft class="h-4 w-4" />
			</Button>
			<div>
				<h1 class="text-3xl font-bold">Edit Blog Post</h1>
				<p class="text-sm text-muted-foreground">
					{post.published ? 'Published' : 'Draft'} • Last updated {formatDate(post.updatedAt)}
				</p>
			</div>
		</div>
		<div class="flex gap-2">
			<Button
				variant={post.published ? 'destructive' : 'default'}
				onclick={togglePublish}
				disabled={isPublishing}
			>
				{#if post.published}
					<EyeOff class="mr-2 h-4 w-4" />
					Unpublish
				{:else}
					<Eye class="mr-2 h-4 w-4" />
					Publish
				{/if}
			</Button>
			<Button onclick={savePost} disabled={isSaving}>
				<Save class="mr-2 h-4 w-4" />
				{isSaving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Content</CardTitle>
			<CardDescription>Write your blog post content using the rich text editor</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="flex flex-1 flex-col rounded-md border">
				{#if editor && !editor.isDestroyed}
					<EdraToolBar class="border-b border-dashed bg-secondary/50 p-0.5" {editor} />
					<EdraDragHandleExtended {editor} />
				{/if}
				<EdraEditor
					bind:editor
					content={form.content}
					class="min-h-[300px] flex-1 overflow-y-auto p-4"
					onUpdate={handleEditorUpdate}
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Top Section - Metadata in 2 columns -->
	<div class="mt-4 grid grid-cols-2 gap-4">
		<!-- Left Column -->
		<div class="space-y-4">
			<!-- Basic Information -->
			<Card>
				<CardHeader>
					<CardTitle>Basic Information</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="space-y-2">
						<Label for="title">Title</Label>
						<Input
							id="title"
							bind:value={form.title}
							placeholder="Enter blog post title"
							class="text-lg"
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<Label for="category">Category</Label>
							<Input id="category" bind:value={form.category} placeholder="e.g., Programming" />
						</div>
						<div class="space-y-2">
							<Label for="readTime">Read Time (minutes)</Label>
							<Input id="readTime" type="number" bind:value={form.readTime} placeholder="5" />
						</div>
					</div>

					<div class="space-y-2">
						<Label for="excerpt">Excerpt</Label>
						<Textarea
							id="excerpt"
							bind:value={form.excerpt}
							placeholder="Brief description of the post"
							rows={3}
						/>
					</div>
				</CardContent>
			</Card>

			<!-- Cover Image -->
			<Card>
				<CardHeader>
					<CardTitle>Cover Image</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					{#if form.coverImage}
						<img
							src={form.coverImage}
							alt="Cover"
							class="aspect-video w-full rounded-lg border object-cover"
						/>
					{/if}
					<div class="space-y-2">
						<Label for="coverImage">Image URL</Label>
						<Input
							id="coverImage"
							bind:value={form.coverImage}
							placeholder="https://example.com/image.jpg"
						/>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Right Column -->
		<div class="space-y-4">
			<!-- Status Info -->
			<Card>
				<CardHeader>
					<CardTitle>Status</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div>
						<Label class="text-sm text-muted-foreground">Current Status</Label>
						<div class="mt-1">
							{#if post.published}
								<Badge class="bg-green-500">Published</Badge>
							{:else}
								<Badge variant="outline">Draft</Badge>
							{/if}
						</div>
					</div>

					<Separator />

					<div>
						<Label class="text-sm text-muted-foreground">Post ID</Label>
						<p class="text-sm font-medium">{post.id}</p>
					</div>

					<div>
						<Label class="text-sm text-muted-foreground">Slug</Label>
						<p class="font-mono text-xs break-all">{post.slug}</p>
					</div>

					<div>
						<Label class="text-sm text-muted-foreground">Created</Label>
						<p class="text-sm">{formatDate(post.createdAt)}</p>
					</div>

					{#if post.publishedAt}
						<div>
							<Label class="text-sm text-muted-foreground">Published</Label>
							<p class="text-sm">{formatDate(post.publishedAt)}</p>
						</div>
					{/if}
				</CardContent>
			</Card>

			<!-- Author Info -->
			<Card>
				<CardHeader>
					<CardTitle>Author</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div>
						<Label class="text-sm text-muted-foreground">Username</Label>
						<p class="text-sm font-medium">{post.authorName || 'Unknown'}</p>
					</div>

					<div class="space-y-2">
						<Label for="authorName">Display Name (Optional)</Label>
						<Input
							id="authorName"
							bind:value={form.authorName}
							placeholder="Override author name"
						/>
					</div>
				</CardContent>
			</Card>

			<!-- Tags -->
			<Card>
				<CardHeader>
					<CardTitle>Tags</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex gap-2">
						<Input bind:value={form.tagInput} placeholder="Add tag" onkeydown={handleTagKeydown} />
						<Button type="button" variant="outline" onclick={addTag}>Add</Button>
					</div>
					{#if form.tags.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each form.tags as tag}
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
				</CardContent>
			</Card>

			<!-- Statistics -->
			<Card>
				<CardHeader>
					<CardTitle>Statistics</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between">
						<Label class="text-sm">Display Mode</Label>
						<Button
							type="button"
							variant={form.useFakeData ? 'default' : 'outline'}
							size="sm"
							onclick={toggleUseFakeData}
						>
							{form.useFakeData ? 'Fake' : 'Real'}
						</Button>
					</div>

					<Separator />

					<div class="space-y-2">
						<Label for="fakeViewers">Fake Viewers</Label>
						<Input id="fakeViewers" type="number" bind:value={form.fakeViewers} placeholder="0" />
					</div>

					<div class="space-y-2">
						<Label for="fakePurchases">Fake Purchases</Label>
						<Input
							id="fakePurchases"
							type="number"
							bind:value={form.fakePurchases}
							placeholder="0"
						/>
					</div>

					{#if form.useFakeData}
						<div class="text-xs text-muted-foreground">
							Currently displaying: {form.fakeViewers.toLocaleString()} viewers, {form.fakePurchases.toLocaleString()}
							purchases
						</div>
					{/if}
				</CardContent>
			</Card>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: hsl(0 0% 98%);
	}
</style>
