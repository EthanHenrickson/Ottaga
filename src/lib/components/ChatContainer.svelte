<script lang="ts">
	import type { Message } from "$lib/types";

	import { marked } from "marked";
	import DownArrow from "$lib/icons/downArrow.svelte";
	import { DecodeSSEandParseContent } from "$lib/utility/SSEHelper";

	// Props: chatID is used to identify the current chat session
	let { chatID }: { chatID: string } = $props();

	// References the HTML element containing the chat messages
	let chatMessageContainer: HTMLElement;

	let isLoading = $state(false);
	let userMessageInput = $state(""); //References new user message input
	let messageArray: Message[] = $state([
		{
			role: "assistant",
			content: "How are you feeling today?",
		},
	]);

	//Representing if a user is scrolled to the bottom of the chat window
	let isChatScrolledToBottom: Boolean = $state(true);

	// Function to scroll to the bottom of the chat container
	function scrollToBottom() {
		chatMessageContainer.scrollTo({
			top: chatMessageContainer.scrollHeight,
			behavior: "smooth",
		});
	}

	// Handles form submission, sends message to backend and processes streaming response
	async function handleSubmit(e: Event) {
		e.preventDefault();

		// Skip empty messages
		if (!userMessageInput.trim()) return;

		// Set loading state and append message to chat
		isLoading = true;
		messageArray.push({ role: "user", content: userMessageInput });

		await CheckUserAtBottomOfChat();
		scrollToBottom();

		try {
			// Send messages to LLM API endpoint
			const response: Response = await fetch("/api/llm", {
				method: "POST",
				body: JSON.stringify({
					chatID: chatID,
					messageInput: userMessageInput,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const reader = response.body?.getReader();

			if (reader) {
				messageArray.push({ role: "assistant", content: "" });

				// Process the stream
				let breakLoops = false;
				while (true) {
					const { done, value } = await reader.read();

					if (done) break;

					const decodeResultDataArray = DecodeSSEandParseContent(
						value,
						{ stripDataField: true, parseJson: true },
					) as { content: string }[];

					//Loop through SSE blocks and append chunks to messages
					for (let dataBlock of decodeResultDataArray) {
						if (dataBlock.content == "[DONE]") {
							breakLoops = true;
							break;
						} else {
							messageArray[messageArray.length - 1].content +=
								dataBlock.content;
						}
					}

					// Scroll to bottom if user is at the bottom
					let tempIsChatOnBottom = isChatScrolledToBottom;

					if (tempIsChatOnBottom == true) {
						await CheckUserAtBottomOfChat();
						scrollToBottom();
					}

					if (breakLoops) {
						break;
					}
				}
			}
		} catch (error) {
			console.log(error);
			// Add error message to chat if request fails
			messageArray.push({
				role: "assistant",
				content: "Sorry, there was an error processing your request.",
			});
		} finally {
			isLoading = false;
			userMessageInput = "";
		}
	}

	//Checks to see if the user is scrolled to the bottom of the chat window
	async function CheckUserAtBottomOfChat() {
		//Get chat window height elements
		const TotalHeight = chatMessageContainer.scrollHeight;
		const PixelsScrolled = chatMessageContainer.scrollTop;
		const DisplayHeight = chatMessageContainer.clientHeight;

		//Total number of pixels from being scrolled to bottom of chat window
		const PixelsFromBottom = TotalHeight - PixelsScrolled - DisplayHeight;
		isChatScrolledToBottom = Math.abs(PixelsFromBottom) < 200;
	}
</script>

<div class="chat-container">
	<div
		class="messages"
		bind:this={chatMessageContainer}
		onscroll={CheckUserAtBottomOfChat}
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
			bind:value={userMessageInput}
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
		overflow: scroll;
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
		background-color: var(--AccentColorPrimary);
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
