<script lang="ts">
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SelectField from '$lib/components/SelectField.svelte';
	import { formatDisplayDate, isReadyForReview, statusBadgeClass } from '$lib/seolab.js';

	let { data } = $props();
</script>

<svelte:head><title>{data.website.name} · seolab</title></svelte:head>

<section class="page-wrap">
	<Button variant="ghost" class="-ml-2" href="/websites">
		<ArrowLeftIcon class="size-4" />
		Websites
	</Button>

	<div class="page-header">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<h1 class="text-2xl font-semibold tracking-tight">{data.website.name}</h1>
				<Badge variant={data.website.archived ? 'outline' : 'secondary'}>{data.website.archived ? 'Archived' : 'Active'}</Badge>
			</div>
			<p class="text-sm text-muted-foreground">{data.website.domain}</p>
			{#if data.website.description}
				<p class="mt-2 max-w-3xl text-sm">{data.website.description}</p>
			{/if}
		</div>
		<div class="flex flex-wrap gap-2">
			<Button href={`/websites/${data.website.id}/experiments/new`}>
				<PlusIcon class="size-4" />
				Create experiment
			</Button>
			<Button variant="outline" href={`/websites/${data.website.id}/edit`}>Edit</Button>
			<form method="POST" action="?/archive">
				<Button variant="outline" type="submit"><ArchiveIcon class="size-4" /> {data.website.archived ? 'Unarchive' : 'Archive'}</Button>
			</form>
			<form method="POST" action="?/delete">
				<Button variant="outline" type="submit"><Trash2Icon class="size-4" /> Delete</Button>
			</form>
		</div>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Experiments</Card.Title>
			<Card.Description>{data.experiments.length} shown · {data.activeCount} active</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<form class="grid gap-3 md:grid-cols-3" method="GET">
				<label class="field">
					<span>Status</span>
					<SelectField name="status" value={data.status || 'All'} options={['All', ...data.statuses]} />
				</label>
				<label class="field">
					<span>Type</span>
					<SelectField name="type" value={data.type || 'All'} options={['All', ...data.types]} />
				</label>
				<label class="field">
					<span>Tag</span>
					<div class="flex gap-2">
						<Input name="tag" value={data.tag} placeholder="template, ctr, cluster" />
						<Button type="submit">Filter</Button>
					</div>
				</label>
			</form>

			{#if data.experiments.length}
				<div class="grid gap-3">
					{#each data.experiments as experiment}
						<a class="list-row items-start" href={`/experiments/${experiment.id}`}>
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<p class="truncate font-medium">{experiment.title}</p>
									<Badge variant="outline">{experiment.experiment_type}</Badge>
									<Badge class={statusBadgeClass(experiment.status)}>{experiment.status}</Badge>
									{#if isReadyForReview(experiment)}
										<Badge class="bg-teal-600 text-white">Review</Badge>
									{/if}
								</div>
								<p class="mt-2 line-clamp-2 text-sm text-muted-foreground">{experiment.hypothesis}</p>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each experiment.tags ?? [] as tag}
										<Badge variant="secondary">{tag}</Badge>
									{/each}
								</div>
							</div>
							<div class="text-sm text-muted-foreground md:text-right">
								<p>Metric: {experiment.primary_metric}</p>
								<p>Review: {formatDisplayDate(experiment.expected_review_date) || 'Not set'}</p>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="grid min-h-48 place-items-center rounded-md border border-dashed p-6 text-center">
					<div>
						<FlaskConicalIcon class="mx-auto mb-3 size-6 text-muted-foreground" />
						<p class="font-medium">No experiments yet</p>
						<p class="mt-1 text-sm text-muted-foreground">Create an experiment to start your lab notebook.</p>
						<Button class="mt-4" href={`/websites/${data.website.id}/experiments/new`}>Create experiment</Button>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</section>
