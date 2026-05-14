<script lang="ts">
	import Globe2Icon from '@lucide/svelte/icons/globe-2';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { relativeDate } from '$lib/seolab.js';

	let { data } = $props();
</script>

<svelte:head><title>Websites · seolab</title></svelte:head>

<section class="page-wrap">
	<div class="page-header">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Websites</h1>
			<p class="text-sm text-muted-foreground">Properties where SEO experiments are tracked.</p>
		</div>
		<Button href="/websites/new">
			<PlusIcon class="size-4" />
			Add website
		</Button>
	</div>

	<Card.Root>
		<Card.Content class="pt-6">
			{#if data.websites.length}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head>Domain</Table.Head>
							<Table.Head>Experiments</Table.Head>
							<Table.Head>Active</Table.Head>
							<Table.Head>Last activity</Table.Head>
							<Table.Head>Status</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.websites as website}
							{@const stats = data.stats[website.id]}
							<Table.Row>
								<Table.Cell><a class="font-medium hover:underline" href={`/websites/${website.id}`}>{website.name}</a></Table.Cell>
								<Table.Cell>{website.domain}</Table.Cell>
								<Table.Cell>{stats.total}</Table.Cell>
								<Table.Cell>{stats.active}</Table.Cell>
								<Table.Cell>{relativeDate(stats.lastActivity)}</Table.Cell>
								<Table.Cell><Badge variant={website.archived ? 'outline' : 'secondary'}>{website.archived ? 'Archived' : 'Active'}</Badge></Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<div class="grid min-h-56 place-items-center rounded-md border border-dashed p-6 text-center">
					<div>
						<Globe2Icon class="mx-auto mb-3 size-6 text-muted-foreground" />
						<p class="font-medium">No websites yet</p>
						<p class="mt-1 text-sm text-muted-foreground">Add a website to create your first experiment.</p>
						<Button class="mt-4" href="/websites/new">Add website</Button>
					</div>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</section>
