<script lang="ts">
	import SaveIcon from '@lucide/svelte/icons/save';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
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

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>
			Use the lab hypothesis structure so the review has context later.
		</Card.Description>
	</Card.Header>
	<form method="POST">
		<Card.Content class="space-y-6">
			<div class="grid gap-4 md:grid-cols-2">
				<label class="field md:col-span-2">
					<span>Title</span>
					<Input name="title" value={experiment?.title ?? ''} placeholder="Rewrite title tags for pricing pages" required />
				</label>
				<label class="field">
					<span>Type</span>
					<SelectField name="experiment_type" value={experiment?.experiment_type ?? 'Title tag change'} options={[...EXPERIMENT_TYPES]} />
				</label>
				<label class="field">
					<span>Status</span>
					<SelectField name="status" value={experiment?.status ?? 'Planned'} options={[...EXPERIMENT_STATUSES]} />
				</label>
			</div>

			<label class="field">
				<span>Hypothesis</span>
				<Textarea
					name="hypothesis"
					rows={4}
					required
					placeholder="If I [make this change] to [these pages], then [this metric] should [increase/decrease] within [timeframe], because [reason]."
					value={experiment?.hypothesis ?? ''}
				/>
			</label>

			<div class="grid gap-4 md:grid-cols-2">
				<label class="field">
					<span>Target URLs</span>
					<Textarea name="target_urls" rows={4} placeholder="One URL per line" value={arrayToLines(experiment?.target_urls)} />
				</label>
				<label class="field">
					<span>Control URLs</span>
					<Textarea name="control_urls" rows={4} placeholder="Optional, one URL per line" value={arrayToLines(experiment?.control_urls)} />
				</label>
			</div>

			<div class="grid gap-4 md:grid-cols-3">
				<label class="field">
					<span>Primary metric</span>
					<Input name="primary_metric" value={experiment?.primary_metric ?? 'Organic clicks'} required />
				</label>
				<label class="field md:col-span-2">
					<span>Secondary metrics</span>
					<Input name="secondary_metrics" value={arrayToComma(experiment?.secondary_metrics)} placeholder="CTR, impressions, conversions" />
				</label>
			</div>

			<div class="grid gap-4 md:grid-cols-4">
				<label class="field">
					<span>Start date</span>
					<Input name="start_date" value={toDateInput(experiment?.start_date) || todayInput()} type="date" />
				</label>
				<label class="field">
					<span>Review date</span>
					<Input name="expected_review_date" value={toDateInput(experiment?.expected_review_date)} type="date" />
				</label>
				<label class="field">
					<span>End date</span>
					<Input name="end_date" value={toDateInput(experiment?.end_date)} type="date" />
				</label>
				<label class="field">
					<span>Confidence</span>
					<SelectField
						name="confidence"
						value={experiment?.confidence ?? 'not-set'}
						options={[{ value: 'not-set', label: 'Not set', submitValue: '' }, ...CONFIDENCE_LEVELS]}
					/>
				</label>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<label class="field">
					<span>Baseline notes</span>
					<Textarea name="baseline_notes" rows={4} value={experiment?.baseline_notes ?? ''} />
				</label>
				<label class="field">
					<span>Implementation notes</span>
					<Textarea name="implementation_notes" rows={4} value={experiment?.implementation_notes ?? ''} />
				</label>
				<label class="field">
					<span>Result summary</span>
					<Textarea name="result_summary" rows={4} value={experiment?.result_summary ?? ''} />
				</label>
				<label class="field">
					<span>Learnings</span>
					<Textarea name="learnings" rows={4} value={experiment?.learnings ?? ''} />
				</label>
				<label class="field">
					<span>Next action</span>
					<Textarea name="next_action" rows={3} value={experiment?.next_action ?? ''} />
				</label>
				<label class="field">
					<span>Tags</span>
					<Input name="tags" value={arrayToComma(experiment?.tags)} placeholder="pricing, template, internal-linking" />
				</label>
			</div>
		</Card.Content>
		<Card.Footer class="gap-2">
			<Button type="submit"><SaveIcon class="size-4" /> Save experiment</Button>
			<Button variant="outline" href={cancelHref}>Cancel</Button>
		</Card.Footer>
	</form>
</Card.Root>
