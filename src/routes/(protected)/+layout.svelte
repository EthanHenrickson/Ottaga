<script lang="ts">
	let { children } = $props();

	import { browser } from "$app/environment";
	import { beforeNavigate, afterNavigate } from "$app/navigation";
	import { dev } from "$app/environment";
	import posthog from "posthog-js";
	import DashboardNav from "$lib/components/DashboardNav.svelte";

	if (browser && !dev) {
		beforeNavigate(() => posthog.capture("$pageleave"));
		afterNavigate(() => posthog.capture("$pageview"));
	}
</script>

<DashboardNav />
<main>
	{@render children?.()}
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
	}
</style>
