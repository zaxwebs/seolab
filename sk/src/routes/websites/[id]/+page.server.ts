import { error, redirect } from '@sveltejs/kit';
import { EXPERIMENT_STATUSES, EXPERIMENT_TYPES, isActiveStatus, type Website } from '$lib/seolab.js';
import { listExperiments, listLogs, serverPb } from '$lib/server/pocketbase.js';

export async function load({ params, url }) {
	try {
		const pb = serverPb();
		const [website, experiments, logs] = await Promise.all([
			pb.collection<Website>('websites').getOne(params.id),
			listExperiments(),
			listLogs()
		]);
		const status = url.searchParams.get('status') ?? 'All';
		const type = url.searchParams.get('type') ?? 'All';
		const tag = (url.searchParams.get('tag') ?? '').toLowerCase();
		const websiteExperiments = experiments
			.filter((experiment) => experiment.website === params.id)
			.filter((experiment) => status === 'All' || experiment.status === status)
			.filter((experiment) => type === 'All' || experiment.experiment_type === type)
			.filter((experiment) => !tag || (experiment.tags ?? []).some((item) => item.toLowerCase().includes(tag)));

		return {
			website,
			experiments: websiteExperiments,
			logs,
			status,
			type,
			tag,
			statuses: EXPERIMENT_STATUSES,
			types: EXPERIMENT_TYPES,
			activeCount: websiteExperiments.filter((experiment) => isActiveStatus(experiment.status)).length
		};
	} catch {
		error(404, 'Website not found.');
	}
}

export const actions = {
	archive: async ({ params }) => {
		const pb = serverPb();
		const website = await pb.collection<Website>('websites').getOne(params.id);
		await pb.collection('websites').update(params.id, { archived: !website.archived });
	},
	delete: async ({ params }) => {
		await serverPb().collection('websites').delete(params.id);
		redirect(303, '/websites');
	}
};
