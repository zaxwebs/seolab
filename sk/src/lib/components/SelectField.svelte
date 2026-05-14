<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	type SelectOption =
		| string
		| {
				value: string;
				label: string;
				submitValue?: string;
		  };

	let {
		name,
		value = $bindable(''),
		options,
		placeholder = 'Select',
		class: className = ''
	}: {
		name: string;
		value?: string;
		options: readonly SelectOption[];
		placeholder?: string;
		class?: string;
	} = $props();

	function optionValue(option: SelectOption) {
		return typeof option === 'string' ? option : option.value;
	}

	function optionLabel(option: SelectOption) {
		return typeof option === 'string' ? option : option.label;
	}

	function submittedValue(option: SelectOption) {
		return typeof option === 'string' ? option : (option.submitValue ?? option.value);
	}

	let selectedOption = $derived(options.find((option) => optionValue(option) === value));
	let selectedLabel = $derived(selectedOption ? optionLabel(selectedOption) : placeholder);
	let formValue = $derived(selectedOption ? submittedValue(selectedOption) : value);
</script>

<input type="hidden" {name} value={formValue} />
<Select.Root type="single" bind:value>
	<Select.Trigger class={`w-full ${className}`}>
		<span data-slot="select-value">{selectedLabel}</span>
	</Select.Trigger>
	<Select.Content>
		{#each options as option}
			<Select.Item value={optionValue(option)}>{optionLabel(option)}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
