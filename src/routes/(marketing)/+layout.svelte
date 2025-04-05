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
		--AccentColorSecondary: #e6f6fe;

		--Orange400: rgb(255, 175, 65);

		--text-color: black;
	}

	:global(body) {
		margin: 0;
		font-family: 'Open Sans', serif;
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
