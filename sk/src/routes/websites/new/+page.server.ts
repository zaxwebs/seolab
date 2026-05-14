import { fail, redirect } from '@sveltejs/kit';
import { serverPb, text } from '$lib/server/pocketbase.js';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = text(form, 'name');
		const domain = text(form, 'domain');

		if (!name || !domain) {
			return fail(400, { message: 'Website name and domain are required.', name, domain });
		}

		const website = await serverPb().collection('websites').create({
			name,
			domain,
			description: text(form, 'description'),
			market: text(form, 'market'),
			archived: false
		});

		redirect(303, `/websites/${website.id}`);
	}
};
