<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import Globe2Icon from '@lucide/svelte/icons/globe-2';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<div class="grid min-h-screen lg:grid-cols-[248px_1fr]">
		<aside class="hidden border-r bg-muted/30 lg:block">
			<div class="flex h-full flex-col">
				<a class="flex h-16 items-center gap-3 px-5" href="/">
					<div class="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<FlaskConicalIcon class="size-4" />
					</div>
					<div>
						<p class="text-sm font-semibold">seolab</p>
						<p class="text-xs text-muted-foreground">SEO lab notebook</p>
					</div>
				</a>
				<Separator />
				<nav class="space-y-1 p-3">
					<a class="nav-button" href="/">
						<LayoutDashboardIcon class="size-4" />
						Dashboard
					</a>
					<a class="nav-button" href="/websites">
						<Globe2Icon class="size-4" />
						Websites
					</a>
					<a class="nav-button" href="/experiments">
						<FlaskConicalIcon class="size-4" />
						Experiments
					</a>
					<a class="nav-button" href="/help">
						<BookOpenIcon class="size-4" />
						Help
					</a>
				</nav>
			</div>
		</aside>

		<main class="min-w-0">
			{@render children()}
		</main>
	</div>
</div>
