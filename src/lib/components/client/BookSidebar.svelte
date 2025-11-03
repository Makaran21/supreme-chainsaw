<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { BookWithContent } from '$lib/server/query/book';
	import { cn } from '$lib/utils';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import ToggleSidebar from './ToggleSidebar.svelte';

	interface Section {
		id: number;
		sectionTitle: string;
	}

	interface Chapter {
		id: number;
		chapterTitle: string;
		sections: Section[];
	}

	interface MenuData {
		id: number;
		bookTitle: string;
		chapters: Chapter[];
	}

	export let book: BookWithContent;
	export let currentSectionId: number | null = null;

	function transformBookToMenuData(book: BookWithContent): MenuData {
		return {
			id: book.id,
			bookTitle: book.title,
			chapters: book.chapters.map((chapter) => ({
				id: chapter.id,
				chapterTitle: chapter.title,
				sections: chapter.sections.map((section) => ({
					id: section.id,
					sectionTitle: section.title
				}))
			}))
		};
	}

	const menuData: MenuData = transformBookToMenuData(book);
	let searchQuery = '';
	let debouncedSearchQuery = '';
	let debounceTimer: ReturnType<typeof setTimeout>;

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

	function clearSearch(): void {
		searchQuery = '';
	}

	const sidebar = useSidebar();
</script>

<Sidebar.Root>
	<Sidebar.Content class="min-w-88 overflow-hidden">
		<Sidebar.Group>
			<Sidebar.GroupLabel class=" absolute top-10 z-50 w-88 pr-4 pl-0">
				<div class="flex w-full flex-col gap-2 rounded bg-background px-2 py-3 shadow">
					<div class="flex flex-row items-center justify-between gap-2">
						<div class="flex grow items-center justify-start pl-1">
							<span class="truncate text-base font-bold">{menuData.bookTitle}</span>
						</div>
						<ToggleSidebar />
					</div>

					<div class="relative">
						<Search
							class="absolute top-4.5 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							type="text"
							placeholder="Search chapters and sections..."
							bind:value={searchQuery}
							class="h-9 rounded pr-8 pl-8"
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
			<Sidebar.GroupContent class="mt-26 h-[calc(100vh-7rem)] w-full overflow-y-auto">
				<Sidebar.Menu class="w-full">
					{#if filteredChapters.length === 0}
						<div class="p-4 text-center text-sm text-muted-foreground">
							No results found for "{debouncedSearchQuery}"
						</div>
					{:else}
						<div class="space-y-1">
							{#each filteredChapters as chapter, index (chapter.id)}
								<div class="rounded border p-1 py-2">
									<Sidebar.MenuItem>
										<div class="flex w-full items-center">
											<Sidebar.MenuButton class="flex-1" aria-disabled={index >= 4}>
												<Tooltip.Provider>
													<Tooltip.Root>
														<Tooltip.Trigger class="flex w-full min-w-0 items-center gap-2">
															<span class="truncate font-medium">{chapter.chapterTitle}</span>
														</Tooltip.Trigger>
														<Tooltip.Content>
															<p>{chapter.chapterTitle}</p>
														</Tooltip.Content>
													</Tooltip.Root>
												</Tooltip.Provider>
											</Sidebar.MenuButton>
										</div>
										<Sidebar.MenuSub>
											<div class="space-y-1">
												{#each chapter.sections as section (section.id)}
													<Sidebar.MenuSubItem>
														<Sidebar.MenuSubButton
															aria-disabled={index >= 4}
															href={`/book/${menuData.id}/${section.id}`}
															class={cn(
																'h-11 flex-1 truncate sm:h-8',
																currentSectionId === section.id && 'bg-accent font-medium'
															)}
															onclick={() => {
																if (sidebar.isMobile) {
																	sidebar.toggle();
																}
															}}
														>
															<Tooltip.Provider>
																<Tooltip.Root>
																	<Tooltip.Trigger
																		class="flex w-full min-w-0 items-center gap-2 hover:cursor-pointer"
																	>
																		<span class="truncate">{section.sectionTitle}</span>
																	</Tooltip.Trigger>
																	<Tooltip.Content>
																		<p>{section.sectionTitle}</p>
																	</Tooltip.Content>
																</Tooltip.Root>
															</Tooltip.Provider>
														</Sidebar.MenuSubButton>
													</Sidebar.MenuSubItem>
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
</Sidebar.Root>
