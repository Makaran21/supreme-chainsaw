<script lang="ts">
	export let allBooksLength: number;
</script>

<footer class="mx-auto max-w-7xl border-t border-border px-6 py-16 sm:py-20">
	<div class="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3">
		<div class="group">
			<div class="mb-3 text-6xl font-black transition-colors group-hover:text-primary">
				{allBooksLength}K
			</div>
			<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">Total Sold</p>
		</div>
		<div class="group">
			<div class="mb-3 text-6xl font-black text-primary">12.5K</div>
			<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">Monthly Sells</p>
		</div>
		<div class="group">
			<div class="mb-3 text-6xl font-black text-accent">98%</div>
			<p class="text-sm font-medium tracking-wide text-muted-foreground uppercase">Satisfaction</p>
		</div>
	</div>
	<div class="border-t border-border pt-8 text-center">
		<p class="text-sm text-muted-foreground">
			© 2025 Book Library • Your trusted source for great reads
		</p>
	</div>
</footer>
