import { error } from '@sveltejs/kit';
import { isActiveStatus, type WebsiteStats } from '$lib/seolab.js';
import { listExperiments, listLogs, listWebsites } from '$lib/server/pocketbase.js';

export async function load() {
	try {
		const [websites, experiments, logs] = await Promise.all([listWebsites(), listExperiments(), listLogs()]);
		const stats = Object.fromEntries(
			websites.map((website) => {
				const ownedExperiments = experiments.filter((experiment) => experiment.website === website.id);
				const ownedLogs = logs.filter((log) => ownedExperiments.some((experiment) => experiment.id === log.experiment));
				const lastActivity = [...ownedExperiments.map((item) => item.updated), ...ownedLogs.map((item) => item.updated)]
					.filter(Boolean)
					.sort()
					.at(-1);
				return [
					website.id,
					{
						total: ownedExperiments.length,
						active: ownedExperiments.filter((experiment) => isActiveStatus(experiment.status)).length,
						lastActivity
					} satisfies WebsiteStats
				];
			})
		);

		return { websites, stats };
	} catch {
		error(503, 'PocketBase is not ready for seolab. Start PocketBase and apply migrations.');
	}
}
