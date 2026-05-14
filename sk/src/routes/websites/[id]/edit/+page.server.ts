import { fail, redirect, error } from '@sveltejs/kit';
import type { Website } from '$lib/seolab.js';
import { serverPb, text } from '$lib/server/pocketbase.js';

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
		const name = text(form, 'name');
		const domain = text(form, 'domain');
		if (!name || !domain) return fail(400, { message: 'Website name and domain are required.' });

		await serverPb().collection('websites').update(params.id, {
			name,
			domain,
			description: text(form, 'description'),
			market: text(form, 'market')
		});
		redirect(303, `/websites/${params.id}`);
	}
};
