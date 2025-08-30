<script lang="ts">
	import type { ChatMessage } from '$lib/types';

	import { marked } from 'marked';
	import { DecodeSSE } from '$lib/utility/server/SSE/SSEHelper';
	import { tick } from 'svelte';
	import LoadingMessageContainer from './LoadingMessageContainer.svelte';

	// Props: chatID is used to identify the current chat session
	let { chatID }: { chatID: string } = $props();

	let messageContainer: HTMLElement;

	let isChatScrolledToBottom: boolean = $state(false);
	let isLLMLoading = $state(false);
	let userMessageInput = $state('');
	let messageArray: ChatMessage[] = $state([
		{
			role: 'assistant',
			content: 'How are you feeling today?'
		}
	]);


	// Handles form submission, sends message to backend and processes streaming response
	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!userMessageInput.trim()) return;

		// Set loading state, append message to chat, await svelte update cycle, scroll to bottom of
		messageArray.push({ role: 'user', content: userMessageInput });
		isLLMLoading = true;
		scrollToBottom(true);

		try {
			// Send messages to LLM API endpoint
			const response: Response = await fetch('/api/guest/llm', {
				method: 'POST',
				body: JSON.stringify({
					chatID: chatID,
					messageInput: userMessageInput
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			isLLMLoading = false;

			if (!response.ok) {
				switch (response.status) {
					case 404:
						alert('API not found. Please try again later');
						break;
					case 429:
						alert('Rate Limit Exceeded. Please send messages slower');
						break;
					default:
						alert(`HTTP error! status: ${response.status}`);
				}
				messageArray.pop();
				return;
			}

			if (!response.body) {
				throw new Error(`Missing critical LLM data`);
			}

			userMessageInput = '';

			const reader = response.body.getReader();
			messageArray.push({ role: 'assistant', content: '' });

			while (true) {
				const { done, value } = await reader.read();
				if (done) return;

				const decodedSSEArray = DecodeSSE<{
					content: string;
				}>(value);

				//Loop through SSE blocks and append chunks to messages
				for (const dataBlock of decodedSSEArray) {
					if (dataBlock.content == '[DONE]') {
						reader.cancel();
						return;
					} else {
						messageArray[messageArray.length - 1].content += dataBlock.content;
						scrollToBottom();
					}
				}
			}
		} catch (error) {
			console.log(error);

			messageArray.push({
				role: 'assistant',
				content: 'Sorry, there was an error processing your request.'
			});
		}
	}

	//Checks to see if the user is scrolled to the bottom of the chat window
	async function handleScroll() {
		const { scrollTop, scrollHeight, clientHeight }= messageContainer

		const PixelsFromBottom = scrollHeight - scrollTop - clientHeight;
		isChatScrolledToBottom = Math.abs(PixelsFromBottom) < 50;
	}

	// Scroll to the bottom of the chat container
	async function scrollToBottom(force: boolean = false) {
		if (isChatScrolledToBottom || force) {
			await tick();
			messageContainer.scroll({
				top: messageContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	}
</script>

{#snippet messageBox(message: ChatMessage)}
	<div class="message {message.role}">
		<strong>{message.role === 'user' ? 'You' : 'Ottaga'}:</strong>
		<p>
			{@html marked.parse(message.content)}
		</p>
	</div>
{/snippet}

<div class="content">
	<div class="chat-container">
		<div class="messages" bind:this={messageContainer} onscroll={handleScroll}>
			{#each messageArray as message}
				{@render messageBox(message)}
			{/each}

			{#if isLLMLoading}
				<div class="loadingMessageContainer">
					<LoadingMessageContainer />
				</div>
			{/if}
		</div>

		<form onsubmit={handleSubmit} class="input-form">
			<input
				type="text"
				bind:value={userMessageInput}
				placeholder="Send a message"
				disabled={isLLMLoading}
			/>

			<button class="sendButton" type="submit" disabled={isLLMLoading}>Send</button>
		</form>
	</div>
</div>

<style>
	.content {
		margin: 0px auto;

		max-width: 800px;
		width: 65vw;
		height: 85vh;
	}

	.chat-container {
		padding: 1rem;

		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;

		border-left: 1px solid;
		border-right: 1px solid;
		border-image: linear-gradient(
				to bottom,
				transparent 0%,
				var(--AccentColorPrimary) 10%,
				var(--AccentColorPrimary) 80%,
				transparent 90%
			)
			1 100%;
	}

	.messages {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
		gap: 20px;

		overflow: scroll;

		margin-bottom: 20px;
		font-family: 'Times New Roman', Times, serif;
	}

	.message {
		padding: 0.75rem;
		border-radius: 0.75rem;
		width: 80%;
	}

	.message strong {
		font-weight: 600;
	}

	.message.user {
		background-color: var(--MessageBackground-User);
		align-self: end;
	}

	.message.assistant {
		background-color: var(--MessageBackground-Assistant);
	}

	.input-form {
		display: flex;
		gap: 10px;
		top: 0px;
		position: relative;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.downButton {
		border: none;
		background: none;
		cursor: pointer;
	}

	button:disabled {
		background-color: #ccc;
	}

	.loading {
		text-align: center;
		color: #666;
		font-style: italic;
	}

	.bottomScroll {
		position: absolute;
		margin-top: -5rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 5;
		background-color: transparent;
	}

	.loadingMessageContainer {
		width: 100%;
		text-align: center;
		font-style: italic;
	}
</style>
