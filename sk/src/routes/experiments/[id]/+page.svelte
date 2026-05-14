<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import DatePickerField from '$lib/components/DatePickerField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import {
		ACTIVE_STATUSES,
		CONFIDENCE_LEVELS,
		arrayToComma,
		formatDisplayDate,
		logTypeBadgeClass,
		statusBadgeClass,
		toDateInput,
		todayInput
	} from '$lib/seolab.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let { data } = $props();
	const REVIEW_STATUSES = ['Won', 'Lost', 'Inconclusive', 'Abandoned'] as const;

	function isReviewStatus(status: string): status is (typeof REVIEW_STATUSES)[number] {
		return REVIEW_STATUSES.includes(status as (typeof REVIEW_STATUSES)[number]);
	}

	function metricSnapshotText(snapshot?: Record<string, string>) {
		return Object.entries(snapshot ?? {})
			.map(([key, value]) => `${key}: ${value}`)
			.join('\n');
	}

</script>

<svelte:head><title>{data.experiment.title} · seolab</title></svelte:head>

<section class="page-wrap">
	<Button variant="ghost" class="-ml-2" href={`/websites/${data.website.id}`}>
		<ArrowLeftIcon class="size-4" />
		{data.website.name}
	</Button>

	<div class="page-header">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<h1 class="text-2xl font-semibold tracking-tight">{data.experiment.title}</h1>
				<Badge class={statusBadgeClass(data.experiment.status)}>{data.experiment.status}</Badge>
				<Badge variant="outline">{data.experiment.experiment_type}</Badge>
			</div>
			<p class="mt-2 max-w-3xl text-sm text-muted-foreground">{data.experiment.hypothesis}</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button href={`/experiments/${data.experiment.id}/edit`}>Edit experiment</Button>
			{@render AddLogDialog('outline', '')}
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" {...props}><Trash2Icon class="size-4" /> Delete</Button>
					{/snippet}
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Delete experiment?</AlertDialog.Title>
						<AlertDialog.Description>
							This permanently removes the experiment, including its logs. Use this only when the experiment was created by mistake.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<form method="POST" action="?/delete">
						<AlertDialog.Footer class="mt-4 gap-2">
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action variant="destructive" type="submit">
								<Trash2Icon class="size-4" />
								Delete experiment
							</AlertDialog.Action>
						</AlertDialog.Footer>
					</form>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
		<div class="space-y-4">
			<section class="surface-panel">
				<div class="border-b px-5 py-4">
					<h2 class="text-lg font-semibold tracking-tight">Baseline and result</h2>
				</div>
				<div class="grid gap-4 p-5 md:grid-cols-2">
					{@render Info('Baseline notes', data.experiment.baseline_notes)}
					{@render Info('Implementation notes', data.experiment.implementation_notes)}
					{@render Info('Result summary', data.experiment.result_summary)}
					{@render Info('Learnings', data.experiment.learnings)}
					{@render Info('Next action', data.experiment.next_action)}
				</div>
			</section>

			<section class="surface-panel">
				<div class="border-b px-5 py-4">
					<h2 class="text-lg font-semibold tracking-tight">Pages and measurement</h2>
				</div>
				<div class="grid gap-5 p-5 md:grid-cols-2">
					{@render Urls('Target URLs', data.experiment.target_urls)}
					{@render Urls('Control URLs', data.experiment.control_urls)}
					{@render Info('Secondary metrics', arrayToComma(data.experiment.secondary_metrics))}
					<div>
						<p class="mb-2 text-sm font-medium">Tags</p>
						{#if data.experiment.tags?.length}
							<div class="flex flex-wrap gap-2">
								{#each data.experiment.tags ?? [] as tag}
									<Badge variant="secondary">{tag}</Badge>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-muted-foreground">None.</p>
						{/if}
					</div>
				</div>
			</section>

			<section class="surface-panel">
				<div class="border-b px-5 py-4">
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h2 class="text-lg font-semibold tracking-tight">Logs</h2>
							<p class="mt-1 text-sm text-muted-foreground">Chronological notebook for this experiment.</p>
						</div>
						{@render AddLogDialog('default', '')}
					</div>
				</div>
				<div class="space-y-5 p-5">
					{#if data.logs.length}
						<div class="divide-y">
							{#each data.logs as log}
								<article class="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[150px_minmax(0,1fr)]">
									<div class="space-y-2">
										<Badge class={logTypeBadgeClass(log.log_type)}>{log.log_type}</Badge>
										<p class="text-sm text-muted-foreground">{formatDisplayDate(log.log_date)}</p>
									</div>
									<div class="min-w-0">
										<div class="mb-2 flex flex-wrap items-start justify-between gap-3">
											<p class="whitespace-pre-wrap text-sm leading-6">{log.note}</p>
											<div class="flex gap-2">
												<Dialog.Root>
													<Dialog.Trigger>
														{#snippet child({ props })}
															<Button variant="outline" size="sm" {...props}>
																<PencilIcon class="size-4" />
																Edit
															</Button>
														{/snippet}
													</Dialog.Trigger>
													<Dialog.Content class="sm:max-w-2xl">
														<Dialog.Header>
															<Dialog.Title>Edit log</Dialog.Title>
															<Dialog.Description>
																Update the note, metric snapshot, date, or source for this log.
															</Dialog.Description>
														</Dialog.Header>
														<form method="POST" action="?/updateLog" class="space-y-4">
															<input type="hidden" name="log_id" value={log.id} />
															<div class="grid gap-4 md:grid-cols-2">
																<label class="field">
																	<span>Type</span>
																	<SelectField name="log_type" value={log.log_type} options={data.logTypes} />
																</label>
																<label class="field">
																	<span>Date</span>
																	<DatePickerField name="log_date" value={toDateInput(log.log_date)} placeholder="Pick log date" />
																</label>
																<label class="field md:col-span-2">
																	<span>Note</span>
																	<Textarea name="note" rows={5} required value={log.note} />
																</label>
																<label class="field">
																	<span>Metric snapshot</span>
																	<Textarea name="metric_snapshot" rows={4} value={metricSnapshotText(log.metric_snapshot)} />
																</label>
																<label class="field">
																	<span>Source URL</span>
																	<Input name="source_url" value={log.source_url ?? ''} placeholder="https://..." />
																</label>
															</div>
															<Dialog.Footer class="gap-2">
																<Dialog.Close>
																	{#snippet child({ props })}
																		<Button variant="outline" {...props}>Cancel</Button>
																	{/snippet}
																</Dialog.Close>
																<Button type="submit">Save log</Button>
															</Dialog.Footer>
														</form>
													</Dialog.Content>
												</Dialog.Root>

												<AlertDialog.Root>
													<AlertDialog.Trigger>
														{#snippet child({ props })}
															<Button variant="outline" size="sm" {...props}>
																<Trash2Icon class="size-4" />
																Delete
															</Button>
														{/snippet}
													</AlertDialog.Trigger>
													<AlertDialog.Content>
														<AlertDialog.Header>
															<AlertDialog.Title>Delete log?</AlertDialog.Title>
															<AlertDialog.Description>
																This removes the log from this experiment. The experiment itself will stay intact.
															</AlertDialog.Description>
														</AlertDialog.Header>
														<form method="POST" action="?/deleteLog">
															<input type="hidden" name="log_id" value={log.id} />
															<AlertDialog.Footer class="mt-4 gap-2">
																<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
																<AlertDialog.Action variant="destructive" type="submit">
																	<Trash2Icon class="size-4" />
																	Delete log
																</AlertDialog.Action>
															</AlertDialog.Footer>
														</form>
													</AlertDialog.Content>
												</AlertDialog.Root>
											</div>
										</div>
										{#if log.metric_snapshot && Object.keys(log.metric_snapshot).length}
											<div class="mt-3 grid gap-2 sm:grid-cols-2">
												{#each Object.entries(log.metric_snapshot) as [key, value]}
													<div class="rounded-lg bg-muted px-3 py-2 text-sm">
														<span class="text-muted-foreground">{key}:</span> {value}
													</div>
												{/each}
											</div>
										{/if}
										{#if log.source_url}
											<a class="mt-3 block break-all text-sm text-primary hover:underline" href={log.source_url} target="_blank" rel="noreferrer">{log.source_url}</a>
										{/if}
									</div>
								</article>
							{/each}
						</div>
					{:else}
						<div class="grid min-h-40 place-items-center rounded-xl border border-dashed bg-muted/25 p-6 text-center">
							<div>
								<BookOpenIcon class="mx-auto mb-3 size-6 text-muted-foreground" />
								<p class="font-medium">No logs yet</p>
								<p class="mt-1 text-sm text-muted-foreground">Add the first implementation note or observation.</p>
							</div>
						</div>
					{/if}
				</div>
			</section>
		</div>

		<aside class="space-y-4 xl:sticky xl:top-4 xl:self-start">
			<Card.Root>
				<Card.Header>
					<Card.Title>Review</Card.Title>
					<Card.Description>Close the loop with a clear decision.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-5 text-sm">
					<section class="space-y-2">
						<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lifecycle</p>
						<div class="flex flex-wrap gap-2">
							{#each ACTIVE_STATUSES as status}
								<form method="POST" action="?/status">
									<input type="hidden" name="status" value={status} />
									<Button
										variant={data.experiment.status === status ? 'default' : 'outline'}
										class={data.experiment.status === status ? statusBadgeClass(status) : ''}
										size="sm"
										type="submit"
									>
										{status}
									</Button>
								</form>
							{/each}
						</div>
					</section>

					<section class="space-y-3 border-t pt-4">
						{@render Row('Primary metric', data.experiment.primary_metric)}
						{@render Row('Confidence', data.experiment.confidence || 'Not set')}
						{@render Row('Start', formatDisplayDate(data.experiment.start_date) || 'Not set')}
						{@render Row('End', formatDisplayDate(data.experiment.end_date) || 'Not set')}
					</section>

					<section class="space-y-2 border-t pt-4">
						<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Review timing</p>
						<form method="POST" action="?/reviewDate" class="space-y-2">
							<label class="field">
								<span>Review date</span>
								<DatePickerField name="expected_review_date" value={toDateInput(data.experiment.expected_review_date)} placeholder="Pick review date" />
							</label>
							<Button type="submit" size="sm" variant="outline" class="w-full">Update review date</Button>
						</form>
					</section>

					<section class="space-y-2 border-t pt-4">
						<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Decision</p>
						<p class="text-sm text-muted-foreground">
							Use the review flow when you are ready to record the outcome, confidence, learning, and next action.
						</p>
						<Dialog.Root>
							<Dialog.Trigger>
								{#snippet child({ props })}
									<Button class="h-10 w-full" {...props}>
										Review experiment
									</Button>
								{/snippet}
							</Dialog.Trigger>
							<Dialog.Content class="sm:max-w-2xl">
								<Dialog.Header>
									<Dialog.Title>Review experiment</Dialog.Title>
									<Dialog.Description>
										Record the outcome, confidence, and learning before closing this experiment.
									</Dialog.Description>
								</Dialog.Header>
								<form method="POST" action="?/review" class="space-y-4">
									<div class="grid gap-4 md:grid-cols-2">
										<div class="field">
											<span>Outcome</span>
											<SelectField
												name="status"
												value={isReviewStatus(data.experiment.status) ? data.experiment.status : 'Won'}
												options={[...REVIEW_STATUSES]}
											/>
										</div>
										<div class="field">
											<span>Confidence</span>
											<SelectField
												name="confidence"
												value={data.experiment.confidence ?? 'not-set'}
												options={[{ value: 'not-set', label: 'Not set', submitValue: '' }, ...CONFIDENCE_LEVELS]}
											/>
										</div>
										<div class="field md:col-span-2">
											<span>Result summary</span>
											<Textarea
												name="result_summary"
												rows={4}
												required
												value={data.experiment.result_summary ?? ''}
												placeholder="What happened against the primary metric?"
											/>
										</div>
										<div class="field md:col-span-2">
											<span>Learnings</span>
											<Textarea
												name="learnings"
												rows={4}
												value={data.experiment.learnings ?? ''}
												placeholder="What should future SEO work take from this?"
											/>
										</div>
										<div class="field md:col-span-2">
											<span>Next action</span>
											<Textarea
												name="next_action"
												rows={3}
												value={data.experiment.next_action ?? ''}
												placeholder="Roll out, revert, retest, expand, or monitor longer."
											/>
										</div>
									</div>
									<Dialog.Footer class="gap-2">
										<Dialog.Close>
											{#snippet child({ props })}
												<Button variant="outline" {...props}>Cancel</Button>
											{/snippet}
										</Dialog.Close>
										<Button type="submit">Save review</Button>
									</Dialog.Footer>
								</form>
							</Dialog.Content>
						</Dialog.Root>
					</section>
				</Card.Content>
			</Card.Root>
		</aside>
	</div>
</section>

{#snippet Info(title: string, text?: string)}
	<div>
		<p class="mb-1 text-sm font-medium">{title}</p>
		<p class="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{text || 'Not recorded yet.'}</p>
	</div>
{/snippet}

{#snippet AddLogDialog(variant: 'default' | 'outline', className: string)}
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button {variant} class={className} {...props}>
					<PlusIcon class="size-4" />
					Add log
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-2xl">
			<Dialog.Header>
				<Dialog.Title>Add log</Dialog.Title>
				<Dialog.Description>Record an implementation note, observation, metric update, or decision.</Dialog.Description>
			</Dialog.Header>
			<form method="POST" action="?/addLog" class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2">
					<label class="field">
						<span>Type</span>
						<SelectField name="log_type" value={data.logTypes[0]} options={data.logTypes} />
					</label>
					<label class="field">
						<span>Date</span>
						<DatePickerField name="log_date" value={todayInput()} placeholder="Pick log date" />
					</label>
					<label class="field md:col-span-2">
						<span>Note</span>
						<Textarea name="note" rows={4} placeholder="What changed? What did you observe?" required />
					</label>
					<label class="field">
						<span>Metric snapshot</span>
						<Textarea name="metric_snapshot" rows={3} placeholder="Clicks: 120&#10;CTR: 4.8%" />
					</label>
					<label class="field">
						<span>Source URL</span>
						<Input name="source_url" placeholder="https://..." />
					</label>
				</div>
				<Dialog.Footer class="gap-2">
					<Dialog.Close>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Cancel</Button>
						{/snippet}
					</Dialog.Close>
					<Button type="submit">Save log</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/snippet}

{#snippet Row(label: string, value: string)}
	<div class="flex justify-between gap-3">
		<span class="text-muted-foreground">{label}</span>
		<span class="text-right font-medium">{value}</span>
	</div>
{/snippet}

{#snippet Urls(title: string, urls?: string[])}
	<div>
		<p class="mb-2 text-sm font-medium">{title}</p>
		{#if urls?.length}
			<div class="space-y-2">
				{#each urls as url}
					<a class="block break-all rounded-md bg-muted px-3 py-2 text-sm hover:underline" href={url} target="_blank" rel="noreferrer">{url}</a>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-muted-foreground">None.</p>
		{/if}
	</div>
{/snippet}
