<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { ArrowUpRight } from '@lucide/svelte';
	import type { BooksForAdminPage } from '../../../routes/admin/book/+page.server';
	import type { SingleBookForAdminPage } from '../../../routes/admin/book/proxy+page.server';

	export let books: BooksForAdminPage;

	function getDisplayViewers(book: SingleBookForAdminPage): number {
		return book.useFakeData ? book.fakeViewers || 0 : book.viewers;
	}

	function getDisplayPurchases(book: SingleBookForAdminPage): number {
		return book.useFakeData ? book.fakePurchases || 0 : book.purchases;
	}

	function formatDate(date: Date | null): string {
		if (!date) return 'Unpublished';
		return date.toLocaleDateString();
	}
</script>

<div class="m-4 rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Title</TableHead>
				<TableHead class="w-[140px]">Thumbnail</TableHead>
				<TableHead class="w-[140px]">Price</TableHead>
				<TableHead class="w-[120px]">Viewers</TableHead>
				<TableHead class="w-[120px]">Purchases</TableHead>
				<TableHead class="w-[140px]">Published</TableHead>
				<TableHead class="w-[100px]">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each books as book (book.id)}
				<TableRow>
					<TableCell>
						<div>
							<div class="font-medium">{book.title}</div>
						</div>
					</TableCell>
					<TableCell>
						{#if book.coverImage}
							<img
								src={book.coverImage}
								alt={book.title}
								class="h-16 w-16 rounded border object-cover"
							/>
						{:else}
							<div
								class="flex h-16 w-16 items-center justify-center rounded border-2 border-dashed"
							>
								<span class="text-xs text-muted-foreground">No image</span>
							</div>
						{/if}
					</TableCell>
					<TableCell>{book.price}</TableCell>
					<TableCell>
						<div class="flex items-center gap-1">
							{getDisplayViewers(book).toLocaleString()}
							{#if book.useFakeData}
								<span class="text-xs text-orange-500" title="Using fake data">*</span>
							{/if}
						</div>
					</TableCell>
					<TableCell>
						<div class="flex items-center gap-1">
							{getDisplayPurchases(book).toLocaleString()}
							{#if book.useFakeData}
								<span class="text-xs text-orange-500" title="Using fake data">*</span>
							{/if}
						</div>
					</TableCell>
					<TableCell>{formatDate(book.publishedAt)}</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<!-- <Button size="sm" variant="outline" onclick={() => openUpdateBookDialog(book)}>
							<Edit />
						</Button> -->
							<Button size="sm" variant="outline" href="/admin/book/{book.id}">
								<ArrowUpRight />
							</Button>
						</div>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
