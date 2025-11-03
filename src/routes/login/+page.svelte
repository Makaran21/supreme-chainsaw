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

	export let form;
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<HomePageLayout>
	<div class="p-4 md:flex md:min-h-[calc(100vh-6rem)] md:items-center md:justify-center">
		<Card class="w-full max-w-md">
			<CardHeader>
				<CardTitle class="text-2xl">Login</CardTitle>
				<CardDescription>Enter your credentials to access your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" use:enhance>
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="phone">Phone Number</Label>
							<div class="relative">
								<Phone class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="phone"
									name="phone"
									type="tel"
									placeholder="+855 123 456 789"
									class="pl-10"
									required
								/>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="password">Password</Label>
							<div class="relative">
								<Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Enter your password"
									class="pl-10"
									required
									minlength={6}
								/>
							</div>
						</div>

						{#if form?.error}
							<Alert variant="destructive">
								<AlertDescription>{form.error}</AlertDescription>
							</Alert>
						{/if}

						<Button type="submit" class="w-full">Login</Button>
					</div>
				</form>
			</CardContent>
			<CardFooter class="flex flex-col space-y-2">
				<div class="text-center text-sm text-gray-500">Don't have an account?</div>
				<Button variant="outline" class="w-full" href="/register">Create an account</Button>
			</CardFooter>
		</Card>
	</div>
</HomePageLayout>