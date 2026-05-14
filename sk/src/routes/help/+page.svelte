<script lang="ts">
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import Globe2Icon from '@lucide/svelte/icons/globe-2';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { logTypeBadgeClass, statusBadgeClass } from '$lib/seolab.js';

	const summary = [
		{ icon: Globe2Icon, title: 'Website', text: 'A site or property where experiments happen.' },
		{ icon: FlaskConicalIcon, title: 'Experiment', text: 'A hypothesis-driven SEO change under a website.' },
		{ icon: NotebookPenIcon, title: 'Logs', text: 'Dated observations, implementation notes, and metric snapshots.' },
		{ icon: CheckCircle2Icon, title: 'Review', text: 'A decision: won, lost, inconclusive, or abandoned.' }
	];

	const steps = [
		['1', 'Add a website', 'Create the website you want to study.'],
		['2', 'Create an experiment', 'Write a clear hypothesis and define pages, metrics, and dates.'],
		['3', 'Add logs', 'Record changes, observations, metric updates, issues, and external events.'],
		['4', 'Review', 'When the review date arrives, summarize what happened.'],
		['5', 'Decide', 'Mark the experiment as won, lost, inconclusive, or abandoned.']
	];

	const pages = [
		['Dashboard', '/', 'Shows totals, the review queue, recent logs, and completed experiments.'],
		['Websites', '/websites', 'Shows all websites with experiment counts, active counts, last activity, and archive status.'],
		['Website detail', '', 'Shows one website and its experiments. Create a new experiment from here.'],
		['Experiments', '/experiments', 'Shows all experiments across all websites with filters for status, type, tag, website, and search.'],
		['Experiment detail', '', 'The main workspace. Add logs, review fields, inspect pages, and change status.']
	];

	const statuses = [
		['Planned', 'The experiment is designed but not implemented yet.'],
		['Running', 'The change is live and you are waiting for data.'],
		['Monitoring', 'Initial effects are visible, but you are still watching before deciding.'],
		['Won', 'The result supported the hypothesis enough to keep or expand the change.'],
		['Lost', 'The result moved against the hypothesis or caused a downside.'],
		['Inconclusive', 'The result was unclear, noisy, or not enough to justify a decision.'],
		['Abandoned', 'The experiment was stopped before a useful review.']
	];

	const exampleFields = [
		['Website', 'Northstar Analytics · northstar.example · US B2B SaaS'],
		['Title', 'Rewrite comparison page title tags for buying intent'],
		['Type', 'Title tag change'],
		['Target URLs', '/compare/acme-alternative\n/compare/best-analytics-tools\n/compare/data-platforms'],
		['Control URLs', '/compare/reporting-tools\n/compare/dashboard-software'],
		['Primary metric', 'Organic CTR'],
		['Secondary metrics', 'Organic clicks, impressions, average position, demo clicks'],
		['Baseline notes', 'Target pages average 2.1% CTR over the previous 28 days. Rankings are stable between positions 4 and 8.'],
		['Implementation notes', 'Changed titles to include “alternative”, “pricing”, and “for SaaS teams” phrasing. No content changes made.'],
		['Review date', '28 days after implementation.'],
		['Tags', 'ctr, comparison-pages, commercial-intent']
	];

	const logs = [
		{
			type: 'Implementation',
			date: '2026-05-13',
			note: 'Updated title tags on the three target URLs. Submitted URLs for recrawl. No other page changes made.',
			metrics: 'CTR: 2.1%\nClicks: 318\nAverage position: 5.8'
		},
		{
			type: 'Observation',
			date: '2026-05-27',
			note: 'Impressions are roughly flat. CTR has started moving upward on two of three target pages.',
			metrics: 'CTR: 2.7%\nClicks: 354'
		},
		{
			type: 'External event',
			date: '2026-05-30',
			note: 'Competitor launched a new comparison page targeting one of the same queries.',
			metrics: ''
		}
	];

	const review = [
		['Final status', 'Won'],
		['Result summary', 'CTR increased from 2.1% to 3.0% across the target pages while control pages stayed flat. Clicks increased, rankings were mostly unchanged.'],
		['Confidence', 'Medium'],
		['Learnings', 'Commercial-intent language in title tags appears to help comparison pages earn more clicks without requiring ranking movement.'],
		['Next action', 'Roll this title pattern out to five more comparison pages, but keep a control group.']
	];

	const fields = [
		['Target URLs', 'Pages where you make the SEO change. Put one URL per line.'],
		['Control URLs', 'Similar pages you do not change. Optional, but useful for context.'],
		['Primary metric', 'The main signal you care about, such as organic clicks, CTR, conversions, or indexed pages.'],
		['Secondary metrics', 'Supporting signals. Example: impressions, average position, demo clicks, bounce rate.'],
		['Review date', 'The date when you should stop waiting and write a review. You can adjust it from the experiment detail page as observations come in.'],
		['Confidence', 'Low, Medium, or High. This is your judgment quality, not a statistical test.'],
		['Tags', 'Short labels like template, ctr, internal-linking, content-refresh, local-seo.'],
		['Next action', 'What you will do because of this result: keep, revert, expand, repeat, or design a follow-up.']
	];

</script>

<svelte:head><title>Help · seolab</title></svelte:head>

<section class="page-wrap max-w-6xl">
	<div>
		<div class="mb-2 flex items-center gap-2">
			<Badge variant="secondary">Guide</Badge>
			<span class="text-sm text-muted-foreground">How to use seolab</span>
		</div>
		<h1 class="text-2xl font-semibold tracking-tight">Help</h1>
		<p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
			seolab is a lightweight lab notebook for SEO experiments. It helps you record what you changed,
			why you changed it, what happened over time, and what you learned.
		</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		{#each summary as item}
			{@const Icon = item.icon}
			<Card.Root>
				<Card.Header>
					<div class="mb-2 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<Icon class="size-4" />
					</div>
					<Card.Title class="text-base">{item.title}</Card.Title>
					<Card.Description>{item.text}</Card.Description>
				</Card.Header>
			</Card.Root>
		{/each}
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>The Core Workflow</Card.Title>
			<Card.Description>Website → Experiment → Logs → Review → Decision</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4 md:grid-cols-5">
			{#each steps as [number, title, text]}
				<div class="rounded-md border p-4">
					<div class="mb-3 flex size-8 items-center justify-center rounded-md bg-muted text-sm font-semibold">{number}</div>
					<p class="font-medium">{title}</p>
					<p class="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>

	<div class="grid gap-4 xl:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Pages</Card.Title>
				<Card.Description>Where each task lives in the app.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				{#each pages as [title, href, text]}
					<div class="rounded-md border p-4">
						{#if href}
							<a class="font-medium hover:underline" href={href}>{title}</a>
						{:else}
							<p class="font-medium">{title}</p>
						{/if}
						<p class="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Status Guide</Card.Title>
				<Card.Description>Use statuses to keep your lab queue honest.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-3 text-sm">
				{#each statuses as [name, text]}
					{@const isLast = name === statuses[statuses.length - 1][0]}
					<div class="space-y-3">
						<div class="space-y-1">
							<Badge class={statusBadgeClass(name)}>{name}</Badge>
							<p class="leading-6 text-muted-foreground">{text}</p>
						</div>
						{#if !isLast}
							<Separator />
						{/if}
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Writing a Good Hypothesis</Card.Title>
			<Card.Description>Use a scientific structure, not a vague task description.</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="rounded-md border bg-muted/40 p-4 text-sm leading-6">
				If I <strong>[make this change]</strong> to <strong>[these pages]</strong>, then
				<strong>[this metric]</strong> should <strong>[increase/decrease]</strong> within
				<strong>[timeframe]</strong>, because <strong>[reason]</strong>.
			</div>
			<div class="grid gap-4 md:grid-cols-2">
				<div class="rounded-md border p-4">
					<p class="font-medium">Good example</p>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">
						If I rewrite the title tags on the pricing comparison pages to include clearer buying-intent terms,
						then organic CTR should increase within 28 days, because the pages will better match commercial search intent in the SERP.
					</p>
				</div>
				<div class="rounded-md border p-4">
					<p class="font-medium">Weak example</p>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">Update title tags and see if rankings improve.</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Example Experiment</Card.Title>
			<Card.Description>A realistic end-to-end entry.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4 md:grid-cols-2">
			{#each exampleFields as [title, text]}
				<div>
					<p class="mb-1 text-sm font-medium">{title}</p>
					<p class="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{text}</p>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>

	<div class="grid gap-4 xl:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Example Logs</Card.Title>
				<Card.Description>Use logs to preserve timing and context.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				{#each logs as log}
					<div class="rounded-md border p-4">
						<div class="mb-2 flex flex-wrap items-center gap-2">
							<Badge class={logTypeBadgeClass(log.type)}>{log.type}</Badge>
							<span class="text-sm text-muted-foreground">{log.date}</span>
						</div>
						<p class="text-sm leading-6">{log.note}</p>
						{#if log.metrics}
							<pre class="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-xs text-muted-foreground">{log.metrics}</pre>
						{/if}
					</div>
				{/each}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Example Review</Card.Title>
				<Card.Description>Close the loop with a decision and learning.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				{#each review as [title, text]}
					<div>
						<p class="mb-1 text-sm font-medium">{title}</p>
						<p class="text-sm leading-6 text-muted-foreground">{text}</p>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Field Reference</Card.Title>
			<Card.Description>What to enter in each experiment field.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4 md:grid-cols-2">
			{#each fields as [title, text]}
				<div>
					<p class="mb-1 text-sm font-medium">{title}</p>
					<p class="text-sm leading-6 text-muted-foreground">{text}</p>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>
</section>
