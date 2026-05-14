import { error, redirect } from '@sveltejs/kit';
import { LOG_TYPES, todayInput, type Experiment, type ExperimentLog, type ExperimentStatus, type Website } from '$lib/seolab.js';
import { metricSnapshot, nullable, serverPb, text } from '$lib/server/pocketbase.js';

export async function load({ params }) {
	try {
		const pb = serverPb();
		const experiment = await pb.collection<Experiment>('experiments').getOne(params.id);
		const [website, allLogs] = await Promise.all([
			pb.collection<Website>('websites').getOne(experiment.website),
			pb.collection<ExperimentLog>('experiment_logs').getFullList()
		]);
		const logs = allLogs
			.filter((log) => log.experiment === experiment.id)
			.sort(
				(a, b) =>
					(a.log_date ?? '').localeCompare(b.log_date ?? '') ||
					(a.created ?? '').localeCompare(b.created ?? '') ||
					a.id.localeCompare(b.id)
			);

		return { experiment, website, logs, logTypes: LOG_TYPES };
	} catch {
		error(404, 'Experiment not found.');
	}
}

export const actions = {
	addLog: async ({ request, params }) => {
		const form = await request.formData();
		await serverPb().collection('experiment_logs').create({
			experiment: params.id,
			log_type: text(form, 'log_type') || 'Observation',
			log_date: text(form, 'log_date') || todayInput(),
			note: text(form, 'note'),
			metric_snapshot: metricSnapshot(text(form, 'metric_snapshot')),
			source_url: nullable(text(form, 'source_url'))
		});
	},
	updateLog: async ({ request, params }) => {
		const form = await request.formData();
		const logId = text(form, 'log_id');
		const pb = serverPb();
		const log = await pb.collection<ExperimentLog>('experiment_logs').getOne(logId);
		if (log.experiment !== params.id) {
			error(403, 'This log does not belong to the current experiment.');
		}

		await pb.collection('experiment_logs').update(logId, {
			log_type: text(form, 'log_type') || 'Observation',
			log_date: text(form, 'log_date') || todayInput(),
			note: text(form, 'note'),
			metric_snapshot: metricSnapshot(text(form, 'metric_snapshot')),
			source_url: nullable(text(form, 'source_url'))
		});
	},
	deleteLog: async ({ request, params }) => {
		const form = await request.formData();
		const logId = text(form, 'log_id');
		const pb = serverPb();
		const log = await pb.collection<ExperimentLog>('experiment_logs').getOne(logId);
		if (log.experiment !== params.id) {
			error(403, 'This log does not belong to the current experiment.');
		}

		await pb.collection('experiment_logs').delete(logId);
	},
	status: async ({ request, params }) => {
		const form = await request.formData();
		const status = text(form, 'status') as ExperimentStatus;
		const active = ['Planned', 'Running', 'Monitoring'].includes(status);
		await serverPb().collection('experiments').update(params.id, {
			status,
			end_date: active ? null : todayInput()
		});
	},
	review: async ({ request, params }) => {
		const form = await request.formData();
		const status = text(form, 'status') as ExperimentStatus;
		const resultSummary = text(form, 'result_summary');
		if (!['Won', 'Lost', 'Inconclusive', 'Abandoned'].includes(status)) {
			error(400, 'Choose a valid review outcome.');
		}
		if (!resultSummary) {
			error(400, 'Add a result summary before saving the review.');
		}

		await serverPb().collection('experiments').update(params.id, {
			status,
			confidence: nullable(text(form, 'confidence')),
			result_summary: resultSummary,
			learnings: text(form, 'learnings'),
			next_action: text(form, 'next_action'),
			end_date: todayInput()
		});
	},
	reviewDate: async ({ request, params }) => {
		const form = await request.formData();
		await serverPb().collection('experiments').update(params.id, {
			expected_review_date: nullable(text(form, 'expected_review_date'))
		});
	},
	delete: async ({ params }) => {
		const pb = serverPb();
		const experiment = await pb.collection<Experiment>('experiments').getOne(params.id);
		await pb.collection('experiments').delete(params.id);
		redirect(303, `/websites/${experiment.website}`);
	}
};
