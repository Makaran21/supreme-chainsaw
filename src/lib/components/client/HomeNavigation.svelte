<script lang="ts">
	import { page } from '$app/state';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import User from '@lucide/svelte/icons/user';
	// `$page` gives access to the current URL, route params, and more.
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-background/95">
	<div class="mx-auto max-w-7xl px-6 py-4">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3">
				<BookOpen class="h-6 w-6 text-primary" />
				<h1 class="text-xl font-bold tracking-tight">Book lab</h1>
			</a>

			<div class="flex items-center gap-8">
				<!-- Navigation -->
				<div class="flex items-center gap-8">
					<a
						href="/"
						class="text-sm font-semibold transition-all {page.url.pathname === '/'
							? 'border-b-2 border-primary text-primary'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						ទំព័រដើម
					</a>

					<a
						href="/about"
						class="text-sm font-semibold transition-all {page.url.pathname.startsWith('/about')
							? 'border-b-2 border-primary text-primary'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						អំពីយើង
					</a>
				</div>

				<!-- User Profile -->
				<a
					href="/me"
					class="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:bg-muted {page.url.pathname.startsWith(
						'/me'
					)
						? ''
						: ''}"
				>
					<User class="h-4 w-4" />
				</a>
			</div>
		</div>
	</div>
</nav>
