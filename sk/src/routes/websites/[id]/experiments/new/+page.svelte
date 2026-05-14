<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExperimentForm from '$lib/components/ExperimentForm.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data, form } = $props();
</script>

<svelte:head><title>Create experiment · {data.website.name}</title></svelte:head>

<section class="page-wrap">
	<Button variant="ghost" class="-ml-2" href={`/websites/${data.website.id}`}>
		<ArrowLeftIcon class="size-4" />
		{data.website.name}
	</Button>

	{#if form?.message}
		<Alert.Root variant="destructive">
			<Alert.Description>{form.message}</Alert.Description>
		</Alert.Root>
	{/if}

	<ExperimentForm cancelHref={`/websites/${data.website.id}`} />
</section>
