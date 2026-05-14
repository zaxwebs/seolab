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
	import SelectField from '$lib/components/SelectField.svelte';
	import { EXPERIMENT_STATUSES, arrayToComma, logTypeBadgeClass, statusBadgeClass, toDateInput, todayInput } from '$lib/seolab.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	let { data } = $props();

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
			<form method="POST" action="?/delete">
				<Button variant="outline" type="submit"><Trash2Icon class="size-4" /> Delete</Button>
			</form>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
		<div class="space-y-4">
			<Card.Root>
				<Card.Header>
					<Card.Title>Logs</Card.Title>
					<Card.Description>Chronological notebook for this experiment.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<form method="POST" action="?/addLog" class="rounded-md border p-4">
						<div class="grid gap-4 md:grid-cols-2">
							<label class="field">
								<span>Type</span>
								<SelectField name="log_type" value={data.logTypes[0]} options={data.logTypes} />
							</label>
							<label class="field">
								<span>Date</span>
								<Input name="log_date" type="date" value={todayInput()} />
							</label>
							<label class="field md:col-span-2">
								<span>Note</span>
								<Textarea name="note" rows={3} placeholder="What changed? What did you observe?" required />
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
						<Button class="mt-4" type="submit"><PlusIcon class="size-4" /> Add log</Button>
					</form>

					{#if data.logs.length}
						{#each data.logs as log}
							<div class="rounded-md border p-4">
								<div class="mb-2 flex flex-wrap items-start justify-between gap-3">
									<div class="flex flex-wrap items-center gap-2">
										<Badge class={logTypeBadgeClass(log.log_type)}>{log.log_type}</Badge>
										<span class="text-sm text-muted-foreground">{toDateInput(log.log_date)}</span>
									</div>
									<div class="flex gap-2">
										<Dialog.Root>
											<Dialog.Trigger>
												{#snippet child({ props })}
													<Button variant="outline" {...props}>
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
															<Input name="log_date" type="date" value={toDateInput(log.log_date)} />
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
													<Button variant="outline" {...props}>
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
								<p class="whitespace-pre-wrap text-sm leading-6">{log.note}</p>
								{#if log.metric_snapshot && Object.keys(log.metric_snapshot).length}
									<div class="mt-3 grid gap-2 sm:grid-cols-2">
										{#each Object.entries(log.metric_snapshot) as [key, value]}
											<div class="rounded-md bg-muted px-3 py-2 text-sm">
												<span class="text-muted-foreground">{key}:</span> {value}
											</div>
										{/each}
									</div>
								{/if}
								{#if log.source_url}
									<a class="mt-3 block text-sm text-primary hover:underline" href={log.source_url} target="_blank" rel="noreferrer">{log.source_url}</a>
								{/if}
							</div>
						{/each}
					{:else}
						<div class="grid min-h-40 place-items-center rounded-md border border-dashed p-6 text-center">
							<div>
								<BookOpenIcon class="mx-auto mb-3 size-6 text-muted-foreground" />
								<p class="font-medium">No logs yet</p>
								<p class="mt-1 text-sm text-muted-foreground">Add the first implementation note or observation.</p>
							</div>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header><Card.Title>Baseline and result</Card.Title></Card.Header>
				<Card.Content class="grid gap-4 md:grid-cols-2">
					{@render Info('Baseline notes', data.experiment.baseline_notes)}
					{@render Info('Implementation notes', data.experiment.implementation_notes)}
					{@render Info('Result summary', data.experiment.result_summary)}
					{@render Info('Learnings', data.experiment.learnings)}
					{@render Info('Next action', data.experiment.next_action)}
				</Card.Content>
			</Card.Root>
		</div>

		<aside class="space-y-4">
			<Card.Root>
				<Card.Header>
					<Card.Title>Review</Card.Title>
					<Card.Description>Close the loop with a clear decision.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-3 text-sm">
					{@render Row('Primary metric', data.experiment.primary_metric)}
					{@render Row('Confidence', data.experiment.confidence || 'Not set')}
					{@render Row('Start', toDateInput(data.experiment.start_date) || 'Not set')}
					<form method="POST" action="?/reviewDate" class="space-y-2 rounded-md border bg-muted/30 p-3">
						<label class="field">
							<span>Review date</span>
							<Input name="expected_review_date" type="date" value={toDateInput(data.experiment.expected_review_date)} />
						</label>
						<Button type="submit" size="sm" variant="outline">Update review date</Button>
					</form>
					{@render Row('End', toDateInput(data.experiment.end_date) || 'Not set')}
				</Card.Content>
				<Card.Footer class="flex-wrap gap-2">
					{#each EXPERIMENT_STATUSES as status}
						<form method="POST" action="?/status">
							<input type="hidden" name="status" value={status} />
							<Button variant={data.experiment.status === status ? 'default' : 'outline'} size="sm" type="submit">{status}</Button>
						</form>
					{/each}
				</Card.Footer>
			</Card.Root>

			<Card.Root>
				<Card.Header><Card.Title>Pages</Card.Title></Card.Header>
				<Card.Content class="space-y-4">
					{@render Urls('Target URLs', data.experiment.target_urls)}
					{@render Urls('Control URLs', data.experiment.control_urls)}
					{@render Info('Secondary metrics', arrayToComma(data.experiment.secondary_metrics))}
					<div class="flex flex-wrap gap-2">
						{#each data.experiment.tags ?? [] as tag}
							<Badge variant="secondary">{tag}</Badge>
						{/each}
					</div>
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
