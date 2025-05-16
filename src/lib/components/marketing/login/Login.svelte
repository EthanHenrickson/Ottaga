<script lang="ts">
	import type { ActionData } from "../../../../routes/(marketing)/login/$types";

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
	function toggleAccountMode() {
		mode = mode === "Login" ? "SignUp" : "Login";
	}
</script>

<div class="login">
	<div class="head">
		<div class="loginMode">
			{mode === "Login" ? "Login" : "Create Account"}
		</div>
		<button class="accountMode" onclick={toggleAccountMode}>
			<span>
				{mode === "Login"
					? "Don't have an account?"
					: "Already have an account?"}
			</span>
			<span class="clickHere">Click Here</span>
		</button>
	</div>
	<form action={formMode} method="post">
		{#if mode === "SignUp"}
			<br />
			<div class="inputSection">
				<label for="name">Nickname</label>
				<input
					id="name"
					type="text"
					placeholder="Joe"
					name="name"
					max="20"
					required
				/>
			</div>
		{/if}
		<br />
		<div class="inputSection">
			<label for="email">Email</label>
			<input
				id="email"
				type="email"
				placeholder="Example@gmail.com"
				name="email"
				pattern={regexEmail}
				required
			/>
		</div>
		<br />
		<div class="inputSection">
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				placeholder="ABC123"
				name="password"
				required
			/>
		</div>
		<button type="submit" class="submitButton"
			>{mode === "Login" ? "Login" : "Create"}</button
		>
		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
	</form>
</div>

<style>
	.login {
		display: flex;
		flex-direction: column;
		padding: 4rem;

		background-color: var(--MessageBackground-Assistant);
		border-radius: 1rem;
		filter: drop-shadow(rgb(54, 54, 54) 0.2rem 0.2rem 0.5rem);
	}

	.head {
		color: black;
		font-size: 1.2rem;
	}

	.loginMode {
		font-size: 2rem;
	}

	.accountMode {
		font-size: 0.9rem;
		border: none;
		outline: none;
		background-color: transparent;
		color: rgb(0, 0, 0);
		cursor: pointer;
	}

	.submitButton {
		font-size: 1.2rem;
		margin-top: 1rem;
		padding: 1rem 2rem;
		background-color: var(--AccentColorPrimary);
		color: white;
		border: 2px solid transparent;
		cursor: pointer;
		border-radius: 0.5rem;
		transition: all 0.25s;
	}

	.error {
		color: rgb(248, 131, 131);
	}

	.clickHere {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-decoration-color: var(--AccentColorPrimary);
	}

	input {
		display: flex;
		flex-direction: column;

		padding: 0.75rem;
		outline: none;
		border: 3px solid transparent;
		border-radius: 0.5rem;
		font-size: 1rem;
		width: 300px;
	}

	@media only screen and (max-width: 500px) {
		input {
			width: 250px;
		}

		.login {
			padding: 2rem;
		}
	}
</style>
