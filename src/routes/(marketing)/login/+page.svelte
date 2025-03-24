<script lang="ts">
    import Login from '../../../components/Login.svelte';
    import type { ActionData } from './$types';

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
