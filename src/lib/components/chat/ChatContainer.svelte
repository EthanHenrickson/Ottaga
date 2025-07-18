<script lang="ts">
	import type { Message } from "$lib/types";

	import { marked } from "marked";
	import { DecodeSSE } from "$lib/utility/SSEHelper";
	import { tick } from "svelte";
	import LoadingMessageContainer from "./LoadingMessageContainer.svelte";

	// Props: chatID is used to identify the current chat session
	let { chatID }: { chatID: string } = $props();

	// References the HTML element containing the chat messages
	let chatMessageContainer: HTMLElement;

	//State variables
	let chatScrolledToBottom: boolean = $state(false);
	let isLoading = $state(false);
	let userMessageInput = $state(""); //References new user message input
	let messageArray: Message[] = $state([
		{
			role: "assistant",
			content: "How are you feeling today?",
		},
	]);

	// Function to scroll to the bottom of the chat container
	async function scrollToBottom() {
		await tick();
		chatMessageContainer.scroll({
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

		await tick();
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
				isLoading = false;

				// Process the stream
				let breakLoops = false;
				while (true) {
					const { done, value } = await reader.read();

					if (done) break;

					const decodedSSEArray = DecodeSSE<{
						content: string;
					}>(value);

					//Loop through SSE blocks and append chunks to messages
					for (let dataBlock of decodedSSEArray) {
						if (dataBlock.content == "[DONE]") {
							breakLoops = true;
							break;
						} else {
							messageArray[messageArray.length - 1].content +=
								dataBlock.content;
						}
					}

					if (chatScrolledToBottom) {
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
	async function handleScroll() {
		//Get chat window height elements
		const TotalHeight = chatMessageContainer.scrollHeight;
		const PixelsScrolled = chatMessageContainer.scrollTop;
		const DisplayHeight = chatMessageContainer.clientHeight;

		//Total number of pixels from being scrolled to bottom of chat window
		const PixelsFromBottom = TotalHeight - PixelsScrolled - DisplayHeight;
		chatScrolledToBottom = Math.abs(PixelsFromBottom) < 50;
	}
</script>

{#snippet messageBox(message: Message)}
	<div class="message {message.role}">
		<strong>{message.role === "user" ? "You" : "Ottaga"}:</strong>
		<p>
			{@html marked.parse(message.content)}
		</p>
	</div>
{/snippet}

<div class="content">

	<div class="chat-container">
		<div
			class="messages"
			bind:this={chatMessageContainer}
			onscroll={handleScroll}
		>
			{#each messageArray as message}
				{@render messageBox(message)}
			{/each}
	
			{#if isLoading}
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
				disabled={isLoading}
			/>
	
			<button class="sendButton" type="submit" disabled={isLoading}
				>Send</button
			>
		</form>
	</div>
</div>


<style>
	.content {
		height: 99%;
		margin: 0px auto;
	}

	.chat-container {
		height: 100%;
		max-width: 800px;
		padding: 1rem;

		display: flex;
		flex-direction: column;

		border-left: 1px solid;
		border-right: 1px solid;
  		border-image: linear-gradient(to bottom, transparent 0%, var(--AccentColorPrimary) 10%, var(--AccentColorPrimary) 80%, transparent 90%) 1 100%;
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
