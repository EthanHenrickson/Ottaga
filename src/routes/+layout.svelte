<script>
	import ToastContainer from '$lib/client/components/general/ToastContainer.svelte';
	import '../global.css';
	let { children } = $props();
</script>

<ToastContainer />
{@render children?.()}
