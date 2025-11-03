<script lang="ts">
	import { enhance } from '$app/forms';
	import HomePageLayout from '$lib/components/client/HomePageLayout.svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Lock from '@lucide/svelte/icons/lock';
	import Phone from '@lucide/svelte/icons/phone';
	import User from '@lucide/svelte/icons/user';

	export let form;
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<HomePageLayout>
	<div class="p-4 md:flex md:min-h-[calc(100vh-6rem)] md:items-center md:justify-center">
		<Card class="w-full max-w-md">
			<CardHeader>
				<CardTitle class="text-2xl">Create an account</CardTitle>
				<CardDescription>Enter your information to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" use:enhance>
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="username">Username</Label>
							<div class="relative">
								<User class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input
									id="username"
									name="username"
									type="text"
									placeholder="Choose a username"
									class="pl-10"
									value={form?.username ?? ''}
									required
								/>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="phone">Phone Number</Label>
							<div class="relative">
								<Phone class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input
									id="phone"
									name="phone"
									type="tel"
									placeholder="+855 123 456 789"
									class="pl-10"
									value={form?.phone ?? ''}
									required
								/>
							</div>
							<p class="text-xs text-gray-500">Enter your phone number with country code</p>
						</div>

						<div class="space-y-2">
							<Label for="password">Password</Label>
							<div class="relative">
								<Lock class="absolute top-3 left-3 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Create a password (min 6 characters)"
									class="pl-10"
									required
									minlength={6}
								/>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="age">Age <span class="text-sm text-gray-500">(optional)</span></Label>
							<Input
								id="age"
								name="age"
								type="number"
								placeholder="Enter your age"
								value={form?.age ?? ''}
								min="1"
								max="150"
							/>
						</div>

						{#if form?.error}
							<Alert variant="destructive">
								<AlertDescription>{form.error}</AlertDescription>
							</Alert>
						{/if}

						{#if form}
							<Alert>
								<AlertDescription>Register success</AlertDescription>
							</Alert>
						{/if}

						<Button type="submit" class="w-full">Create account</Button>
					</div>
				</form>
			</CardContent>
			<CardFooter class="flex flex-col space-y-2">
				<div class="text-center text-sm text-gray-500">Already have an account?</div>
				<Button variant="outline" class="w-full" href="/login">Sign in</Button>
			</CardFooter>
		</Card>
	</div>
</HomePageLayout>
