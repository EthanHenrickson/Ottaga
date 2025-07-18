<script lang="ts">
	import Chat from '$lib/components/chat/ChatContainer.svelte';
    import type { PageProps } from './$types';

	//Take in the chatID from the server and pass it too the chat component 
	let { data }: PageProps = $props()
	let chatID = data.chatID
</script>

<div class="content">
	<div class="chat">
		<Chat {chatID}/>
	</div>
</div>

<style>
	.content {
		width: 100%;
		min-height: 100vh;

		display: flex;
		align-items: center;
		justify-content: center;
		
	}

	.chat {
		width: 60vw;
		height: 85vh;
		margin-top: 3rem;
	}

	@media (width < 800px) {
		.chat {
			width: 90vw;
		}
	}
</style>
