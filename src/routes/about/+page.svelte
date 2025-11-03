<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as Accordion from '$lib/components/ui/accordion';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Heart from '@lucide/svelte/icons/heart';
	import Users from '@lucide/svelte/icons/users';
	import Target from '@lucide/svelte/icons/target';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Phone from '@lucide/svelte/icons/phone';
	import HomePageLayout from '$lib/components/client/HomePageLayout.svelte';

	const teamMembers = [
		{
			name: 'សុខ វិបុល',
			role: 'Founder & CEO',
			description: 'ស្នេហាសៀវភៅ និងចង់ចែករំលែកចំណេះដឹង'
		},
		{
			name: 'លី ចន្ទា',
			role: 'Content Manager',
			description: 'អ្នកសរសេរប្លុក និងអ្នកពិនិត្យមើលមាតិកា'
		},
		{
			name: 'ឈន រតនា',
			role: 'Community Lead',
			description: 'ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកអាន'
		}
	];

	const values = [
		{
			icon: Heart,
			title: 'ចំណង់ចំណូលចិត្ត',
			description: 'យើងស្រលាញ់សៀវភៅ និងចង់ចែករំលែក'
		},
		{
			icon: Users,
			title: 'សហគមន៍',
			description: 'បង្កើតសហគមន៍នៃអ្នកស្រលាញ់សៀវភៅ'
		},
		{
			icon: Target,
			title: 'គុណភាព',
			description: 'ផ្តល់មាតិកាដែលមានគុណភាព'
		}
	];

	const faqs = [
		{
			question: 'Book Lab គឺជាអ្វី?',
			answer:
				'Book Lab គឺជាសហគមន៍សម្រាប់អ្នកស្រលាញ់សៀវភៅ ដែលអ្នកអាចរកឃើញសៀវភៅថ្មីៗ ចែករំលែកការពិនិត្យ និងភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកអានផ្សេងទៀត។'
		},
		{
			question: 'តើខ្ញុំអាចចូលរួមសហគមន៍យ៉ាងដូចម្តេច?',
			answer:
				'គ្រាន់តែបង្កើតគណនីឥតគិតថ្លៃ ហើយចាប់ផ្តើមរុករកសៀវភៅ ចែករំលែកការពិនិត្យ និងភ្ជាប់ទំនាក់ទំនងជាមួយសមាជិកផ្សេងទៀត។'
		},
		{
			question: 'តើសេវាកម្មនេះឥតគិតថ្លៃឬ?',
			answer:
				'បាទ/ចាស! Book Lab គឺឥតគិតថ្លៃសម្រាប់គ្រប់អ្នក។ យើងជឿជាក់ថាចំណេះដឹងគួរតែអាចទទួលបានដោយទាំងអស់គ្នា។'
		},
		{
			question: 'តើខ្ញុំអាចបង្ហោះការពិនិត្យសៀវភៅខ្ញុំបានទេ?',
			answer:
				'ពិតណាស់! យើងលើកទឹកចិត្តសមាជិកទាំងអស់ឱ្យចែករំលែកគំនិតរបស់ពួកគេអំពីសៀវភៅដែលពួកគេបានអាន។'
		},
		{
			question: 'តើខ្ញុំទាក់ទងក្រុមការងារបានយ៉ាងដូចម្តេច?',
			answer: 'អ្នកអាចទាក់ទងយើងតាមរយៈអ៊ីមែល ទូរស័ព្ទ ឬផ្ញើសារតាមរយៈទម្រង់ទំនាក់ទំនងខាងក្រោម។'
		}
	];
</script>

<HomePageLayout>
	<div class="min-h-screen">
		<!-- Hero Section -->
		<section class="border-b bg-muted/30 py-12">
			<div class="container mx-auto max-w-7xl px-6">
				<div class="flex flex-col items-center text-center">
					<Badge variant="secondary" class="mb-3">អំពីយើង</Badge>
					<h1 class="mb-3 text-4xl font-bold tracking-tight">ស្វាគមន៍មកកាន់ Book Lab</h1>
					<p class="max-w-2xl text-muted-foreground">
						កន្លែងដែលអ្នកស្រលាញ់សៀវភៅមកជួបជុំគ្នា ដើម្បីរៀនសូត្រ ចែករំលែក និងរីកចម្រើនជាមួយគ្នា
					</p>
				</div>
			</div>
		</section>

		<!-- Mission Section -->
		<section class="py-12">
			<div class="container mx-auto max-w-7xl px-6">
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-2">
							<BookOpen class="h-5 w-5 text-primary" />
							<Card.Title>បេសកកម្មរបស់យើង</Card.Title>
						</div>
					</Card.Header>
					<Card.Content class="space-y-3">
						<p class="text-muted-foreground">
							Book Lab ត្រូវបានបង្កើតឡើងដោយមានបេសកកម្មក្នុងការបង្កើតសហគមន៍នៃអ្នកស្រលាញ់សៀវភៅ
							ដែលពួកគេអាចរកឃើញ ពិភាក្សា និងចែករំលែកសៀវភៅដែលពួកគេចូលចិត្ត។
						</p>
						<p class="text-muted-foreground">
							យើងជឿជាក់ថាសៀវភៅមានអំណាចក្នុងការផ្លាស់ប្តូរជីវិត បង្កើតការយល់ដឹង
							និងភ្ជាប់ទំនាក់ទំនងមនុស្សពីជុំវិញពិភពលោក។
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Values Section -->
		<section class="bg-muted/30 py-12">
			<div class="container mx-auto max-w-7xl px-6">
				<div class="mb-8 text-center">
					<h2 class="mb-2 text-3xl font-bold tracking-tight">តម្លៃរបស់យើង</h2>
					<p class="text-muted-foreground">អ្វីដែលយើងតំណាងអោយ</p>
				</div>
				<div class="grid gap-4 md:grid-cols-3">
					{#each values as value}
						<Card.Root>
							<Card.Header>
								<svelte:component this={value.icon} class="mb-2 h-8 w-8 text-primary" />
								<Card.Title>{value.title}</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-sm text-muted-foreground">{value.description}</p>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</div>
		</section>

		<!-- Team Section -->
		<section class="py-12">
			<div class="container mx-auto max-w-7xl px-6">
				<div class="mb-8 text-center">
					<h2 class="mb-2 text-3xl font-bold tracking-tight">ក្រុមការងាររបស់យើង</h2>
					<p class="text-muted-foreground">ជួបជាមួយមនុស្សដែលធ្វើឱ្យវាកើតឡើង</p>
				</div>
				<div class="grid gap-4 md:grid-cols-3">
					{#each teamMembers as member}
						<Card.Root>
							<Card.Header>
								<div
									class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
								>
									<Users class="h-8 w-8 text-primary" />
								</div>
								<Card.Title>{member.name}</Card.Title>
								<Card.Description>{member.role}</Card.Description>
							</Card.Header>
							<Card.Content>
								<p class="text-sm text-muted-foreground">{member.description}</p>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</div>
		</section>

		<!-- FAQ Accordion Section -->
		<section class="bg-muted/30 py-12">
			<div class="container mx-auto max-w-4xl px-6">
				<div class="mb-8 text-center">
					<h2 class="mb-2 text-3xl font-bold tracking-tight">សំណួរដែលសួរញឹកញាប់</h2>
					<p class="text-muted-foreground">រកចម្លើយសម្រាប់សំណួររបស់អ្នក</p>
				</div>
				<Accordion.Root type="single" class="space-y-3">
					{#each faqs as faq, i}
						<Accordion.Item value={`item-${i}`}>
							<Accordion.Trigger class="text-left">
								{faq.question}
							</Accordion.Trigger>
							<Accordion.Content class="text-muted-foreground">
								{faq.answer}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		</section>

		<!-- Contact Section -->
		<section class="border-t py-12">
			<div class="container mx-auto max-w-7xl px-6">
				<div class="mx-auto max-w-3xl">
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-center text-2xl">ទាក់ទងមកយើង</Card.Title>
							<Card.Description class="text-center">យើងចង់ស្តាប់ពីអ្នក!</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="flex items-start gap-4">
								<Mail class="mt-1 h-5 w-5 text-primary" />
								<div>
									<p class="font-medium">អ៊ីមែល</p>
									<p class="text-sm text-muted-foreground">contact@booklab.com</p>
								</div>
							</div>
							<Separator />
							<div class="flex items-start gap-4">
								<Phone class="mt-1 h-5 w-5 text-primary" />
								<div>
									<p class="font-medium">ទូរស័ព្ទ</p>
									<p class="text-sm text-muted-foreground">+855 12 345 678</p>
								</div>
							</div>
							<Separator />
							<div class="flex items-start gap-4">
								<MapPin class="mt-1 h-5 w-5 text-primary" />
								<div>
									<p class="font-medium">ទីតាំង</p>
									<p class="text-sm text-muted-foreground">ភ្នំពេញ, កម្ពុជា</p>
								</div>
							</div>
							<div class="pt-2">
								<Button class="w-full">
									<Mail class="mr-2 h-4 w-4" />
									ផ្ញើសារមកយើង
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</section>
	</div>
</HomePageLayout>
