<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Select from '$lib/components/ui/select';
	import {
		Search,
		Upload,
		Copy,
		Pencil,
		Trash2,
		Check,
		ChevronLeft,
		ChevronRight,
		Eye,
		X,
		Save
	} from '@lucide/svelte';
	import type { Media } from '$lib/server/db/schema';

	let open = false;
	let files: Media[] = [];
	let searchQuery = '';
	let uploading = false;
	let editingId: string | null = null;
	let editName = '';
	let copiedId: string | null = null;
	let fileInput: HTMLInputElement;
	let previewMedia: { file: File; id: string; name: string; url: string }[] = [];
	let showPreviewDialog = false;
	let previewItem: { url: string; type: string; name: string } | null = null;

	// Pagination
	let currentPage = 1;
	const itemsPerPage = 24;

	// Sorting
	let sortBy: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc' = 'newest';

	// File upload limit
	const maxFileSize = 10 * 1024 * 1024; // 10MB
	const maxFiles = 10; // Max files per upload

	$: filteredFiles = files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

	$: sortedFiles = [...filteredFiles].sort((a, b) => {
		switch (sortBy) {
			case 'newest':
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			case 'oldest':
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			case 'name-asc':
				return a.name.localeCompare(b.name);
			case 'name-desc':
				return b.name.localeCompare(a.name);
			case 'size-asc':
				return a.size - b.size;
			case 'size-desc':
				return b.size - a.size;
			default:
				return 0;
		}
	});

	$: totalPages = Math.ceil(sortedFiles.length / itemsPerPage);
	$: paginatedFiles = sortedFiles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: if (currentPage > totalPages && totalPages > 0) {
		currentPage = totalPages;
	}

	async function loadMedia() {
		const res = await fetch('/api/media');
		if (res.ok) {
			files = await res.json();
		}
	}

	function generateUUID() {
		return crypto.randomUUID();
	}

	async function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		// Validate file count
		if (input.files.length > maxFiles) {
			alert(`Maximum ${maxFiles} files allowed per upload`);
			input.value = '';
			return;
		}

		// Validate file sizes
		const oversizedFiles = Array.from(input.files).filter((f) => f.size > maxFileSize);
		if (oversizedFiles.length > 0) {
			alert(
				`Files must be under ${maxFileSize / 1024 / 1024}MB. ${oversizedFiles.length} file(s) exceeded limit.`
			);
			input.value = '';
			return;
		}

		// Create preview items
		previewMedia = await Promise.all(
			Array.from(input.files).map(async (file) => {
				const id = generateUUID();
				const url = URL.createObjectURL(file);
				return {
					file,
					id,
					name: file.name,
					url
				};
			})
		);

		input.value = '';
	}

	function removePreview(id: string) {
		const item = previewMedia.find((p) => p.id === id);
		if (item) {
			URL.revokeObjectURL(item.url);
		}
		previewMedia = previewMedia.filter((p) => p.id !== id);
	}

	function cancelPreviews() {
		previewMedia.forEach((p) => URL.revokeObjectURL(p.url));
		previewMedia = [];
	}

	async function saveUploads() {
		uploading = true;
		const formData = new FormData();

		previewMedia.forEach((item) => {
			formData.append('files', item.file);
			formData.append('ids', item.id);
			formData.append('names', item.name);
		});

		try {
			const res = await fetch('/api/media', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) {
				throw new Error('Upload failed');
			}

			await loadMedia();
			cancelPreviews();
		} catch (err) {
			alert('Upload failed. Please try again.');
		} finally {
			uploading = false;
		}
	}

	async function copyLink(url: string, id: string) {
		await navigator.clipboard.writeText(window.location.origin + url);
		copiedId = id;
		setTimeout(() => (copiedId = null), 2000);
	}

	function startEdit(file: Media) {
		editingId = file.id;
		editName = file.name;
	}

	async function saveEdit(id: string) {
		if (!editName.trim()) {
			alert('Name cannot be empty');
			return;
		}

		await fetch(`/api/media/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: editName, id })
		});

		editingId = null;
		await loadMedia();
	}

	async function deleteMedia(id: string) {
		if (!confirm('Delete this file?')) return;

		await fetch(`/api/media/`, { method: 'DELETE', body: JSON.stringify({ id }) });
		await loadMedia();
	}

	function openPreview(url: string, type: string, name: string) {
		previewItem = { url, type, name };
		showPreviewDialog = true;
	}

	function getFileIcon(type: string) {
		if (type.startsWith('image/')) return '🖼️';
		if (type.startsWith('video/')) return '🎬';
		if (type.startsWith('audio/')) return '🎵';
		if (type === 'application/pdf') return '📄';
		return '📎';
	}

	function formatSize(bytes: number) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	$: if (open) {
		loadMedia();
		currentPage = 1;
	}
</script>

<Dialog bind:open>
	<DialogTrigger class=" w-20">
		<Button>Media</Button>
	</DialogTrigger>

	<DialogContent class="flex max-h-[90vh] min-w-[75vw] flex-col overflow-hidden">
		<DialogHeader>
			<DialogTitle>Media Library</DialogTitle>
		</DialogHeader>

		<!-- Controls -->
		<div class="mb-4 flex flex-wrap gap-2">
			<div class="relative min-w-[200px] flex-1">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Search by name..." bind:value={searchQuery} class="pl-9" />
			</div>

			<Select.Root type="single" bind:value={sortBy}>
				<Select.Trigger class="w-[180px]">
					{sortBy}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="newest">Newest First</Select.Item>
					<Select.Item value="oldest">Oldest First</Select.Item>
					<Select.Item value="name-asc">Name (A-Z)</Select.Item>
					<Select.Item value="name-desc">Name (Z-A)</Select.Item>
					<Select.Item value="size-asc">Size (Small)</Select.Item>
					<Select.Item value="size-desc">Size (Large)</Select.Item>
				</Select.Content>
			</Select.Root>

			<input
				type="file"
				multiple
				accept="image/*,video/*,audio/*,.pdf"
				onchange={handleFileSelect}
				class="hidden"
				bind:this={fileInput}
			/>
			<Button disabled={uploading || previewMedia.length > 0} onclick={() => fileInput?.click()}>
				<Upload class="mr-2 h-4 w-4" />
				Upload
			</Button>
		</div>

		<!-- Preview Section -->
		{#if previewMedia.length > 0}
			<div class="mb-4 rounded-lg border bg-muted/50 p-4">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="font-semibold">Preview ({previewMedia.length} files)</h3>
					<div class="flex gap-2">
						<Button size="sm" variant="outline" onclick={cancelPreviews}>
							<X class="mr-2 h-4 w-4" />
							Cancel
						</Button>
						<Button size="sm" onclick={saveUploads} disabled={uploading}>
							<Save class="mr-2 h-4 w-4" />
							{uploading ? 'Saving...' : 'Save All'}
						</Button>
					</div>
				</div>

				<div class="grid grid-cols-4 gap-3">
					{#each previewMedia as preview}
						<div class="space-y-2 rounded-lg border bg-background p-2">
							<div
								class="flex aspect-square items-center justify-center overflow-hidden rounded bg-muted"
							>
								{#if preview.file.type.startsWith('image/')}
									<img src={preview.url} alt={preview.name} class="h-full w-full object-cover" />
								{:else if preview.file.type.startsWith('video/')}
									<video src={preview.url} class="h-full w-full object-cover" />
								{:else}
									<span class="text-3xl">{getFileIcon(preview.file.type)}</span>
								{/if}
							</div>

							<Input bind:value={preview.name} placeholder="Enter name..." class="h-8 text-sm" />

							<div class="flex justify-between">
								<Badge variant="secondary" class="text-xs">
									{formatSize(preview.file.size)}
								</Badge>
								<Button
									size="sm"
									variant="ghost"
									class="h-6 w-6 p-0"
									onclick={() => removePreview(preview.id)}
								>
									<X class="h-3 w-3" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Info Badge -->
		<div class="mb-2 text-sm text-muted-foreground">
			{sortedFiles.length} file(s) • Max {maxFiles} files per upload • Max {maxFileSize /
				1024 /
				1024}MB per file
		</div>

		<!-- Grid -->
		<div class="grid grid-cols-5 gap-4 overflow-y-auto pr-2">
			{#each paginatedFiles as file}
				<div class="space-y-2 rounded-lg border p-2 transition-shadow hover:shadow-md">
					<div
						class="relative flex aspect-square items-center justify-center overflow-hidden rounded bg-muted"
					>
						{#if file.type.startsWith('image/')}
							<img src={file.url} alt={file.name} class="h-full w-full object-cover" />
						{:else if file.type.startsWith('video/')}
							<video src={file.url} class="h-full w-full object-cover" />
						{:else}
							<span class="text-4xl">{getFileIcon(file.type)}</span>
						{/if}

						<Button
							size="sm"
							variant="secondary"
							class="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 transition-opacity hover:opacity-100"
							onclick={() => openPreview(file.url, file.type, file.name)}
						>
							<Eye class="h-4 w-4" />
						</Button>
					</div>

					{#if editingId === file.id}
						<Input
							bind:value={editName}
							onkeydown={(e) => e.key === 'Enter' && saveEdit(file.id)}
							class="h-8 text-sm"
							autofocus
						/>
					{:else}
						<p class="truncate text-sm font-medium" title={file.name}>
							{file.name}
						</p>
					{/if}

					<Badge variant="secondary" class="text-xs">
						{formatSize(file.size)}
					</Badge>

					<div class="flex gap-1">
						{#if editingId === file.id}
							<Button
								size="sm"
								variant="ghost"
								class="h-7 w-7 p-0"
								onclick={() => saveEdit(file.id)}
							>
								<Check class="h-3 w-3" />
							</Button>
							<Button
								size="sm"
								variant="ghost"
								class="h-7 w-7 p-0"
								onclick={() => (editingId = null)}
							>
								<X class="h-3 w-3" />
							</Button>
						{:else}
							<Button
								size="sm"
								variant="ghost"
								class="h-7 w-7 p-0"
								onclick={() => startEdit(file)}
								title="Edit name"
							>
								<Pencil class="h-3 w-3" />
							</Button>
						{/if}

						<Button
							size="sm"
							variant="ghost"
							class="h-7 w-7 p-0"
							onclick={() => copyLink(file.url, file.id)}
							title="Copy URL"
						>
							{#if copiedId === file.id}
								<Check class="h-3 w-3 text-green-600" />
							{:else}
								<Copy class="h-3 w-3" />
							{/if}
						</Button>

						<Button
							size="sm"
							variant="ghost"
							class="h-7 w-7 p-0"
							onclick={() => deleteMedia(file.id)}
							title="Delete"
						>
							<Trash2 class="h-3 w-3 text-destructive" />
						</Button>
					</div>
				</div>
			{/each}
		</div>

		{#if paginatedFiles.length === 0 && previewMedia.length === 0}
			<div class="py-12 text-center text-muted-foreground">
				{searchQuery ? 'No files found' : 'No media uploaded yet'}
			</div>
		{/if}

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-between border-t pt-4">
				<div class="text-sm text-muted-foreground">
					Page {currentPage} of {totalPages}
				</div>

				<div class="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						disabled={currentPage === 1}
						onclick={() => currentPage--}
					>
						<ChevronLeft class="h-4 w-4" />
						Previous
					</Button>

					<Button
						size="sm"
						variant="outline"
						disabled={currentPage === totalPages}
						onclick={() => currentPage++}
					>
						Next
						<ChevronRight class="h-4 w-4" />
					</Button>
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>

<!-- Preview Dialog -->
<Dialog bind:open={showPreviewDialog}>
	<DialogContent class="max-w-4xl">
		<DialogHeader>
			<DialogTitle>{previewItem?.name}</DialogTitle>
		</DialogHeader>

		{#if previewItem}
			<div class="flex items-center justify-center">
				{#if previewItem.type.startsWith('image/')}
					<img src={previewItem.url} alt={previewItem.name} class="max-h-[70vh] w-auto" />
				{:else if previewItem.type.startsWith('video/')}
					<video src={previewItem.url} controls class="max-h-[70vh] w-auto" />
				{:else if previewItem.type.startsWith('audio/')}
					<audio src={previewItem.url} controls class="w-full" />
				{:else if previewItem.type === 'application/pdf'}
					<iframe src={previewItem.url} class="h-[70vh] w-full" title={previewItem.name} />
				{:else}
					<p class="text-muted-foreground">Preview not available</p>
				{/if}
			</div>
		{/if}
	</DialogContent>
</Dialog>
