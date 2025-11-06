<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Clock,
		Calendar,
		Eye,
		Heart,
		Share2,
		Bookmark,
		MessageCircle,
		ArrowLeft,
		Send
	} from '@lucide/svelte';
	import HomePageLayout from '$lib/components/client/HomePageLayout.svelte';

	// Mock blog post data
	let post = {
		id: 1,
		title: '10 Tips for Writing Clean Code',
		slug: '10-tips-for-writing-clean-code',
		excerpt:
			'Learn the most important principles for writing maintainable code that your team will love.',
		content: `
			<h2>Introduction</h2>
			<p>Clean code is essential for maintainability and team collaboration. Here are my top tips for writing code that others (and future you) will thank you for.</p>
			
			<h2>1. Use Meaningful Names</h2>
			<p>Variable and function names should reveal intent. Avoid single letters and abbreviations unless they are universally understood. A good name can eliminate the need for comments.</p>
			
			<h2>2. Keep Functions Small</h2>
			<p>A function should do one thing and do it well. If you need a comment to explain what a section does, extract it into a separate function. Aim for functions that fit on your screen without scrolling.</p>
			
			<h2>3. Write Self-Documenting Code</h2>
			<p>Your code should be readable like prose. Use descriptive variable names, clear function signatures, and logical organization. Comments should explain "why" not "what".</p>
			
			<h2>4. Follow Consistent Formatting</h2>
			<p>Consistency is key. Use a linter and formatter to maintain uniform style across your codebase. This makes code predictable and easier to scan.</p>
			
			<h2>5. Avoid Deep Nesting</h2>
			<p>Deeply nested code is hard to follow. Use early returns, extract methods, and guard clauses to keep nesting shallow. Your code should flow linearly when possible.</p>
			
			<h2>Conclusion</h2>
			<p>Writing clean code is a skill that improves with practice. Start applying these principles today, and your future self will thank you!</p>
		`,
		coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
		category: 'Programming',
		readTime: 8,
		publishedAt: new Date('2024-11-01'),
		tags: ['programming', 'clean-code', 'best-practices'],
		author: {
			id: 'user_1',
			name: 'John Doe',
			username: 'johndoe',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
		},
		useFakeData: true,
		fakeViewers: 15420,
		stats: {
			views: 15420,
			likes: 342,
			comments: 28
		}
	};

	// Mock comments data
	let comments = [
		{
			id: 1,
			user: {
				name: 'Sarah Johnson',
				username: 'sarahj',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
			},
			content:
				"Great article! The section about meaningful names really resonated with me. I've been guilty of using single-letter variables too often.",
			createdAt: new Date('2024-11-02T10:30:00'),
			likes: 12,
			replies: [
				{
					id: 2,
					user: {
						name: 'John Doe',
						username: 'johndoe',
						avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
					},
					content:
						'Thanks Sarah! It\'s one of the easiest wins for improving code quality. Even changing "x" to "userIndex" makes a huge difference.',
					createdAt: new Date('2024-11-02T11:15:00'),
					likes: 5
				}
			]
		},
		{
			id: 3,
			user: {
				name: 'Mike Chen',
				username: 'mikechen',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
			},
			content: 'I would add "Write tests" as tip #6. Clean code without tests is still risky code!',
			createdAt: new Date('2024-11-02T14:20:00'),
			likes: 8,
			replies: []
		},
		{
			id: 4,
			user: {
				name: 'Emily Rodriguez',
				username: 'emilyrod',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
			},
			content:
				"The part about avoiding deep nesting is so important. I've seen code with 6+ levels of nesting and it's a nightmare to debug.",
			createdAt: new Date('2024-11-03T09:45:00'),
			likes: 15,
			replies: []
		}
	];

	let newComment = '';
	let replyingTo: number | null = null;
	let replyContent = '';
	let isLiked = false;
	let isBookmarked = false;

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	}

	function toggleLike() {
		isLiked = !isLiked;
		post.stats.likes += isLiked ? 1 : -1;
	}

	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}

	function sharePost() {
		if (navigator.share) {
			navigator.share({
				title: post.title,
				text: post.excerpt,
				url: window.location.href
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		}
	}

	function submitComment() {
		if (newComment.trim()) {
			console.log('Submitting comment:', newComment);
			newComment = '';
		}
	}

	function submitReply() {
		if (replyContent.trim() && replyingTo !== null) {
			console.log('Submitting reply:', replyContent, 'to comment:', replyingTo);
			replyContent = '';
			replyingTo = null;
		}
	}

	function startReply(commentId: number) {
		replyingTo = commentId;
	}

	function cancelReply() {
		replyingTo = null;
		replyContent = '';
	}
</script>

<HomePageLayout>
	<div class="min-h-screen">
		<div class="relative z-10 mx-auto mt-4 max-w-4xl">
			<Card class="shadow">
				<CardContent class="px-4">
					<div
						class="relative h-[180px] w-full overflow-hidden bg-linear-to-b from-muted to-background"
					>
						<img
							src={post.coverImage}
							alt={post.title}
							class="absolute inset-0 h-full w-full object-cover opacity-75"
						/>
						<div
							class="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent"
						></div>
						<div class="absolute top-4 left-4">
							<Button
								variant="ghost"
								size="icon"
								href="/"
								class="bg-background/80 backdrop-blur-sm"
							>
								<ArrowLeft class="h-5 w-5" />
							</Button>
						</div>
					</div>
					<!-- Category & Read Time -->
					<div class="mb-6 flex flex-wrap items-center gap-3">
						<Badge variant="secondary" class="text-sm">
							{post.category}
						</Badge>
						<div class="flex items-center gap-1.5 text-sm text-muted-foreground">
							<Clock class="h-4 w-4" />
							<span>{post.readTime} min read</span>
						</div>
						<div class="flex items-center gap-1.5 text-sm text-muted-foreground">
							<Eye class="h-4 w-4" />
							<span>{post.stats.views.toLocaleString()} views</span>
						</div>
					</div>

					<!-- Title -->
					<h1 class="mb-6 text-4xl leading-tight font-bold md:text-5xl">
						{post.title}
					</h1>

					<!-- Excerpt -->
					<p class="mb-8 text-xl leading-relaxed text-muted-foreground">
						{post.excerpt}
					</p>

					<!-- Author & Meta -->
					<div class="mb-8 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<Avatar class="h-12 w-12">
								<AvatarImage src={post.author.avatar} alt={post.author.name} />
								<AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
							</Avatar>
							<div>
								<p class="font-semibold">{post.author.name}</p>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<Calendar class="h-3.5 w-3.5" />
									<span>{formatDate(post.publishedAt)}</span>
								</div>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								class={isLiked ? 'text-red-500' : ''}
								onclick={toggleLike}
							>
								<Heart class="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class={isBookmarked ? 'text-blue-500' : ''}
								onclick={toggleBookmark}
							>
								<Bookmark class="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
							</Button>
							<Button variant="ghost" size="icon" onclick={sharePost}>
								<Share2 class="h-5 w-5" />
							</Button>
						</div>
					</div>

					<Separator class="mb-8" />

					<!-- Article Content -->
					<article class="prose prose-lg mb-12 max-w-none px-2">
						{@html post.content}
					</article>

					<!-- Tags -->
					<div class="mb-8 flex flex-wrap gap-2">
						{#each post.tags as tag}
							<Badge variant="outline">#{tag}</Badge>
						{/each}
					</div>

					<Separator class="mb-8" />

					<!-- Engagement Stats -->
					<div class="mb-8 flex items-center gap-6 text-sm text-muted-foreground">
						<div class="flex items-center gap-2">
							<Heart class="h-4 w-4" />
							<span>{post.stats.likes} likes</span>
						</div>
						<div class="flex items-center gap-2">
							<MessageCircle class="h-4 w-4" />
							<span>{post.stats.comments} comments</span>
						</div>
					</div>

					<!-- Comments Section -->
					<div class="space-y-4">
						<h2 class="text-2xl font-bold">Comments ({comments.length})</h2>

						<!-- Add Comment -->
						<Card>
							<CardContent class="p-4">
								<Textarea
									bind:value={newComment}
									placeholder="Share your thoughts..."
									rows={3}
									class="mb-3"
								/>
								<div class="flex justify-end">
									<Button onclick={submitComment} disabled={!newComment.trim()}>
										<Send class="mr-2 h-4 w-4" />
										Post Comment
									</Button>
								</div>
							</CardContent>
						</Card>

						<!-- Comments List -->
						<div class="space-y-4">
							{#each comments as comment}
								<Card class="shadow-none">
									<CardContent class="p-4">
										<!-- Comment Header -->
										<div class="mb-3 flex items-start gap-3">
											<Avatar class="h-10 w-10">
												<AvatarImage src={comment.user.avatar} alt={comment.user.name} />
												<AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
											</Avatar>
											<div class="flex-1">
												<div class="mb-1 flex items-center gap-2">
													<p class="font-semibold">{comment.user.name}</p>
													<span class="text-xs text-muted-foreground">@{comment.user.username}</span
													>
													<span class="text-xs text-muted-foreground">•</span>
													<span class="text-xs text-muted-foreground">
														{formatDate(comment.createdAt)}
													</span>
												</div>
												<p class="text-sm leading-relaxed text-foreground">
													{comment.content}
												</p>
											</div>
										</div>

										<!-- Comment Actions -->
										<div class="ml-13 flex items-center gap-4">
											<Button variant="ghost" size="sm" class="h-8 text-xs">
												<Heart class="mr-1.5 h-3.5 w-3.5" />
												{comment.likes}
											</Button>
											<Button
												variant="ghost"
												size="sm"
												class="h-8 text-xs"
												onclick={() => startReply(comment.id)}
											>
												Reply
											</Button>
										</div>

										<!-- Reply Form -->
										{#if replyingTo === comment.id}
											<div class="mt-4 ml-13 space-y-2">
												<Textarea
													bind:value={replyContent}
													placeholder="Write a reply..."
													rows={2}
												/>
												<div class="flex gap-2">
													<Button size="sm" onclick={submitReply} disabled={!replyContent.trim()}>
														Reply
													</Button>
													<Button size="sm" variant="ghost" onclick={cancelReply}>Cancel</Button>
												</div>
											</div>
										{/if}

										<!-- Replies -->
										{#if comment.replies && comment.replies.length > 0}
											<div class="mt-4 ml-13 space-y-4">
												{#each comment.replies as reply}
													<div class="flex items-start gap-3">
														<Avatar class="h-8 w-8">
															<AvatarImage src={reply.user.avatar} alt={reply.user.name} />
															<AvatarFallback>{getInitials(reply.user.name)}</AvatarFallback>
														</Avatar>
														<div class="flex-1">
															<div class="mb-1 flex items-center gap-2">
																<p class="text-sm font-semibold">{reply.user.name}</p>
																<span class="text-xs text-muted-foreground">
																	{formatDate(reply.createdAt)}
																</span>
															</div>
															<p class="text-sm leading-relaxed text-foreground">
																{reply.content}
															</p>
															<div class="mt-2 flex items-center gap-4">
																<Button variant="ghost" size="sm" class="h-7 text-xs">
																	<Heart class="mr-1.5 h-3 w-3" />
																	{reply.likes}
																</Button>
															</div>
														</div>
													</div>
												{/each}
											</div>
										{/if}
									</CardContent>
								</Card>
							{/each}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Related Posts Section (Optional) -->
			<div class="my-12">
				<h2 class="mb-6 text-2xl font-bold">Related Posts</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Add related posts here -->
				</div>
			</div>
		</div>
	</div>
</HomePageLayout>

<style>
	:global(.prose h2) {
		font-size: 1.75rem;
		font-weight: 700;
		margin-top: 2rem;
		margin-bottom: 1rem;
		line-height: 1.3;
	}

	:global(.prose p) {
		margin-bottom: 1.25rem;
		line-height: 1.75;
		color: hsl(var(--foreground) / 0.9);
	}

	:global(.prose h2:first-child) {
		margin-top: 0;
	}

	:global(body) {
		background-color: hsl(var(--background));
	}
</style>
