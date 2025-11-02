<script>
	const size = 12;
</script>

<div class="relative flex-1">
	<div class="absolute top-0 left-0">
		<svg width="40" height="40" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect y="29" width="29" height="29" fill="#0cc0cf" />
			<rect x="29" width="29" height="29" fill="#0cc0cf" />
		</svg>
	</div>
	<div
		class="absolute top-4 right-0 flex w-[65%] items-center justify-end gap-2
    pr-2 sm:pr-4 md:pr-4 lg:pr-4"
	>
		<span class="text-sm font-semibold">ខៀវ វិជ្ជានន្ទ</span>
		<div class="relative h-3 grow overflow-hidden bg-[#280274]">
			<div class="absolute top-[4.2px] right-0 h-[3px] w-[85%] bg-[#e1a730]"></div>
		</div>
	</div>

	<div>
		<div class="min-h-[calc(100vh-6rem)] px-6 pt-14 pb-12">
			<slot></slot>
		</div>
		<div class="relative flex w-full justify-end">
			<div
				class="absolute bottom-4 left-0 flex w-[65%] items-center justify-end gap-2
        pl-2 sm:pl-4 md:pl-4 lg:pl-4"
			>
				<div class="relative h-3 grow overflow-hidden bg-[#280274]">
					<div class="absolute top-[4.2px] left-0 h-[3px] w-[85%] bg-[#e1a730]"></div>
				</div>
				<span class="text-sm font-semibold">បណ្ឌិត បូ ច័ន្ទគុលិកា​</span>
			</div>
			<div class="absolute right-0 bottom-0">
				<svg
					width="65"
					height="65"
					viewBox="0 0 114 114"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect y="76" width="38" height="38" fill="#0cc0cf" />
					<rect x="38" y="38" width="38" height="38" fill="#0cc0cf" />
					<rect x="76" width="38" height="38" fill="#0cc0cf" />
				</svg>
			</div>
			<span class="absolute right-7.5 bottom-[1.4rem] text-sm font-semibold"> 1 </span>
		</div>
	</div>
</div>
