<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import FlaskConicalIcon from '@lucide/svelte/icons/flask-conical';
	import Globe2Icon from '@lucide/svelte/icons/globe-2';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import { page } from '$app/state';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { children } = $props();

	function navClass(href: string) {
		const path = page.url.pathname;
		const active = href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
		return active ? 'nav-button nav-button-active' : 'nav-button';
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<div class="grid min-h-screen lg:grid-cols-[248px_1fr]">
		<aside class="hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:block">
			<div class="flex h-full flex-col">
				<a class="flex h-16 items-center gap-3 px-5" href="/">
					<div class="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
						<FlaskConicalIcon class="size-4" />
					</div>
					<div>
						<p class="text-sm font-semibold">seolab</p>
						<p class="text-xs text-sidebar-foreground/55">SEO lab notebook</p>
					</div>
				</a>
				<Separator class="bg-sidebar-border" />
				<nav class="space-y-1 p-3">
					<a class={navClass('/')} href="/">
						<LayoutDashboardIcon class="size-4" />
						Dashboard
					</a>
					<a class={navClass('/websites')} href="/websites">
						<Globe2Icon class="size-4" />
						Websites
					</a>
					<a class={navClass('/experiments')} href="/experiments">
						<FlaskConicalIcon class="size-4" />
						Experiments
					</a>
					<a class={navClass('/help')} href="/help">
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
