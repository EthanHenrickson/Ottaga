<script lang="ts">
	import Chat from '$lib/components/chat/ChatContainer.svelte';
    import type { PageProps } from './$types';

	//Take in the chatID from the server and pass it too the chat component 
	let { data }: PageProps = $props()
	let chatID = data.chatID
</script>

<svelte:head>
	<title>Ottaga | Chat</title>

	<meta
		name="description"
		content="Start a supportive conversation with Ottaga's AI. Get emotional support, guidance, and a safe space to talk about your mental health concerns."
	/>
	<meta name="keywords" content="AI chat, mental health support, emotional support, therapy chat, Ottaga" />
	<meta charset="UTF-8" />
</svelte:head>

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
		margin-top: 3rem;
	}

	@media (width < 800px) {
		.chat {
			width: 90vw;
		}
	}
</style>
