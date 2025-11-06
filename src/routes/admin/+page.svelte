<script lang="ts">
	import MediaLibrary from '$lib/components/admin/MediaLibrary.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { BookOpen, PenTool, Users } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background p-8 text-foreground">
	<h1 class="mb-8 text-3xl font-semibold">Admin Dashboard</h1>

	<div class="grid gap-6 md:grid-cols-3">
		<Card class="flex flex-col justify-between">
			<CardHeader class="flex items-center gap-3">
				<BookOpen class="h-6 w-6 text-muted-foreground" />
				<CardTitle>Books</CardTitle>
			</CardHeader>
			<CardContent class="flex justify-end">
				<Button variant="default" href="/admin/book">Go to Books</Button>
			</CardContent>
		</Card>

		<Card class="flex flex-col justify-between">
			<CardHeader class="flex items-center gap-3">
				<PenTool class="h-6 w-6 text-muted-foreground" />
				<CardTitle>Blog Posts</CardTitle>
			</CardHeader>
			<CardContent class="flex justify-end">
				<Button variant="default" href="/admin/blog-post">Go to Blog Posts</Button>
			</CardContent>
		</Card>

		<Card class="flex flex-col justify-between">
			<CardHeader class="flex items-center gap-3">
				<Users class="h-6 w-6 text-muted-foreground" />
				<CardTitle>Users</CardTitle>
			</CardHeader>
			<CardContent class="flex justify-end">
				<Button variant="default" href="/admin/user">Go to Users</Button>
			</CardContent>
		</Card>
		<MediaLibrary />
	</div>
</div>
