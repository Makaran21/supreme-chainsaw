<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { BookOpen, LayoutDashboard, PenTool, Users } from '@lucide/svelte';

	export let data;

	const links = [
		{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
		{ name: 'Books', href: '/admin/book', icon: BookOpen },
		{ name: 'Blog Posts', href: '/admin/blog-post', icon: PenTool },
		{ name: 'Users', href: '/admin/user', icon: Users }
	];

	$: isEditingPage = data.bookId || data.blogPostId;
</script>

{#if !isEditingPage}
	<div class="flex h-screen bg-background text-foreground">
		<aside class="flex w-60 flex-col border-r bg-card">
			<div class="border-b p-6 text-lg font-semibold">Admin</div>

			<nav class="flex-1 space-y-1 p-4">
				{#each links as link}
					{@const Icon = link.icon}
					<a
						href={link.href}
						class={cn(
							'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
							$page.url.pathname === link.href ? 'bg-muted font-medium' : 'hover:bg-muted/50'
						)}
					>
						<Icon class="h-4 w-4" />
						<span>{link.name}</span>
					</a>
				{/each}
			</nav>

			<div class="border-t p-4">
				<Button variant="outline" class="w-full" href="/">ទៅទំព័រដើម</Button>
			</div>
		</aside>

		<!-- Main content -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>
{:else}
	<slot />
{/if}
