<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type {
		BookDataOperation,
		BookWithContent,
		OrderedChapterWithSections
	} from '$lib/server/query/book';
	import { cn } from '$lib/utils';
	import {
		ArrowUpDown,
		BookOpen,
		Edit2,
		GripVertical,
		MoreVertical,
		Plus,
		Save,
		Search,
		Trash2,
		X
	} from '@lucide/svelte';
	import type { DndEvent } from 'svelte-dnd-action';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	interface Section {
		id: number;
		sectionTitle: string;
		chapterId: number;
		orderIndex: number;
	}

	interface Chapter {
		id: number;
		chapterTitle: string;
		bookId: number;
		orderIndex: number;
		sections: Section[];
	}

	interface MenuData {
		id: number;
		bookTitle: string;
		chapters: Chapter[];
	}

	export let book: BookWithContent;

	const flipDurationMs = 200;

	function transformBookToMenuData(book: BookWithContent): MenuData {
		return {
			id: book.id,
			bookTitle: book.title,
			chapters: book.chapters.map((chapter) => ({
				id: chapter.id,
				chapterTitle: chapter.title,
				bookId: chapter.bookId,
				orderIndex: chapter.orderIndex,
				sections: chapter.sections.map((section) => ({
					id: section.id,
					sectionTitle: section.title,
					chapterId: section.chapterId,
					orderIndex: section.orderIndex
				}))
			}))
		};
	}

	const operations = new Map<string, BookDataOperation>();
	let initialMenuData: MenuData = transformBookToMenuData(book);
	let menuData: MenuData = JSON.parse(JSON.stringify(initialMenuData));
	let hasChanges = false;
	let searchQuery = '';
	let debouncedSearchQuery = '';
	let debounceTimer: ReturnType<typeof setTimeout>;

	$: hasChanges = JSON.stringify(menuData) !== JSON.stringify(initialMenuData);

	$: {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			debouncedSearchQuery = searchQuery;
		}, 300);
	}

	$: filteredChapters = menuData.chapters
		.map((chapter) => {
			const chapterMatches = chapter.chapterTitle
				.toLowerCase()
				.includes(debouncedSearchQuery.toLowerCase());

			const filteredSections = chapter.sections.filter((section) =>
				section.sectionTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
			);

			if (chapterMatches || filteredSections.length > 0) {
				return {
					...chapter,
					sections: chapterMatches ? chapter.sections : filteredSections
				};
			}
			return null;
		})
		.filter((chapter): chapter is Chapter => chapter !== null);

	function handleChapterSort(e: CustomEvent<DndEvent<Chapter>>): void {
		menuData.chapters = e.detail.items.map((chapter, index) => ({
			...chapter,
			orderIndex: index
		}));
	}

	function handleSectionSort(chapterId: number, e: CustomEvent<DndEvent<Section>>): void {
		const chapterIndex = menuData.chapters.findIndex((ch) => ch.id === chapterId);
		if (chapterIndex !== -1) {
			menuData.chapters[chapterIndex].sections = e.detail.items.map((section, index) => {
				const newSection = {
					...section,
					chapterId,
					orderIndex: index
				};
				if (section.chapterId !== chapterId) {
					operations.set(`section:move:${newSection.id}`, {
						dataType: 'SECTION',
						action: 'MOVE',
						section: { ...newSection, title: newSection.sectionTitle, content: '' }
					});
				}
				return newSection;
			});
			menuData = menuData;
		}
	}

	function moveChapter(chapterId: number): void {
		const currentIndex = menuData.chapters.findIndex((ch) => ch.id === chapterId);
		if (currentIndex === -1) return;

		const maxPosition = menuData.chapters.length;
		const currentPosition = currentIndex + 1;

		const input = prompt(
			`Move to position (1-${maxPosition}):\nCurrent position: ${currentPosition}`,
			currentPosition.toString()
		);

		if (!input) return;

		const newPosition = parseInt(input, 10);

		if (isNaN(newPosition) || newPosition < 1 || newPosition > maxPosition) {
			alert(`Please enter a valid position between 1 and ${maxPosition}`);
			return;
		}

		const newIndex = newPosition - 1;

		if (newIndex === currentIndex) return;

		const [chapter] = menuData.chapters.splice(currentIndex, 1);
		menuData.chapters.splice(newIndex, 0, chapter);

		menuData.chapters = menuData.chapters.map((ch, idx) => ({
			...ch,
			orderIndex: idx
		}));

		menuData = menuData;
	}

	function addChapter(chapterTitle: string): void {
		const newOrderIndex = menuData.chapters.length;
		const newChapter = {
			id: -Date.now(),
			chapterTitle,
			bookId: menuData.id,
			orderIndex: newOrderIndex - 1,
			sections: []
		};
		menuData.chapters = [...menuData.chapters, newChapter];
		operations.set(`chapter:${newChapter.id}`, {
			dataType: 'CHAPTER',
			action: 'CREATE',
			chapter: { ...newChapter, title: newChapter.chapterTitle }
		});
	}

	function deleteChapter(chapterId: number): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (!chapter) return;

		if (
			confirm(
				`Are you sure you want to delete "${chapter.chapterTitle}"? This will also delete all sections within this chapter.`
			)
		) {
			menuData.chapters = menuData.chapters.filter((ch) => ch.id !== chapterId);
			menuData.chapters = menuData.chapters.map((ch, idx) => ({
				...ch,
				orderIndex: idx
			}));

			operations.set(`chapter:${chapterId}`, {
				dataType: 'CHAPTER',
				action: 'DELETE',
				chapter: { ...chapter, title: chapter.chapterTitle }
			});
		}
	}

	function renameChapter(chapterId: number, newTitle: string): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (chapter) {
			chapter.chapterTitle = newTitle;
			menuData = menuData;
			operations.set(`chapter:${chapterId}`, {
				dataType: 'CHAPTER',
				action: 'RENAME',
				chapter: { ...chapter, title: chapter.chapterTitle }
			});
		}
	}

	function addSection(chapterId: number, sectionTitle: string): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (chapter) {
			const newOrderIndex = chapter.sections.length;
			const newSection = {
				id: -Date.now(), // Temporary negative ID for new sections
				sectionTitle,
				chapterId,
				orderIndex: newOrderIndex - 1
			};
			chapter.sections = [...chapter.sections, newSection];
			menuData = menuData;
			operations.set(`section:${newSection.id}`, {
				dataType: 'SECTION',
				action: 'CREATE',
				section: { ...newSection, title: newSection.sectionTitle, content: '' }
			});
		}
	}

	function deleteSection(chapterId: number, sectionId: number): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (!chapter) return;

		const section = chapter.sections.find((s) => s.id === sectionId);
		if (!section) return;

		if (confirm(`Are you sure you want to delete "${section.sectionTitle}"?`)) {
			chapter.sections = chapter.sections.filter((s) => s.id !== sectionId);
			// Update orderIndex for remaining sections
			chapter.sections = chapter.sections.map((s, idx) => ({
				...s,
				orderIndex: idx
			}));
			menuData = menuData;
			operations.set(`section:${sectionId}`, {
				dataType: 'SECTION',
				action: 'DELETE',
				section: { ...section, title: section.sectionTitle, content: '' }
			});
		}
	}

	function renameSection(chapterId: number, sectionId: number, newTitle: string): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (chapter) {
			const section = chapter.sections.find((s) => s.id === sectionId);
			if (section) {
				section.sectionTitle = newTitle;
				menuData = menuData;
				operations.set(`section:rename:${sectionId}`, {
					dataType: 'SECTION',
					action: 'RENAME',
					section: { ...section, title: section.sectionTitle, content: '' }
				});
			}
		}
	}

	function handleAddChapter(): void {
		const title = prompt('Enter chapter title:');
		if (title) addChapter(title);
	}

	function handleRenameChapter(chapterId: number): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (!chapter) return;

		const newTitle = prompt('Enter new chapter title:', chapter.chapterTitle);
		if (newTitle) renameChapter(chapterId, newTitle);
	}

	function handleAddSection(chapterId: number): void {
		const title = prompt('Enter section title:');
		if (title) addSection(chapterId, title);
	}

	function handleRenameSection(chapterId: number, sectionId: number): void {
		const chapter = menuData.chapters.find((ch) => ch.id === chapterId);
		if (!chapter) return;

		const section = chapter.sections.find((s) => s.id === sectionId);
		if (!section) return;

		const newTitle = prompt('Enter new section title:', section.sectionTitle);
		if (newTitle) renameSection(chapterId, sectionId, newTitle);
	}

	async function handleSave(): Promise<void> {
		try {
			const chaptersAndSections: OrderedChapterWithSections[] = menuData.chapters.map((item) => {
				return {
					chapterId: item.id,
					sectionIds: item.sections.map((item) => item.id)
				};
			});

			const formData = new FormData();

			const finalOperations = Array.from(operations.values());

			formData.append('chaptersAndSections', JSON.stringify(chaptersAndSections));
			formData.append('operations', JSON.stringify(finalOperations));
			await fetch(`?/saveChaptersAndSections`, {
				method: 'POST',
				body: formData
			});

			initialMenuData = JSON.parse(JSON.stringify(menuData));
			hasChanges = false;
		} catch (error) {
			console.error('Error saving changes:', error);
			alert('Failed to save changes. Please try again.');
		}
	}

	// Cancel changes and reset to initial state
	function handleCancel(): void {
		if (confirm('Are you sure you want to discard all changes?')) {
			menuData = JSON.parse(JSON.stringify(initialMenuData));
			hasChanges = false;
		}
	}

	// Clear search
	function clearSearch(): void {
		searchQuery = '';
	}
</script>

<Sidebar.Root>
	<Sidebar.Content class="min-w-88 overflow-hidden">
		<Sidebar.Group>
			<Sidebar.GroupLabel class="fixed top-8 z-50 w-88 pr-4 pl-0">
				<div class="flex w-full flex-col gap-2 rounded bg-background p-2 shadow">
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<BookOpen class="h-5 w-5" />
							<span>{menuData.bookTitle}</span>
						</div>
						<button
							onclick={handleAddChapter}
							class="rounded p-1 hover:bg-accent"
							title="Add chapter"
						>
							<Plus class="h-4 w-4" />
						</button>
					</div>

					<!-- Search Input -->
					<div class="relative">
						<Search
							class="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							type="text"
							placeholder="Search chapters and sections..."
							bind:value={searchQuery}
							class="h-9 pr-8 pl-8"
						/>
						{#if searchQuery}
							<button
								onclick={clearSearch}
								class="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 hover:bg-accent"
								title="Clear search"
							>
								<X class="h-3 w-3" />
							</button>
						{/if}
					</div>

					{#if debouncedSearchQuery}
						<div class="text-xs text-muted-foreground">
							Found {filteredChapters.length} chapter(s)
						</div>
					{/if}
				</div>
			</Sidebar.GroupLabel>
			<Sidebar.GroupContent
				class={cn(
					'mt-22 w-full overflow-y-auto ',
					hasChanges ? 'h-[calc(100vh-10rem)]' : 'h-[calc(100vh-7rem)]'
				)}
			>
				<Sidebar.Menu class="w-full">
					{#if filteredChapters.length === 0}
						<div class="p-4 text-center text-sm text-muted-foreground">
							No results found for "{debouncedSearchQuery}"
						</div>
					{:else}
						<div
							use:dndzone={{
								items: debouncedSearchQuery ? filteredChapters : menuData.chapters,
								flipDurationMs,
								type: 'chapter',
								dropTargetClasses: ['rounded'],
								dropTargetStyle: {
									outline: '1px dashed black',
									backgroundColor: '#f0f8ff'
								}
							}}
							onconsider={handleChapterSort}
							onfinalize={handleChapterSort}
							class="space-y-1"
						>
							{#each filteredChapters as chapter (chapter.id)}
								<div animate:flip={{ duration: flipDurationMs }} class="rounded border p-1 pb-3">
									<Sidebar.MenuItem>
										<div class="flex w-full items-center gap-1">
											{#if !debouncedSearchQuery}
												<div class="cursor-grab active:cursor-grabbing">
													<GripVertical class="h-4 w-4 text-muted-foreground" />
												</div>
											{/if}
											<Sidebar.MenuButton class="flex-1">
												<Tooltip.Provider>
													<Tooltip.Root>
														<Tooltip.Trigger class="flex w-full min-w-0 items-center gap-2">
															<span class="truncate">{chapter.chapterTitle}</span>
														</Tooltip.Trigger>
														<Tooltip.Content>
															<p>{chapter.chapterTitle}</p>
														</Tooltip.Content>
													</Tooltip.Root>
												</Tooltip.Provider>
											</Sidebar.MenuButton>
											<DropdownMenu.Root>
												<DropdownMenu.Trigger
													class="mr-2 rounded p-1 hover:bg-accent"
													title="Chapter options"
												>
													<MoreVertical class="h-4 w-4" />
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<DropdownMenu.Item onclick={() => handleAddSection(chapter.id)}>
														<Plus class="mr-2 h-3 w-3" />
														Add section
													</DropdownMenu.Item>
													<DropdownMenu.Item onclick={() => moveChapter(chapter.id)}>
														<ArrowUpDown class="mr-2 h-3 w-3" />
														Move to position...
													</DropdownMenu.Item>
													<DropdownMenu.Item onclick={() => handleRenameChapter(chapter.id)}>
														<Edit2 class="mr-2 h-3 w-3" />
														Rename chapter
													</DropdownMenu.Item>
													<DropdownMenu.Item
														onclick={() => deleteChapter(chapter.id)}
														class="text-destructive focus:text-destructive"
													>
														<Trash2 class="mr-2 h-3 w-3" />
														Delete chapter
													</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</div>
										<Sidebar.MenuSub>
											<div
												use:dndzone={{
													items: chapter.sections,
													flipDurationMs,
													type: 'section',
													dropFromOthersDisabled: false,
													dropTargetClasses: ['rounded'],
													dropTargetStyle: {
														outline: '1px dashed black',
														backgroundColor: '#f0f8ff'
													}
												}}
												onconsider={(e) => handleSectionSort(chapter.id, e)}
												onfinalize={(e) => handleSectionSort(chapter.id, e)}
												class="min-h-6 space-y-1"
											>
												{#each chapter.sections as section (section.id)}
													<div animate:flip={{ duration: flipDurationMs }}>
														<Sidebar.MenuSubItem>
															<div class="flex w-full items-center gap-1">
																{#if !debouncedSearchQuery}
																	<div class="cursor-grab active:cursor-grabbing">
																		<GripVertical class="h-3 w-3 text-muted-foreground" />
																	</div>
																{/if}
																<Sidebar.MenuSubButton
																	href={`/admin/books/${menuData.id}/${section.id}?mode=markdown`}
																	class="flex-1 truncate"
																>
																	<Tooltip.Provider>
																		<Tooltip.Root>
																			<Tooltip.Trigger
																				class="flex w-full min-w-0 items-center gap-2"
																			>
																				<span class="truncate">{section.sectionTitle} </span>
																			</Tooltip.Trigger>
																			<Tooltip.Content>
																				<p>{section.sectionTitle}</p>
																			</Tooltip.Content>
																		</Tooltip.Root>
																	</Tooltip.Provider>
																</Sidebar.MenuSubButton>
																<DropdownMenu.Root>
																	<DropdownMenu.Trigger
																		class="rounded p-1 hover:bg-accent"
																		title="Section options"
																	>
																		<MoreVertical class="h-4 w-4" />
																	</DropdownMenu.Trigger>
																	<DropdownMenu.Content>
																		<DropdownMenu.Item
																			onclick={() => handleRenameSection(chapter.id, section.id)}
																		>
																			<Edit2 class="mr-2 h-3 w-3" />
																			Rename section
																		</DropdownMenu.Item>
																		<DropdownMenu.Item
																			onclick={() => deleteSection(chapter.id, section.id)}
																			class="text-destructive focus:text-destructive"
																		>
																			<Trash2 class="mr-2 h-3 w-3" />
																			Delete section
																		</DropdownMenu.Item>
																	</DropdownMenu.Content>
																</DropdownMenu.Root>
															</div>
														</Sidebar.MenuSubItem>
													</div>
												{/each}
											</div>
										</Sidebar.MenuSub>
									</Sidebar.MenuItem>
								</div>
							{/each}
						</div>
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<!-- Save and Cancel Buttons -->
	{#if hasChanges}
		<Sidebar.Footer class="border-t p-2">
			<div class="flex gap-2">
				<Button
					onclick={handleSave}
					variant="default"
					class="flex-1 cursor-pointer justify-center gap-2"
					title="Save changes"
				>
					<Save class="h-4 w-4" />
					Save
				</Button>

				<Button
					onclick={handleCancel}
					variant="outline"
					class="flex-1 cursor-pointer justify-center gap-2"
					title="Cancel and reset"
				>
					<X class="h-4 w-4" />
					Cancel
				</Button>
			</div>
		</Sidebar.Footer>
	{/if}
</Sidebar.Root>

<style>
	:global(.dnd-action-draggable-wrapper) {
		width: 100%;
	}
</style>
