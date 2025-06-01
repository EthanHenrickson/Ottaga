<script>
	let { children } = $props();

	import Nav from "$lib/components/marketing/mainPage/Nav.svelte";
	import { browser } from "$app/environment";
	import { beforeNavigate, afterNavigate } from "$app/navigation";
	import { dev } from "$app/environment";
	import posthog from "posthog-js";

	if (browser && !dev) {
		beforeNavigate(() => posthog.capture("$pageleave"));
		afterNavigate(() => posthog.capture("$pageview"));
	}
</script>

<div class="website">
	<Nav />
	<main>
		{@render children?.()}
	</main>
</div>

<style>
	:global(:root) {
		--MessageBackground-Assistant: #f5f5f5;
		--MessageBackground-User: #e3f2fd;

		--AccentColorPrimary: #2485c1;
		--AccentColorSecondary: #e6f6fe;

		--Orange400: rgb(255, 175, 65);

		--text-color: black;
	}

	:global(body) {
		margin: 0;
		font-family: "Open Sans", serif;
	}

	:global(h1) {
        font-size: 2rem;
        margin-bottom: 1.5rem;
    }

    :global(h2) {
        font-size: 1.5rem;
        margin: 2rem 0 1rem;
    }

    :global(ul) {
        margin: 1rem 0;
        padding-left: 2rem;
    }

    :global(li) {
        margin-bottom: 0.5rem;
    }

    :global(strong) {
        font-weight: bold;
    }

	main {
		margin-left: auto;
		margin-right: auto;
		min-height: 90vh;
	}

	.website {
		min-height: 100vh;
	}
</style>
