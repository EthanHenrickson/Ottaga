<script>
    import DashboardNav from "$lib/components/DashboardNav.svelte";
    let { children } = $props();
</script>

<div class="content">
    <div class="nav">
        <DashboardNav />
    </div>
    {@render children?.()}
</div>

<style>
    :global(:root) {
		--MessageBackground-Assistant: #dfd9d9;
		--MessageBackground-User: #d7e4ed;

		--AccentColorPrimary: #2485c1;
		--AccentColorSecondary: #e6f6fe;

		--Orange400: rgb(255, 175, 65);

		--text-color: black;
	}

	:global(body) {
		margin: 0;
		font-family: "Open Sans", serif;
	}
    
    .nav {
        position: sticky;
        top: 0;
    }
</style>
