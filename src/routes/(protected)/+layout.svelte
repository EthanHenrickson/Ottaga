<script lang="ts">
	let { children } = $props();

	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { dev } from '$app/environment';
	import posthog from 'posthog-js';
	import Nav from '$lib/client/components/general/Nav.svelte';

	if (browser && !dev) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<Nav
	LogoHref="/dashboard"
	pageLinks={[
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Chat', href: '/dashboard/chat' },
		{ name: 'Profile', href: '/dashboard/profile' }
	]}
/>
<main>
	{@render children?.()}
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
		background-color: var(--bg-primary);
	}
</style>
