<!-- +page.svelte -->
<script lang="ts">
	import type {
		BooksForAdminPage,
		SingleBookForAdminPage
	} from '../../../routes/admin/book/+page.server';
	import BookCreateDialog from './BookCreateDialog.svelte';
	import BookTable from './BookTable.svelte';

	export let books: BooksForAdminPage;

	let isAddDialogOpen = false;
	let bookToEdit: SingleBookForAdminPage | null = null;
</script>

<div class="mx-auto">
	<div class="flex items-center justify-between border-b p-4">
		<div>
			<h1 class="text-3xl font-bold">Book Admin</h1>
		</div>

		<BookCreateDialog
			bind:open={isAddDialogOpen}
			onClose={(newBook) => {
				if (newBook) {
					const book: SingleBookForAdminPage = {
						id: Math.max(...books.map((b) => b.id)) + 1,
						title: newBook.title,
						description: newBook.description,
						coverImage: newBook.coverImage || null,
						publishedAt: null,
						price: newBook.isFree ? null : parseFloat(newBook.price) * 100 || null,
						isFree: newBook.isFree,
						viewers: 0,
						purchases: 0,
						fakeViewers: 0,
						fakePurchases: 0,
						useFakeData: true
					};

					books = [...books, book];
				}

				isAddDialogOpen = false;
			}}
		/>
	</div>

		<BookTable bind:books />
</div>

<style>
	:global(body) {
		background-color: hsl(0 0% 98%);
	}
</style>
