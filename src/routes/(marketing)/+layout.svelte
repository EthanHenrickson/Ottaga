<script>
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="website">
	<Nav />
	<main>
		<slot />
	</main>
</div>

<style>
	:global(:root) {
		--MessageBackground-Assistant: #f5f5f5;
		--MessageBackground-User: #e3f2fd;
		--AccentColorPrimary: #98d7ff;
		--AccentColorSecondary: #e6f2f9;

		--text-color: black;
	}

	:global(body) {
		margin: 0;
		font-family: 'Open Sans', serif;
	}

	main {
		padding-top: 3rem;
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
		min-height: 90vh;
	}

	.website {
		min-height: 100vh;
		padding: 0 1rem;
	}
</style>
