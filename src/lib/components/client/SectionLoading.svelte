<script>
	import { Loader2 } from "@lucide/svelte";

</script>
<div class="flex min-h-[calc(100vh-13rem)] items-center justify-center">
	<div class="relative">
		<div class="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
		<div
			class="relative flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 shadow-lg"
		>
			<Loader2 class="h-6 w-6 animate-spin text-white" />
		</div>
	</div>
</div>
