<script>
	import ToastContainer from '$lib/client/components/general/ToastContainer.svelte';
	import '../global.css';
	let { children } = $props();
</script>

<ToastContainer />

<main>
	{@render children?.()}
</main>

<style>
	main {
		display: flex;
		min-height: 100vh;
		width: 100%;

		background-color: var(--bg-primary);
	}
</style>