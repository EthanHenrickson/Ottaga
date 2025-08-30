<script>
	import { Toast } from '$lib/client/stores/toastClient.svelte';
	import ToastMessage from './ToastMessage.svelte';
</script>

<div class="toastContainer">
	{#each Toast.values as Message (Message.id)}
		<ToastMessage id={Message.id} message={Message.message} type={Message.toastType} />
	{/each}
</div>

<style>
	.toastContainer {
		position: absolute;
		top: 100px;
		right: 20px;

		display: flex;
		flex-direction: column;
		gap: 10px;

		z-index: 100;
	}
</style>
