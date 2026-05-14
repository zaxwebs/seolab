<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { formatDisplayDate } from '$lib/seolab.js';
	import { cn } from '$lib/utils.js';

	let {
		name,
		value = '',
		placeholder = 'Pick a date',
		required = false,
		class: className = ''
	}: {
		name: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		class?: string;
	} = $props();

	function parseInputDate(date: string): DateValue | undefined {
		if (!date) return undefined;
		try {
			return parseDate(date.slice(0, 10));
		} catch {
			return undefined;
		}
	}

	let open = $state(false);
	let selected = $state<DateValue | undefined>();
	let submittedValue = $derived(selected?.toString() ?? '');

	onMount(() => {
		selected = parseInputDate(value);
	});
</script>

<input type="hidden" {name} value={submittedValue} {required} />
<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn('w-full justify-start gap-2 rounded-full bg-background text-left font-normal', !selected && 'text-muted-foreground', className)}
			>
				<CalendarIcon class="size-4" />
				{selected ? formatDisplayDate(selected.toString()) : placeholder}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto overflow-hidden p-0" align="start">
		<Calendar
			type="single"
			bind:value={selected}
			placeholder={selected ?? today(getLocalTimeZone())}
			captionLayout="dropdown"
			onValueChange={() => {
				open = false;
			}}
		/>
	</Popover.Content>
</Popover.Root>
