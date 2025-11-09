<script lang="ts">
	import { Star } from "@lucide/svelte";

	const feedbackItems = [
		{
			id: 1,
			author: 'សារ៉ា ជនសុន',
			role: 'អ្នករិះគន់សៀវភៅ',
			content:
				'សៀវភៅដែលបានជ្រើសរើសយ៉ាងប្រុងប្រយ័ត្នបានផ្លាស់ប្តូរទម្លាប់អានសៀវភៅរបស់ខ្ញុំ។ អស្ចារ្យណាស់!',
			rating: 5,
			avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=faces&fit=crop&w=80&h=80'
		},
		{
			id: 2,
			author: 'មៃខល ចិន',
			role: 'អ្នកស្រលាញ់អក្សរសាស្ត្រ',
			content: 'វេទិកាដ៏អស្ចារ្យសម្រាប់ស្វែងរកសៀវភៅថ្មីៗ។ ការផ្តល់អនុសាសន៍ត្រូវគ្នា​ពិតៗ។',
			rating: 5,
			avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=faces&fit=crop&w=80&h=80'
		},
		{
			id: 3,
			author: 'អេម៉ា រ៉ូដ្រីហ្គេស',
			role: 'និស្សិត',
			content: 'ល្អឥតខ្ចោះសម្រាប់រៀបចំបញ្ជីសៀវភៅអាន និងតាមដានវឌ្ឍនភាព។ សូមផ្តល់អនុសាសន៍!',
			rating: 4,
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=faces&fit=crop&w=80&h=80'
		}
	];
</script>

<section class="mx-auto max-w-7xl border-t border-border px-6 py-16 sm:py-20">
	<div class="mb-12">
		<h3 class="mb-4 text-5xl font-black">មតិយោបល់ពីអ្នកប្រើប្រាស់</h3>
		<div class="h-1.5 w-20 rounded-full bg-linear-to-r from-primary to-accent"></div>
	</div>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each feedbackItems as feedback (feedback.id)}
			<div
				class="rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
			>
				<div class="mb-4 flex items-start justify-between">
					<div class="flex items-center gap-4">
						<img
							src={feedback.avatar || '/placeholder.svg'}
							alt={feedback.author}
							class="h-12 w-12 rounded-full object-cover"
						/>
						<div>
							<h4 class="font-black text-foreground">{feedback.author}</h4>
							<p class="text-xs text-muted-foreground">{feedback.role}</p>
						</div>
					</div>
				</div>

				<div class="star-rating mb-4 flex">
					{#each Array(feedback.rating) as _, i (i)}
						<Star class="h-5 w-5 fill-current text-yellow-500" />
					{/each}
				</div>

				<p class="text-sm leading-relaxed text-muted-foreground">
					"{feedback.content}"
				</p>
			</div>
		{/each}
	</div>
</section>
