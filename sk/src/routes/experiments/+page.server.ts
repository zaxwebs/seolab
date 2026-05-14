import { error } from '@sveltejs/kit';
import { EXPERIMENT_STATUSES, EXPERIMENT_TYPES, isReadyForReview } from '$lib/seolab.js';
import { listExperiments, listWebsites } from '$lib/server/pocketbase.js';

export async function load({ url }) {
	try {
		const [experiments, websites] = await Promise.all([listExperiments(), listWebsites()]);
		const status = url.searchParams.get('status') ?? 'All';
		const type = url.searchParams.get('type') ?? 'All';
		const website = url.searchParams.get('website') ?? 'All';
		const tag = (url.searchParams.get('tag') ?? '').toLowerCase();
		const q = (url.searchParams.get('q') ?? '').toLowerCase();

		const filteredExperiments = experiments
			.filter((experiment) => status === 'All' || experiment.status === status)
			.filter((experiment) => type === 'All' || experiment.experiment_type === type)
			.filter((experiment) => website === 'All' || experiment.website === website)
			.filter((experiment) => !tag || (experiment.tags ?? []).some((item) => item.toLowerCase().includes(tag)))
			.filter((experiment) => {
				if (!q) return true;
				const websiteName = websites.find((item) => item.id === experiment.website)?.name ?? '';
				return `${experiment.title} ${experiment.hypothesis} ${experiment.primary_metric} ${websiteName}`
					.toLowerCase()
					.includes(q);
			});

		return {
			experiments: filteredExperiments,
			websites,
			statuses: EXPERIMENT_STATUSES,
			types: EXPERIMENT_TYPES,
			status,
			type,
			website,
			tag,
			q,
			readyCount: filteredExperiments.filter(isReadyForReview).length
		};
	} catch {
		error(503, 'PocketBase is not ready for seolab. Start PocketBase and apply migrations.');
	}
}
