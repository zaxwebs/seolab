<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import SaveIcon from '@lucide/svelte/icons/save';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let { data, form } = $props();
</script>

<svelte:head><title>Edit {data.website.name} · seolab</title></svelte:head>

<section class="page-wrap max-w-3xl">
	<Button variant="ghost" class="-ml-2" href={`/websites/${data.website.id}`}>
		<ArrowLeftIcon class="size-4" />
		{data.website.name}
	</Button>

	<Card.Root>
		<Card.Header>
			<Card.Title>Edit website</Card.Title>
		</Card.Header>
		<form method="POST">
			<Card.Content class="grid gap-4 md:grid-cols-2">
				{#if form?.message}
					<Alert.Root variant="destructive" class="md:col-span-2">
						<Alert.Description>{form.message}</Alert.Description>
					</Alert.Root>
				{/if}
				<label class="field">
					<span>Name</span>
					<Input name="name" value={data.website.name} required />
				</label>
				<label class="field">
					<span>Domain</span>
					<Input name="domain" value={data.website.domain} required />
				</label>
				<label class="field">
					<span>Market or country</span>
					<Input name="market" value={data.website.market ?? ''} />
				</label>
				<label class="field md:col-span-2">
					<span>Description</span>
					<Textarea name="description" rows={4} value={data.website.description ?? ''} />
				</label>
			</Card.Content>
			<Card.Footer class="gap-2">
				<Button type="submit"><SaveIcon class="size-4" /> Save website</Button>
				<Button variant="outline" href={`/websites/${data.website.id}`}>Cancel</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</section>
