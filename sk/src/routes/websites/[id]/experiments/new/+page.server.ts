import { fail, redirect, error } from '@sveltejs/kit';
import type { Experiment, Website } from '$lib/seolab.js';
import { experimentPayload, serverPb, text } from '$lib/server/pocketbase.js';

export async function load({ params }) {
	try {
		return { website: await serverPb().collection<Website>('websites').getOne(params.id) };
	} catch {
		error(404, 'Website not found.');
	}
}

export const actions = {
	default: async ({ request, params }) => {
		const form = await request.formData();
		if (!text(form, 'title') || !text(form, 'hypothesis') || !text(form, 'primary_metric')) {
			return fail(400, { message: 'Title, hypothesis, and primary metric are required.' });
		}
		const created = await serverPb()
			.collection<Experiment>('experiments')
			.create(experimentPayload(form, params.id));
		redirect(303, `/experiments/${created.id}`);
	}
};
