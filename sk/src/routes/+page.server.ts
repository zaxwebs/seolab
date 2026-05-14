import { error } from '@sveltejs/kit';
import { daysUntil, isActiveStatus, isInReviewQueue, isReadyForReview } from '$lib/seolab.js';
import { listExperiments, listLogs, listWebsites } from '$lib/server/pocketbase.js';

export async function load() {
	try {
		const [websites, experiments, logs] = await Promise.all([listWebsites(), listExperiments(), listLogs()]);
		return {
			websites,
			experiments,
			logs,
			activeExperiments: experiments.filter((experiment) => isActiveStatus(experiment.status)),
			readyForReview: experiments.filter(isReadyForReview),
			reviewQueue: experiments
				.filter((experiment) => isInReviewQueue(experiment))
				.sort((a, b) => (daysUntil(a.expected_review_date) ?? 9999) - (daysUntil(b.expected_review_date) ?? 9999))
				.slice(0, 6),
			recentLogs: logs.slice(0, 6),
			completedExperiments: experiments.filter((experiment) => !isActiveStatus(experiment.status)).slice(0, 6)
		};
	} catch {
		error(503, 'PocketBase is not ready for seolab. Start PocketBase and apply migrations.');
	}
}
