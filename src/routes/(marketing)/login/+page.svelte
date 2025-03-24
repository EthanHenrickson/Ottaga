<script lang="ts">
    import Login from '../../../lib/components/Login.svelte';
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

		height: 100%;
	}
</style>
