<script>
	let { children } = $props();
</script>

{@render children?.()}

<style>
	:global(:root) {
		--MessageBackground-Assistant: #f5f5f5;
		--MessageBackground-User: #e4fde3;

		--AccentColorPrimary: #00a62f;
		--AccentColorSecondary: rgb(219, 255, 216);

		--Orange400: rgb(255, 175, 65);

		--text-color: black;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		background-color: #fff;
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

	:global(p) {
		margin: 0.8rem 0px;
	}

	:global(button) {
		padding: 0.7rem 1.5rem;
		background-color: var(--AccentColorPrimary);
		color: white;
		border-radius: 0.4rem;
		cursor: pointer;
		border: none;
		font-size: 0.9rem;
	}

	:global(button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible) {
		outline: 2px solid var(--AccentColorPrimary) !important;
		outline-offset: 2px;
		border-radius: 0.25rem;
	}

	:global(select) {
		padding: 0.2rem 0.7rem;
		font-size: 0.9rem;

		outline: none;
		background-color: transparent;

		border-bottom: 2px solid var(--AccentColorPrimary);
		border-top: none;
		border-right: none;
		border-left: none;
	}

	:global(input[type='checkbox']) {
		accent-color: var(--AccentColorPrimary);
	}
</style>
