<script lang="ts">
	import type { BlogPost } from "$lib/server/db/schema";

    export let post: BlogPost
</script>

<a href="/blog-post/{post.id}">
	<article
	class="group cursor-pointer rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow"
>
	<div class="mb-4 flex items-center justify-between">
		<span class="text-xs font-black tracking-widest text-primary uppercase">
			{post.category}
		</span>
		<span class="text-xs text-muted-foreground">{post.readTime}</span>
	</div>
	<h4 class="mb-4 text-xl leading-tight font-black transition-colors group-hover:text-primary">
		{post.title}
	</h4>
	<p class="mb-6 text-sm leading-relaxed text-muted-foreground">
		{post.excerpt}
	</p>
	<div class="text-xs font-medium text-muted-foreground">
		{post.createdAt.toLocaleDateString()}
	</div>
</article>
</a>
