<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Book } from '$lib/server/db/schema';

	export let open: boolean = false;
	export let book: Book & { viewers: number; purchases: number };
	export let onClose: (updatedBook?: typeof editForm) => void;

	function formatDateForInput(date: Date | null): string {
		if (!date) return '';
		return date.toISOString().split('T')[0];
	}

	let editForm = {
		title: book.title,
		description: book.description,
		coverImage: book.coverImage || '',
		price: book.price?.toString() || '',
		isFree: book.isFree,
		publishedAt: formatDateForInput(book.publishedAt),
		viewers: book.viewers.toString(),
		purchases: book.purchases.toString(),
		fakeViewers: (book.fakeViewers || 0).toString(),
		fakePurchases: (book.fakePurchases || 0).toString(),
		useFakeData: book.useFakeData
	};

	function publishNow() {
		editForm.publishedAt = new Date().toISOString().split('T')[0];
	}

	function unpublish() {
		editForm.publishedAt = '';
	}

	function removeThumbnail() {
		editForm.coverImage = '';
	}

	function toggleFreeInDialog() {
		editForm.isFree = !editForm.isFree;
	}

	function toggleUseFakeData() {
		editForm.useFakeData = !editForm.useFakeData;
	}

	async function updateChange() {
		if (!book) return;

		const formData = new FormData();
		formData.append('id', book.id.toString());
		formData.append('title', editForm.title);
		formData.append('description', editForm.description);
		formData.append('coverImage', editForm.coverImage || '');
		formData.append('price', editForm.price);
		formData.append('isFree', editForm.isFree.toString());
		formData.append('publishedAt', editForm.publishedAt);
		formData.append('viewers', editForm.viewers);
		formData.append('purchases', editForm.purchases);
		formData.append('fakeViewers', editForm.fakeViewers);
		formData.append('fakePurchases', editForm.fakePurchases);
		formData.append('useFakeData', editForm.useFakeData.toString());

		try {
			const response = await fetch('/admin/book?/updateBook', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'success') {
				// Refresh the page data
				await invalidateAll();
				onClose(editForm);
			} else {
				console.error('Failed to update book:', result);
				// You can add toast notification here
			}
		} catch (error) {
			console.error('Error updating book:', error);
			// onClose();
		}
	}

	async function saveChanges() {
		await updateChange();
	}
</script>

<!-- More Info Dialog -->
<Dialog
	{open}
	onOpenChange={(open) => {
		if (!open) onClose();
	}}
>
	<DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
		{#if book}
			<DialogHeader>
				<DialogTitle>Edit Book</DialogTitle>
				<DialogDescription>Update book information and settings</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="edit-title">Title</Label>
					<Input id="edit-title" bind:value={editForm.title} placeholder="Enter book title" />
				</div>

				<div class="grid gap-2">
					<Label for="edit-description">Description</Label>
					<Textarea
						id="edit-description"
						bind:value={editForm.description}
						placeholder="Enter book description"
						rows={4}
					/>
				</div>

				<div class="grid gap-2">
					<Label>Cover Image</Label>
					{#if editForm.coverImage}
						<div class="space-y-2">
							<img
								src={editForm.coverImage}
								alt="Cover preview"
								class="h-48 w-full rounded-lg border object-cover"
							/>
							<Button type="button" variant="destructive" size="sm" onclick={removeThumbnail}>
								Remove Thumbnail
							</Button>
						</div>
					{/if}
					<Input
						id="edit-coverImage"
						bind:value={editForm.coverImage}
						placeholder="https://example.com/image.jpg"
					/>
				</div>

				<div class="flex items-center space-x-2">
					<Button
						type="button"
						variant={editForm.isFree ? 'default' : 'outline'}
						size="sm"
						onclick={toggleFreeInDialog}
					>
						{!editForm.isFree ? 'Free Book' : 'Paid Book'}
					</Button>
				</div>

				{#if !editForm.isFree}
					<div class="grid gap-2">
						<Label for="edit-price">Price (USD)</Label>
						<Input
							id="edit-price"
							type="number"
							step="0.01"
							bind:value={editForm.price}
							placeholder="29.99"
						/>
					</div>
				{/if}

				<div class="grid gap-2">
					<div class="flex items-center justify-between">
						<Label for="edit-publishedAt">Published Date</Label>
						<div class="flex gap-2">
							{#if editForm.publishedAt}
								<Button type="button" variant="destructive" size="sm" onclick={unpublish}>
									Unpublish
								</Button>
							{:else}
								<Button type="button" variant="default" size="sm" onclick={publishNow}>
									Publish Now
								</Button>
							{/if}
						</div>
					</div>
					<Input id="edit-publishedAt" type="date" bind:value={editForm.publishedAt} />
					<p class="text-xs text-muted-foreground">
						{#if editForm.publishedAt}
							Book is scheduled to be published on {new Date(
								editForm.publishedAt
							).toLocaleDateString()}
						{:else}
							Book is currently unpublished
						{/if}
					</p>
				</div>

				<div class="border-t pt-4">
					<div class="mb-4 flex items-center justify-between">
						<div>
							<Label class="text-base font-semibold">Statistics Display Mode</Label>
							<p class="text-sm text-muted-foreground">Choose which data to display publicly</p>
						</div>
						<Button
							type="button"
							variant={editForm.useFakeData ? 'default' : 'outline'}
							size="sm"
							onclick={toggleUseFakeData}
						>
							{editForm.useFakeData ? 'Using Fake Data' : 'Using Real Data'}
						</Button>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-4">
							<div>
								<Label class="text-sm font-semibold text-green-600">Real Data</Label>
							</div>
							<div class="grid gap-2">
								<Label for="edit-viewers" class="text-sm">Real Viewers</Label>
								<Input
									id="edit-viewers"
									type="number"
									disabled
									bind:value={editForm.viewers}
									placeholder="0"
								/>
							</div>
							<div class="grid gap-2">
								<Label for="edit-purchases" class="text-sm">Real Purchases</Label>
								<Input
									id="edit-purchases"
									type="number"
									disabled
									bind:value={editForm.purchases}
									placeholder="0"
								/>
							</div>
						</div>

						<div class="space-y-4">
							<div>
								<Label class="text-sm font-semibold text-orange-600">Fake Data</Label>
							</div>
							<div class="grid gap-2">
								<Label for="edit-fakeViewers" class="text-sm">Fake Viewers</Label>
								<Input
									id="edit-fakeViewers"
									type="number"
									bind:value={editForm.fakeViewers}
									placeholder="0"
								/>
							</div>
							<div class="grid gap-2">
								<Label for="edit-fakePurchases" class="text-sm">Fake Purchases</Label>
								<Input
									id="edit-fakePurchases"
									type="number"
									bind:value={editForm.fakePurchases}
									placeholder="0"
								/>
							</div>
						</div>
					</div>

					<div class="mt-4 rounded-lg bg-muted p-3">
						<p class="text-sm">
							<strong>Currently displaying:</strong>
							{#if editForm.useFakeData}
								<span class="text-orange-600">
									{(parseInt(editForm.fakeViewers) + parseInt(editForm.viewers)).toLocaleString()} viewers,
									{(
										parseInt(editForm.fakePurchases) + parseInt(editForm.purchases)
									).toLocaleString()} purchases
								</span>
							{:else}
								<span class="text-green-600">
									{parseInt(editForm.viewers).toLocaleString()} viewers,
									{parseInt(editForm.purchases).toLocaleString()} purchases
								</span>
							{/if}
						</p>
					</div>
				</div>

				<div class="border-t pt-2">
					<Label class="text-muted-foreground">Book ID</Label>
					<p class="font-medium">{book.id}</p>
				</div>
			</div>
			<DialogFooter>
				<Button variant="outline" onclick={() => onClose()}>Cancel</Button>
				<Button onclick={saveChanges} disabled={!editForm.title || !editForm.description}>
					Save Changes
				</Button>
			</DialogFooter>
		{/if}
	</DialogContent>
</Dialog>
