<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const loadingMessageOptions = ['Loading... ', 'Analyzing message...', 'Generating response...'];

	let index = $state(0);
	let currentMessage = $state('');

	onMount(() => {
		let LoadingMessageInterval = setInterval(() => {
			if (index < loadingMessageOptions.length - 1) {
				index += 1;
			}
		}, 3000);

		return () => clearInterval(LoadingMessageInterval);
	});

	//Update the message being shown when the index is changed
	$effect(() => {
		currentMessage = loadingMessageOptions[index];
	});
</script>

<div class="grid">
	{#key currentMessage}
		<p class="loading" in:fade={{ delay: 500, duration: 500 }} out:fade={{ duration: 400 }}>
			{currentMessage}
		</p>
	{/key}
</div>

<style>
	.grid {
		display: grid;
		place-items: center;
	}

	p {
		grid-area: 1/1;
	}
</style>
