<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import SaveIcon from '@lucide/svelte/icons/save';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let { form } = $props();
</script>

<svelte:head><title>Add website · seolab</title></svelte:head>

<section class="page-wrap max-w-3xl">
	<Button variant="ghost" class="-ml-2" href="/websites">
		<ArrowLeftIcon class="size-4" />
		Websites
	</Button>

	<Card.Root>
		<Card.Header>
			<Card.Title>Add website</Card.Title>
			<Card.Description>Track experiments under a single domain or property.</Card.Description>
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
					<Input name="name" value={form?.name ?? ''} placeholder="Example Blog" required />
				</label>
				<label class="field">
					<span>Domain</span>
					<Input name="domain" value={form?.domain ?? ''} placeholder="example.com" required />
				</label>
				<label class="field">
					<span>Market or country</span>
					<Input name="market" placeholder="US, India, Global" />
				</label>
				<label class="field md:col-span-2">
					<span>Description</span>
					<Textarea name="description" rows={4} />
				</label>
			</Card.Content>
			<Card.Footer class="gap-2">
				<Button type="submit"><SaveIcon class="size-4" /> Save website</Button>
				<Button variant="outline" href="/websites">Cancel</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</section>
