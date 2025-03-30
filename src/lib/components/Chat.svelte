<script lang="ts">
	import type { Message } from "$lib/types";

	import { marked } from "marked";
	import DownArrow from "$lib/icons/downArrow.svelte";

	// Take in the chatID for this chat session.
	let { chatID }: { chatID: string } = $props();

	// Loading state to indicate when API request is in progress
	let isLoading = $state(false);

	// Current message input from the user
	let messageInput = $state("");

	// Array of chat messages between user and assistant
	let messageArray: Message[] = $state([
		{
			role: "assistant",
			content: "How can I help you today?",
		},
	]);

	// HTML Element containing the chat messages
	let chatMessageContainer: HTMLElement;

	// Boolean representing if a user is scrolled to the bottom of the chat window
	let isChatScrolledToBottom: Boolean = $state(true);

	//This function scrolls the chat
	function scrollToBottom() {
		chatMessageContainer.scrollTo({
			top: chatMessageContainer.scrollHeight,
			behavior: "smooth",
		});
	}

	/**
	 * Handles form submission for sending messages
	 */
	async function handleSubmit(e: Event) {
		e.preventDefault();

		// Don't process empty messages
		if (!messageInput.trim()) return;

		isLoading = true;

		// Add user message to chat history
		messageArray.push({ role: "user", content: messageInput });

		try {
			// Send messages to API endpoint
			const response = await fetch("/api/llm", {
				method: "POST",
				body: JSON.stringify({
					chatID: chatID,
					messageInput: messageInput,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// Update chat history with assistant's response
				let responseData = await response.json();
				messageArray.push(responseData.data);
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			// Add error message to chat if request fails
			messageArray.push({
				role: "assistant",
				content: "Sorry, there was an error processing your request.",
			});
		} finally {
			isLoading = false;
			messageInput = "";
		}
	}

	async function handleScroll() {
		isChatScrolledToBottom =
			Math.abs(
				chatMessageContainer.scrollHeight -
					chatMessageContainer.scrollTop -
					chatMessageContainer.clientHeight,
			) < 100;
	}
</script>

<div class="chat-container">
	<div
		class="messages"
		bind:this={chatMessageContainer}
		onscroll={handleScroll}
	>
		{#each messageArray as message}
			<div class="message {message.role}">
				<strong>{message.role === "user" ? "You" : "Ottaga"}:</strong>
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

		<button class="sendButton" type="submit" disabled={isLoading}
			>Send</button
		>

		{#if !isChatScrolledToBottom}
			<div class="bottomScroll">
				<button
					class="downButton"
					type="button"
					onclick={scrollToBottom}><DownArrow /></button
				>
			</div>
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
		padding: 10px 20px;
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
