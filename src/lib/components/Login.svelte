<script lang="ts">
    import type { ActionData } from "../../routes/(marketing)/login/$types";

	let { form }: { form: ActionData } = $props();

	// Regex pattern for email validation
	let regexEmail = String.raw`((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])`;

	// Type definitions for form modes and actions
	type FormMode = "Login" | "SignUp";
	type FormAction = "?/login" | "?/signup";

	// State management for form mode
	let mode = $state<FormMode>("Login");
	let formMode = $derived<FormAction>(
		mode === "Login" ? "?/login" : "?/signup",
	);

	// Toggle between login and signup modes
	function toggleMode() {
		mode = mode === "Login" ? "SignUp" : "Login";
	}
</script>

<div class="login">
	<div class="head">
		<div class="header">
			{mode === "Login" ? "Login" : "Create Account"}
		</div>
		<button class="question" onclick={toggleMode}>
			{mode === "Login"
				? "Don't have an account?"
				: "Already have an account?"}
			<span style="color: yellow;">Click Here</span>
		</button>
	</div>
	<form action={formMode} method="post">
		{#if mode === "SignUp"}
			<div class="inputField">
				<label for="firstname">First Name</label>
				<input
					type="text"
					placeholder="FirstName"
					name="firstName"
					max="20"
					required
				/>
			</div>
		{/if}
		<br />
		<div class="inputField">
			<label for="email">Email</label>
			<input
				type="email"
				placeholder="Example@gmail.com"
				name="email"
				pattern={regexEmail}
				required
			/>
		</div>
		<br />
		<div class="inputField">
			<label for="email">Password</label>
			<input
				type="password"
				placeholder="ABC123"
				name="password"
				required
			/>
		</div>
		<button type="submit" class="signin"
			>{mode === "Login" ? "Login" : "Create"}</button
		>
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
	</form>
</div>

<style>
	.error {
		color: rgb(248, 131, 131);
	}

	.head {
		margin: 2rem 5rem 1rem 5rem;
		color: black;
	}

	.header {
		font-size: 2rem;
	}

	.question {
		font-size: 0.9rem;
		border: none;
		outline: none;
		background-color: transparent;
		color: rgb(88, 88, 88);
		cursor: pointer;
	}

	.signin {
		font-size: 1.2rem;
		margin-top: 1rem;
		padding: 1rem 2rem;
		background-color: var(--main-hover);
		border: 2px solid transparent;
		cursor: pointer;
		border-radius: 0.5rem;
		transition: all 0.25s;
	}

	.signin:hover {
		transition: all 0.25s;
		border: 2px solid yellow;
	}

	.login {
		background-color: rgb(162, 227, 143);
		border-radius: 1rem;
		filter: drop-shadow(rgb(88, 88, 88) 0.2rem 0.2rem 1rem);
	}

	form {
		padding: 5rem;
		padding-top: 1.5rem;
	}

	input {
		padding: 0.75rem;
		width: 18vw;
		outline: none;
		border: 3px solid transparent;
		border-radius: 0.5rem;
		font-size: 1rem;
	}

	.inputField {
		display: flex;
		flex-direction: column;
		font-size: 1.1rem;
	}
</style>
