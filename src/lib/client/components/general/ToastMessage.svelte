<script lang="ts">
	import Error from '$lib/client/icons/toast/Error.svelte';
	import Info from '$lib/client/icons/toast/Info.svelte';
	import Success from '$lib/client/icons/toast/Success.svelte';
	import Warning from '$lib/client/icons/toast/Warning.svelte';
	import { Toast } from '$lib/client/stores/toastClient.svelte';
	import { fade, fly } from 'svelte/transition';

	const {
		id,
		message,
		type
	}: { id: string; message: string; type: 'Success' | 'Warning' | 'Error' | 'Info' } = $props();
</script>

<div
	class={`toast ${type}`}
	role="alert"
	aria-live="polite"
	in:fade
	out:fly={{ x: 75, duration: 1000 }}
>
	<div class="icon">
		{#if type == 'Success'}
			<Success />
		{:else if type == 'Warning'}
			<Warning />
		{:else if type == 'Error'}
			<Error />
		{:else if type == 'Info'}
			<Info />
		{/if}
	</div>
	<span class="message">{message}</span>
	<div class="buttonContainer">
		<button
			onclick={() => {
				Toast.removeByID(id);
			}}
			aria-label="Close notification"
		>
			&times;
		</button>
	</div>
</div>

<style>
	.Info {
		background-color: var(--info);
	}

	.Success {
		background-color: var(--success);
	}

	.Error {
		background-color: var(--error);
	}

	.Warning {
		background-color: var(--warning);
	}

	.toast {
		display: flex;
		flex-direction: row;
		align-items: center;

		padding: 1rem;
		padding-left: 0rem;
		border-radius: 0.5rem;
		width: 16rem;
		opacity: 0.95;

		color: var(--text-primary);

		filter: drop-shadow(rgb(154, 154, 154) 0.4rem 0.4rem 0.6rem);
	}

	.message {
		display: flex;
		align-items: center;
		margin-right: 10px;
		flex-grow: 1;
		font-size: 0.9rem;
		font-weight: 400;
	}

	.buttonContainer {
		transform: translateY(-0.5rem);
	}

	.buttonContainer button {
		font-size: 1.4rem;
		color: var(--text-primary);
	}

	.icon {
		padding: 0rem 0.75rem;
	}

	button {
		outline: none;
		background: none;
		margin: 0px;
		padding: 0px;
	}
</style>
