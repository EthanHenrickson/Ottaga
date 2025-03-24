<script lang="ts">
	import type { Message } from '$lib/types';
	import { marked } from 'marked';
	import DownArrow from '$lib/icons/downArrow.svelte';

	/**
	 * Chat component that handles user interaction with the AI assistant
	 * Manages message state, loading states, and API communication
	 */

	let container: HTMLElement;

	/** Current message input from the user */
	let messageInput = $state('');

	/** Loading state to indicate when API request is in progress */
	let isLoading = $state(false);

	/** Boolean representing if a user is scrolled to the bottom of the chat window*/
	let chatContainerAtBottom: Boolean = $state(true);

	/** Array of chat messages between user and assistant */
	let userMessages: Message[] = $state([
		{
			role: 'assistant',
			content: 'How can I help you today?'
		}
	]);

	function scrollToBottom() {
		container.scrollTo({
			top: container.scrollHeight,
			behavior: 'smooth'
		});
	}

	$effect(() => {
		userMessages;
		scrollToBottom();
	});

	/**
	 * Handles form submission for sending messages
	 * @param {Event} e - Form submit event
	 * @returns {Promise<void>}
	 */
	async function handleSubmit(e: Event) {
		e.preventDefault();
		// Don't process empty messages
		if (!messageInput.trim()) return;

		isLoading = true;
		// Add user message to chat history
		userMessages.push({ role: 'user', content: messageInput });
		messageInput = '';

		try {
			// Send messages to API endpoint
			const response = await fetch('/api/chat', {
				method: 'POST',
				body: JSON.stringify({ messages: userMessages }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Update chat history with assistant's response
				userMessages = await response.json();
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			// Add error message to chat if request fails
			userMessages.push({
				role: 'assistant',
				content: 'Sorry, there was an error processing your request.'
			});
		} finally {
			isLoading = false;
		}
	}

	async function handleScroll() {
		chatContainerAtBottom =
			Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 100;
	}
</script>

<div class="chat-container">
	<div class="messages" bind:this={container} onscroll={handleScroll}>
		{#each userMessages as message}
			<div class="message {message.role}">
				<strong>{message.role === 'user' ? 'You' : 'Alanda'}:</strong>
				{@html marked.parse(message.content)}
			</div>
		{/each}
		{#if isLoading}
			<div class="loading">Loading...</div>
		{/if}
	</div>
	<form onsubmit={handleSubmit} class="input-form">
		<input
			type="text"
			bind:value={messageInput}
			placeholder="Type your message..."
			disabled={isLoading}
		/>
		<button class="sendButton" type="submit" disabled={isLoading}>Send</button>

		{#if !chatContainerAtBottom}
			<div class="bottomScroll"><button class="downButton" type="button" onclick={scrollToBottom}><DownArrow /></button></div>
		{/if}
	</form>
</div>

<style>
	@media (max-width: 800px) {
		.chat-container {
			padding: 10px !important;
		}
	}

	.chat-container {
		height: 90%;
		width: 90%;
		max-width: 800px;
		margin: 0 auto;

		display: flex;
		flex-direction: column;

		border: 2px solid #ccc;
		border-radius: 4px;
	}

	.messages {
		flex-grow: 1;
		overflow-y: auto;
		padding: 1rem;
	}

	.message {
		margin-bottom: 10px;
		padding: 1rem;
		border-radius: 1rem;
	}

	.message.user {
		background-color: var(--MessageBackground-User);
	}

	.message.assistant {
		background-color: var(--MessageBackground-Assistant);
	}

	.input-form {
		display: flex;
		gap: 10px;
		top: 0px;
		padding: 1rem;
		position: relative;
	}

	input {
		flex-grow: 1;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.sendButton {
		padding: 8px 16px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
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
</style>
