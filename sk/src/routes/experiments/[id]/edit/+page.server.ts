import { fail, redirect, error } from '@sveltejs/kit';
import type { Experiment, Website } from '$lib/seolab.js';
import { experimentPayload, serverPb, text } from '$lib/server/pocketbase.js';

export async function load({ params }) {
	try {
		const pb = serverPb();
		const experiment = await pb.collection<Experiment>('experiments').getOne(params.id);
		const website = await pb.collection<Website>('websites').getOne(experiment.website);
		return { experiment, website };
	} catch {
		error(404, 'Experiment not found.');
	}
}

export const actions = {
	default: async ({ request, params }) => {
		const form = await request.formData();
		const pb = serverPb();
		const experiment = await pb.collection<Experiment>('experiments').getOne(params.id);
		if (!text(form, 'title') || !text(form, 'hypothesis') || !text(form, 'primary_metric')) {
			return fail(400, { message: 'Title, hypothesis, and primary metric are required.' });
		}
		await pb.collection('experiments').update(params.id, experimentPayload(form, experiment.website));
		redirect(303, `/experiments/${params.id}`);
	}
};
