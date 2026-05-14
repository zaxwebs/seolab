<script lang="ts">
	import CircleHelpIcon from '@lucide/svelte/icons/circle-help';
	import SaveIcon from '@lucide/svelte/icons/save';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import DatePickerField from '$lib/components/DatePickerField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import {
		CONFIDENCE_LEVELS,
		EXPERIMENT_STATUSES,
		EXPERIMENT_TYPES,
		arrayToComma,
		arrayToLines,
		todayInput,
		toDateInput,
		type Experiment
	} from '$lib/seolab.js';

	let {
		experiment = undefined,
		cancelHref,
		title = 'Create experiment'
	}: {
		experiment?: Experiment;
		cancelHref: string;
		title?: string;
	} = $props();
</script>

{#snippet FieldLabel(label: string, tooltip?: string)}
	<span class="inline-flex items-center gap-1.5">
		<span>{label}</span>
		{#if tooltip}
			<Tooltip.Root>
				<Tooltip.Trigger
					type="button"
					class="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
					aria-label={`${label} help`}
				>
					<CircleHelpIcon class="size-3.5" />
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={6} class="max-w-64 leading-snug">
					{tooltip}
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	</span>
{/snippet}

<Tooltip.Provider delayDuration={150}>
	<div class="surface-panel">
		<div class="border-b px-5 py-4">
			<h2 class="text-lg font-semibold tracking-tight">{title}</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Use the lab hypothesis structure so the review has context later.
			</p>
		</div>
		<form method="POST">
			<div class="p-5">
				<section class="section-block">
					<h3 class="section-title">Setup</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="field md:col-span-2">
							{@render FieldLabel('Title', 'A short name for the test. Use the page group and change, not the final result.')}
							<Input name="title" value={experiment?.title ?? ''} placeholder="Rewrite title tags for pricing pages" required />
						</div>
						<div class="field">
							{@render FieldLabel('Type', 'The main kind of SEO change being tested. This is for filtering and comparison later.')}
							<SelectField name="experiment_type" value={experiment?.experiment_type ?? 'Title tag change'} options={[...EXPERIMENT_TYPES]} />
						</div>
						<div class="field">
							{@render FieldLabel('Status', 'Where the experiment is in its lifecycle. New tests usually start as Planned, then move to Running after implementation.')}
							<SelectField name="status" value={experiment?.status ?? 'Planned'} options={[...EXPERIMENT_STATUSES]} />
						</div>
						<div class="field md:col-span-2">
							{@render FieldLabel('Hypothesis', 'Write the expected cause and effect before launching, so the review is not just a retrospective guess.')}
							<Textarea
								name="hypothesis"
								rows={4}
								required
								placeholder="If I [make this change] to [these pages], then [this metric] should [increase/decrease] within [timeframe], because [reason]."
								value={experiment?.hypothesis ?? ''}
							/>
						</div>
					</div>
				</section>

				<section class="section-block">
					<h3 class="section-title">Pages</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="field">
							{@render FieldLabel('Target URLs', 'Pages that will receive the change. Add one URL per line so they can be reviewed as a group.')}
							<Textarea name="target_urls" rows={4} placeholder="One URL per line" value={arrayToLines(experiment?.target_urls)} />
						</div>
						<div class="field">
							{@render FieldLabel('Control URLs', 'Similar pages that will not receive the change. Optional, but helpful for separating test impact from site-wide movement.')}
							<Textarea name="control_urls" rows={4} placeholder="Optional, one URL per line" value={arrayToLines(experiment?.control_urls)} />
						</div>
					</div>
				</section>

				<section class="section-block">
					<h3 class="section-title">Measurement</h3>
					<div class="grid gap-4 md:grid-cols-3">
						<div class="field">
							{@render FieldLabel('Primary metric', 'The one metric used to decide the outcome. Pick the clearest success signal before launch.')}
							<Input name="primary_metric" value={experiment?.primary_metric ?? 'Organic clicks'} required />
						</div>
						<div class="field md:col-span-2">
							{@render FieldLabel('Secondary metrics', 'Supporting metrics to inspect during review. They add context, but should not replace the primary metric.')}
							<Input name="secondary_metrics" value={arrayToComma(experiment?.secondary_metrics)} placeholder="CTR, impressions, conversions" />
						</div>
					</div>
					<div class="mt-4 grid gap-4 md:grid-cols-4">
						<div class="field">
							{@render FieldLabel('Start date', 'When the change goes live or measurement begins.')}
							<DatePickerField name="start_date" value={toDateInput(experiment?.start_date) || todayInput()} placeholder="Pick start date" />
						</div>
						<div class="field">
							{@render FieldLabel('Review date', 'The date to judge the experiment. Choose a point far enough out for search data to settle.')}
							<DatePickerField name="expected_review_date" value={toDateInput(experiment?.expected_review_date)} placeholder="Pick review date" />
						</div>
						<div class="field">
							{@render FieldLabel('End date', 'When the experiment is stopped or closed. Leave blank while it is still active.')}
							<DatePickerField name="end_date" value={toDateInput(experiment?.end_date)} placeholder="Pick end date" />
						</div>
						<div class="field">
							{@render FieldLabel('Confidence', 'How strongly you trust the result after review, based on signal quality and possible outside factors.')}
							<SelectField
								name="confidence"
								value={experiment?.confidence ?? 'not-set'}
								options={[{ value: 'not-set', label: 'Not set', submitValue: '' }, ...CONFIDENCE_LEVELS]}
							/>
						</div>
					</div>
				</section>

				<section class="section-block">
					<h3 class="section-title">Notes and learning</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="field">
							{@render FieldLabel('Baseline notes', 'Snapshot the before state: rankings, traffic, CTR, page content, dates, and known caveats.')}
							<Textarea name="baseline_notes" rows={4} value={experiment?.baseline_notes ?? ''} />
						</div>
						<div class="field">
							{@render FieldLabel('Implementation notes', 'Record exactly what changed and when. This keeps the review tied to the real implementation.')}
							<Textarea name="implementation_notes" rows={4} value={experiment?.implementation_notes ?? ''} />
						</div>
						<div class="field">
							{@render FieldLabel('Result summary', 'Use this after review to summarize what happened against the primary metric.')}
							<Textarea name="result_summary" rows={4} value={experiment?.result_summary ?? ''} />
						</div>
						<div class="field">
							{@render FieldLabel('Learnings', 'The reusable takeaway for future SEO work, even if the experiment was lost or inconclusive.')}
							<Textarea name="learnings" rows={4} value={experiment?.learnings ?? ''} />
						</div>
						<div class="field">
							{@render FieldLabel('Next action', 'The follow-up decision: roll out, revert, retest, expand, or watch longer.')}
							<Textarea name="next_action" rows={3} value={experiment?.next_action ?? ''} />
						</div>
						<div class="field">
							{@render FieldLabel('Tags', 'Comma-separated labels for filtering experiments by theme, template, funnel stage, or page type.')}
							<Input name="tags" value={arrayToComma(experiment?.tags)} placeholder="pricing, template, internal-linking" />
						</div>
					</div>
				</section>
			</div>
			<div class="flex flex-wrap gap-2 border-t bg-muted/35 px-5 py-4">
				<Button type="submit"><SaveIcon class="size-4" /> Save experiment</Button>
				<Button variant="outline" href={cancelHref}>Cancel</Button>
			</div>
		</form>
	</div>
</Tooltip.Provider>

