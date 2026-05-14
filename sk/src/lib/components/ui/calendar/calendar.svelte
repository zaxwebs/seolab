<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import type { DateValue } from '@internationalized/date';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable(),
		placeholder = $bindable(),
		type = 'single',
		class: className,
		captionLayout = undefined,
		onValueChange,
		...restProps
	}: CalendarPrimitive.RootProps & {
		value?: DateValue;
		placeholder?: DateValue;
		captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
	} = $props();
</script>

<CalendarPrimitive.Root
	bind:value={value as never}
	bind:placeholder={placeholder as never}
	{type}
	onValueChange={onValueChange as never}
	class={cn('rounded-md p-3', className)}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<CalendarPrimitive.Header class="mb-2 flex items-center justify-between">
			<CalendarPrimitive.PrevButton>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon-sm" aria-label="Previous month" {...props}>
						<ChevronLeftIcon class="size-4" />
					</Button>
				{/snippet}
			</CalendarPrimitive.PrevButton>
			<CalendarPrimitive.Heading class="text-sm font-medium" />
			<CalendarPrimitive.NextButton>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon-sm" aria-label="Next month" {...props}>
						<ChevronRightIcon class="size-4" />
					</Button>
				{/snippet}
			</CalendarPrimitive.NextButton>
		</CalendarPrimitive.Header>
		{#each months as month}
			<CalendarPrimitive.Grid class="w-full border-collapse">
				<CalendarPrimitive.GridHead>
					<CalendarPrimitive.GridRow class="grid grid-cols-7">
						{#each weekdays as weekday}
							<CalendarPrimitive.HeadCell class="grid size-8 place-items-center text-[0.75rem] font-medium text-muted-foreground">
								{weekday}
							</CalendarPrimitive.HeadCell>
						{/each}
					</CalendarPrimitive.GridRow>
				</CalendarPrimitive.GridHead>
				<CalendarPrimitive.GridBody>
					{#each month.weeks as weekDates}
						<CalendarPrimitive.GridRow class="mt-1 grid grid-cols-7">
							{#each weekDates as date}
								<CalendarPrimitive.Cell {date} month={month.value} class="grid size-8 place-items-center p-0">
									<CalendarPrimitive.Day>
										{#snippet child({ props, selected, disabled, unavailable, day })}
											<div
												class={cn(
													'grid size-8 place-items-center rounded-full text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
													selected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
													(disabled || unavailable) && 'pointer-events-none opacity-40'
												)}
												{...props}
											>
												{day}
											</div>
										{/snippet}
									</CalendarPrimitive.Day>
								</CalendarPrimitive.Cell>
							{/each}
						</CalendarPrimitive.GridRow>
					{/each}
				</CalendarPrimitive.GridBody>
			</CalendarPrimitive.Grid>
		{/each}
	{/snippet}
</CalendarPrimitive.Root>
