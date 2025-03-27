<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
    import type { PageProps } from './$types';

	//Take in the chatID from the server and pass it too the chat component 
	let { data }: PageProps = $props()
	let chatID = data.chatID
</script>

<div class="content">
	<Chat {chatID}/>
</div>

<style>
	.content {
		height: 90vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
