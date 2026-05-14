import { env } from '$env/dynamic/private';
import { createPocketBase, pbUrls, type Experiment, type ExperimentLog, type Website } from '$lib/seolab.js';

export function serverPb() {
	return createPocketBase(env.POCKETBASE_URL || pbUrls[0]);
}

export async function listWebsites() {
	const websites = await serverPb().collection<Website>('websites').getFullList();
	return websites.sort((a, b) => newestFirst(a.updated, b.updated) || a.name.localeCompare(b.name));
}

export async function listExperiments() {
	const experiments = await serverPb().collection<Experiment>('experiments').getFullList();
	return experiments.sort((a, b) => newestFirst(a.updated, b.updated) || a.title.localeCompare(b.title));
}

export async function listLogs() {
	const logs = await serverPb().collection<ExperimentLog>('experiment_logs').getFullList();
	return logs.sort(
		(a, b) => newestFirst(a.log_date, b.log_date) || newestFirst(a.created, b.created) || a.id.localeCompare(b.id)
	);
}

function newestFirst(a?: string, b?: string) {
	return (b ?? '').localeCompare(a ?? '');
}

export function text(form: FormData, key: string) {
	return String(form.get(key) ?? '').trim();
}

export function lines(value: string) {
	return value
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean);
}

export function csv(value: string) {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

export function nullable(value: string) {
	return value || null;
}

export function metricSnapshot(value: string) {
	return Object.fromEntries(
		value
			.split(/\r?\n/)
			.map((line) => line.split(':').map((part) => part.trim()))
			.filter(([key, val]) => key && val)
			.map(([key, ...rest]) => [key, rest.join(': ')])
	);
}

export function experimentPayload(form: FormData, website: string) {
	return {
		website,
		title: text(form, 'title'),
		hypothesis: text(form, 'hypothesis'),
		experiment_type: text(form, 'experiment_type'),
		status: text(form, 'status') || 'Planned',
		target_urls: lines(text(form, 'target_urls')),
		control_urls: lines(text(form, 'control_urls')),
		primary_metric: text(form, 'primary_metric'),
		secondary_metrics: csv(text(form, 'secondary_metrics')),
		start_date: nullable(text(form, 'start_date')),
		expected_review_date: nullable(text(form, 'expected_review_date')),
		end_date: nullable(text(form, 'end_date')),
		baseline_notes: text(form, 'baseline_notes'),
		implementation_notes: text(form, 'implementation_notes'),
		result_summary: text(form, 'result_summary'),
		confidence: nullable(text(form, 'confidence')),
		learnings: text(form, 'learnings'),
		next_action: text(form, 'next_action'),
		tags: csv(text(form, 'tags'))
	};
}
