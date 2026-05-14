<script lang="ts">
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import SelectField from '$lib/components/SelectField.svelte';
	import { formatDisplayDate, isReadyForReview, statusBadgeClass } from '$lib/seolab.js';

	let { data } = $props();
</script>

<svelte:head><title>Experiments · seolab</title></svelte:head>

<section class="page-wrap">
	<div class="page-header">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Experiments</h1>
			<p class="text-sm text-muted-foreground">
				All SEO experiments across websites. {data.readyCount} currently ready for review.
			</p>
		</div>
		<Button href="/websites">
			<FlaskConicalIcon class="size-4" />
			Create from website
		</Button>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Filter experiments</Card.Title>
			<Card.Description>Search by title, hypothesis, metric, website, status, type, or tag.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]" method="GET">
				<label class="field">
					<span>Search</span>
					<div class="relative">
						<SearchIcon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input class="pl-9" name="q" value={data.q} placeholder="pricing pages, CTR, schema..." />
					</div>
				</label>
				<label class="field">
					<span>Website</span>
					<SelectField
						name="website"
						value={data.website || 'All'}
						options={['All', ...data.websites.map((website) => ({ value: website.id, label: website.name }))]}
					/>
				</label>
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
					<Input name="tag" value={data.tag} placeholder="template" />
				</label>
				<div class="flex items-end">
					<Button type="submit" class="w-full">Apply</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>{data.experiments.length} experiments</Card.Title>
			<Card.Description>Open an experiment to add logs, review, or change status.</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.experiments.length}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Experiment</Table.Head>
							<Table.Head>Website</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Type</Table.Head>
							<Table.Head>Primary metric</Table.Head>
							<Table.Head>Review date</Table.Head>
							<Table.Head>Tags</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.experiments as experiment}
							<Table.Row>
								<Table.Cell class="max-w-md">
									<a class="font-medium hover:underline" href={`/experiments/${experiment.id}`}>{experiment.title}</a>
									<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{experiment.hypothesis}</p>
								</Table.Cell>
								<Table.Cell>
									<a class="hover:underline" href={`/websites/${experiment.website}`}>
										{data.websites.find((website) => website.id === experiment.website)?.name ?? 'Unknown'}
									</a>
								</Table.Cell>
								<Table.Cell>
									<div class="flex flex-wrap gap-2">
										<Badge class={statusBadgeClass(experiment.status)}>{experiment.status}</Badge>
										{#if isReadyForReview(experiment)}
											<Badge class="bg-teal-600 text-white">Review</Badge>
										{/if}
									</div>
								</Table.Cell>
								<Table.Cell>{experiment.experiment_type}</Table.Cell>
								<Table.Cell>{experiment.primary_metric}</Table.Cell>
								<Table.Cell>{formatDisplayDate(experiment.expected_review_date) || 'Not set'}</Table.Cell>
								<Table.Cell>
									<div class="flex flex-wrap gap-1">
										{#each experiment.tags ?? [] as tag}
											<Badge variant="secondary">{tag}</Badge>
										{/each}
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<div class="grid min-h-56 place-items-center rounded-md border border-dashed p-6 text-center">
					<div>
						<FlaskConicalIcon class="mx-auto mb-3 size-6 text-muted-foreground" />
						<p class="font-medium">No experiments found</p>
						<p class="mt-1 text-sm text-muted-foreground">Create an experiment from a website detail page.</p>
						<Button class="mt-4" href="/websites">Open websites</Button>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</section>
