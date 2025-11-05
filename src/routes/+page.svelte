<script lang="ts">
	import HomeBlogPostsSection from '$lib/components/client/HomeBlogPostsSection.svelte';
	import HomeBooksSection from '$lib/components/client/HomeBooksSection.svelte';
	import HomeFeedbackSection from '$lib/components/client/HomeFeedbackSection.svelte';
	import HomeFooter from '$lib/components/client/HomeFooter.svelte';
	import HomeHeroSection from '$lib/components/client/HomeHeroSection.svelte';
	import HomePageLayout from '$lib/components/client/HomePageLayout.svelte';

	export let data;

	const allBooks = data.allBooks;

	const blogPosts = data.blogPosts;
</script>

<HomePageLayout>
	<HomeHeroSection />
	<HomeBooksSection {allBooks} />
	<HomeBlogPostsSection {blogPosts} />
	<HomeFeedbackSection />
	<HomeFooter allBooksLength={allBooks.length} />
</HomePageLayout>
