<script>
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
	LogoHref="/"
	pageLinks={[
		{ name: 'Home', href: '/' },
		{ name: 'Chat', href: '/chat' },
		{ name: 'Account', href: '/login' }
	]}
/>
{@render children?.()}
