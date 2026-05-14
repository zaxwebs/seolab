<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ExperimentForm from '$lib/components/ExperimentForm.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data, form } = $props();
</script>

<svelte:head><title>Edit {data.experiment.title} · seolab</title></svelte:head>

<section class="page-wrap">
	<Button variant="ghost" class="-ml-2" href={`/experiments/${data.experiment.id}`}>
		<ArrowLeftIcon class="size-4" />
		{data.experiment.title}
	</Button>

	{#if form?.message}
		<Alert.Root variant="destructive">
			<Alert.Description>{form.message}</Alert.Description>
		</Alert.Root>
	{/if}

	<ExperimentForm experiment={data.experiment} cancelHref={`/experiments/${data.experiment.id}`} title="Edit experiment" />
</section>
