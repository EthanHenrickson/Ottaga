<script lang="ts">
    import Login from '../../../lib/components/marketing/login/Login.svelte';
    import type { ActionData } from './$types';

	//This is needed because sveltekit passes errors back into the page. We then pass this to the login component too display them.
	let { form }: { form: ActionData } = $props();
</script>

<div class="content">
	<Login {form} />
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100vh;
	}
</style>
