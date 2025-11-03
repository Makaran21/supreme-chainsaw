<script lang="ts">
	import { enhance } from '$app/forms';
	import HomePageLayout from '$lib/components/client/HomePageLayout.svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Hash from '@lucide/svelte/icons/hash';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Phone from '@lucide/svelte/icons/phone';
	import Save from '@lucide/svelte/icons/save';
	import User from '@lucide/svelte/icons/user';
	import Shield from '@lucide/svelte/icons/shield';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>ប្រវត្តិរូប</title>
</svelte:head>

<HomePageLayout>
	<div class="min-h-screen py-12 dark:from-slate-900 dark:to-slate-950">
		<div class="mx-auto w-full max-w-3xl space-y-10 px-4">
			<!-- Header -->
			<div class="flex flex-col items-center space-y-3 text-center">
				<div
					class="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white"
				>
					<User class="h-10 w-10" />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">{data.user.username}</h1>
					<p class="text-sm text-slate-600 dark:text-slate-400">គ្រប់គ្រងការកំណត់គណនីរបស់អ្នក</p>
				</div>
				<Badge class="bg-green-500 text-white">Active</Badge>
			</div>

			<!-- Combined Profile Card -->
			<Card class="rounded border-0">
				<CardHeader class="border-b p-4">
					<div class="flex items-center gap-2">
						<Shield class="h-5 w-5 text-primary" />
						<div>
							<CardTitle>ព័ត៌មានប្រវត្តិរូប</CardTitle>
							<CardDescription class="mt-1"
								>មើល និង កែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</CardDescription
							>
						</div>
					</div>
				</CardHeader>

				<CardContent class="p-4">
					<form method="POST" action="?/update" use:enhance>
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<!-- Username -->
							<div class="space-y-2">
								<Label for="username">ឈ្មោះអ្នកប្រើ</Label>
								<div class="relative">
									<User class="absolute top-3 left-3 h-4 w-4 text-slate-400" />
									<Input
										id="username"
										name="username"
										type="text"
										value={data.user.username}
										required
										class="pl-10"
									/>
								</div>
							</div>

							<!-- Phone -->
							<div class="space-y-2">
								<Label for="phone">លេខទូរស័ព្ទ</Label>
								<div class="relative">
									<Phone class="absolute top-3 left-3 h-4 w-4 text-slate-400" />
									<Input
										id="phone"
										name="phone"
										type="tel"
										value={data.user.phone}
										required
										class="pl-10"
									/>
								</div>
							</div>

							<!-- Age -->
							<div class="space-y-2">
								<Label for="age">អាយុ <span class="text-xs text-slate-500">(ជាជម្រើស)</span></Label>
								<div class="relative">
									<Calendar class="absolute top-3 left-3 h-4 w-4 text-slate-400" />
									<Input
										id="age"
										name="age"
										type="number"
										value={data.user.age}
										min="1"
										max="150"
										class="pl-10"
									/>
								</div>
							</div>

							<!-- User ID (read-only) -->
							<div class="space-y-2">
								<Label>លេខសម្គាល់អ្នកប្រើ</Label>
								<div class="relative">
									<Hash class="absolute top-3 left-3 h-4 w-4 text-slate-400" />
									<Input
										value={data.user.id}
										readonly
										class="pl-10 font-mono text-sm text-slate-500 dark:text-slate-400"
									/>
								</div>
							</div>
						</div>

						{#if form?.error}
							<Alert variant="destructive" class="mt-6">
								<AlertDescription>{form.error}</AlertDescription>
							</Alert>
						{/if}

						{#if form?.success}
							<Alert
								class="mt-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
							>
								<AlertDescription class="text-green-800 dark:text-green-200">
									{form.success}
								</AlertDescription>
							</Alert>
						{/if}

						<div class="mx-auto mt-8 flex w-full flex-row justify-center">
							<Button type="submit" class="w-full cursor-pointer sm:w-36 ">
								<Save class="mr-2 h-4 w-4" /> រក្សាទុក
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<!-- Logout -->
			<div class="flex justify-center">
				<form method="POST" action="?/logout" use:enhance>
					<Button type="submit" variant="destructive" class="w-full cursor-pointer sm:w-36">
						<LogOut class="mr-2 h-4 w-4" /> ចេញពីប្រព័ន្ធ
					</Button>
				</form>
			</div>
		</div>
	</div>
</HomePageLayout>
