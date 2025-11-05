<script lang="ts">
	import { invalidateAll } from '$app/navigation';
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
	import { Textarea } from '$lib/components/ui/textarea';

	export let onClose: (book?: typeof newBook) => void;
	export let open: boolean;

	let newBook = {
		title: '',
		description: '',
		coverImage: '',
		price: '',
		isFree: false
	};

	function toggleFree() {
		newBook.isFree = !newBook.isFree;
	}

	async function createBook() {
		const formData = new FormData();
		formData.append('title', newBook.title);
		formData.append('description', newBook.description);
		formData.append('coverImage', newBook.coverImage || '');
		formData.append('price', newBook.price);
		formData.append('isFree', newBook.isFree.toString());

		try {
			const response = await fetch('?/createBook', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'success') {
				await invalidateAll();
			} else {
				console.error('Failed to create book:', result);
			}
		} catch (error) {
			console.error('Error creating book:', error);
		} finally {
			onClose(newBook);
			newBook = {
				title: '',
				description: '',
				coverImage: '',
				price: '',
				isFree: false
			};
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		<Button>Add New Book</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[500px]">
		<DialogHeader>
			<DialogTitle>Add New Book</DialogTitle>
			<DialogDescription>Create a new book entry. Fill in the details below.</DialogDescription>
		</DialogHeader>
		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="title">Title</Label>
				<Input id="title" bind:value={newBook.title} placeholder="Enter book title" />
			</div>
			<div class="grid gap-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					bind:value={newBook.description}
					placeholder="Enter book description"
					rows={3}
				/>
			</div>
			<div class="grid gap-2">
				<Label for="coverImage">Cover Image URL</Label>
				<Input
					id="coverImage"
					bind:value={newBook.coverImage}
					placeholder="https://example.com/image.jpg"
				/>
			</div>
			<div class="flex items-center space-x-2">
				<Button
					type="button"
					variant={newBook.isFree ? 'default' : 'outline'}
					size="sm"
					onclick={toggleFree}
				>
					{newBook.isFree ? 'Free Book' : 'Paid Book'}
				</Button>
			</div>
			{#if !newBook.isFree}
				<div class="grid gap-2">
					<Label for="price">Price (USD)</Label>
					<Input
						id="price"
						type="number"
						step="0.01"
						bind:value={newBook.price}
						placeholder="29.99"
					/>
				</div>
			{/if}
		</div>
		<DialogFooter>
			<Button type="button" variant="outline" onclick={() => onClose()}>Cancel</Button>
			<Button type="submit" onclick={createBook} disabled={!newBook.title || !newBook.description}>
				Create Book
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
