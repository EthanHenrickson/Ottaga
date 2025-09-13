<script>
	import ToastContainer from '$lib/client/components/ToastContainer.svelte';
	import '../global.css';
	let { children } = $props();
</script>

<ToastContainer />
{@render children?.()}
