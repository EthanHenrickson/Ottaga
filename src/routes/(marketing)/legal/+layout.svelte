<script>
	let { children } = $props();
</script>

<div class="content">
	{@render children?.()}
</div>

<style>
	.content {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		line-height: 1.6;
	}
</style>
