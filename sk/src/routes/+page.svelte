<script lang="ts">
	import type { Component } from 'svelte';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check';
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import Globe2Icon from '@lucide/svelte/icons/globe-2';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { logTypeBadgeClass, reviewTimingBadgeClass, reviewTimingLabel, statusBadgeClass, toDateInput } from '$lib/seolab.js';

	let { data } = $props();
</script>

<svelte:head><title>seolab dashboard</title></svelte:head>

<section class="page-wrap">
	<div class="page-header">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
			<p class="text-sm text-muted-foreground">Active experiments, review deadlines, and recent notebook entries.</p>
		</div>
		<Button href="/websites/new">
			<PlusIcon class="size-4" />
			Add website
		</Button>
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		{@render StatCard('Total websites', data.websites.length, Globe2Icon, 'blue')}
		{@render StatCard('Active experiments', data.activeExperiments.length, FlaskConicalIcon, 'purple')}
		{@render StatCard('Review queue', data.reviewQueue.length, ClipboardCheckIcon, 'pink')}
		{@render StatCard('Recent logs', data.recentLogs.length, BookOpenIcon, 'cyan')}
	</div>

	<div class="grid gap-4 xl:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Review queue</Card.Title>
				<Card.Description>Experiments due soon or past their review date.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-3">
				{#if data.reviewQueue.length}
					{#each data.reviewQueue as experiment}
						<a class="list-row" href={`/experiments/${experiment.id}`}>
							<div>
								<p class="font-medium">{experiment.title}</p>
								<p class="text-sm text-muted-foreground">
									{data.websites.find((website) => website.id === experiment.website)?.name} · {toDateInput(experiment.expected_review_date)}
								</p>
							</div>
							<Badge class={reviewTimingBadgeClass(experiment.expected_review_date)}>
								{reviewTimingLabel(experiment.expected_review_date)}
							</Badge>
						</a>
					{/each}
				{:else}
					{@render Empty(ClipboardCheckIcon, 'Nothing due soon', 'No active experiment is due for review in the next 7 days.')}
				{/if}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Recent logs</Card.Title>
				<Card.Description>Latest observations and decisions.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-3">
				{#if data.recentLogs.length}
					{#each data.recentLogs as log}
						<a class="list-row" href={`/experiments/${log.experiment}`}>
							<div>
								<p class="font-medium">
									{data.experiments.find((experiment) => experiment.id === log.experiment)?.title}
								</p>
								<p class="text-sm text-muted-foreground">{toDateInput(log.log_date) || 'Undated'}</p>
							</div>
							<Badge class={logTypeBadgeClass(log.log_type)}>{log.log_type}</Badge>
						</a>
					{/each}
				{:else}
					{@render Empty(BookOpenIcon, 'No logs yet', 'Add a log from an experiment page.')}
				{/if}
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Recently completed experiments</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if data.completedExperiments.length}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Experiment</Table.Head>
							<Table.Head>Website</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Confidence</Table.Head>
							<Table.Head>Learning</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.completedExperiments as experiment}
							<Table.Row>
								<Table.Cell><a class="font-medium hover:underline" href={`/experiments/${experiment.id}`}>{experiment.title}</a></Table.Cell>
								<Table.Cell>{data.websites.find((website) => website.id === experiment.website)?.name}</Table.Cell>
								<Table.Cell><Badge class={statusBadgeClass(experiment.status)}>{experiment.status}</Badge></Table.Cell>
								<Table.Cell>{experiment.confidence || 'Not set'}</Table.Cell>
								<Table.Cell class="max-w-md truncate">{experiment.learnings || 'No learning recorded yet'}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				{@render Empty(Globe2Icon, 'No completed experiments', 'Close an experiment to build a learning library.')}
			{/if}
		</Card.Content>
	</Card.Root>
</section>

{#snippet StatCard(label: string, value: number, icon: Component, tone: 'blue' | 'purple' | 'pink' | 'cyan')}
	{@const Icon = icon}
	{@const toneClass =
		tone === 'blue'
			? 'bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]'
			: tone === 'purple'
				? 'bg-[color:var(--brand-purple)]/10 text-[color:var(--brand-purple)]'
				: tone === 'pink'
					? 'bg-[color:var(--brand-pink)]/10 text-[color:var(--brand-pink)]'
					: 'bg-[color:var(--brand-cyan)]/10 text-[color:var(--brand-cyan)]'}
	<Card.Root class="overflow-hidden border-transparent">
		<Card.Header>
			<Card.Description>{label}</Card.Description>
			<div class="mt-2 flex items-center gap-3">
				<div class={`grid size-10 place-items-center rounded-full ${toneClass}`}>
					<Icon class="size-5" />
				</div>
				<Card.Title class="text-4xl leading-none">{value}</Card.Title>
			</div>
		</Card.Header>
	</Card.Root>
{/snippet}

{#snippet Empty(icon: Component, title: string, text: string)}
	{@const Icon = icon}
	<div class="grid min-h-40 place-items-center rounded-md border border-dashed p-6 text-center">
		<div>
			<Icon class="mx-auto mb-3 size-6 text-muted-foreground" />
			<p class="font-medium">{title}</p>
			<p class="mt-1 text-sm text-muted-foreground">{text}</p>
		</div>
	</div>
{/snippet}
