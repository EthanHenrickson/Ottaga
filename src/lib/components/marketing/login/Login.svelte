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
	let formAction = $derived<FormAction>(
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
			{mode === "Login" ? "Login" : "Register"}
		</div>
		<button
			class="accountMode"
			onclick={toggleAccountMode}
			aria-label={mode === "Login"
				? "Create new account"
				: "Return to login"}
		>
			<span>
				{mode === "Login"
					? "Don't have an account?"
					: "Already have an account?"}
			</span>
			<span class="clickHere">Click Here</span>
		</button>
	</div>
	<form method="POST" action={formAction}>
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
					aria-required="true"
					aria-invalid={form?.error ? "true" : "false"}
					aria-describedby="error"
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
				aria-required="true"
				aria-invalid={form?.error ? "true" : "false"}
				aria-describedby="error"
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
				aria-required="true"
				aria-invalid={form?.error ? "true" : "false"}
				aria-describedby="error"
			/>
			{#if form?.error}
				<span id="error" class="error" aria-live="assertive"
					>{form.error}</span
				>
			{/if}
		</div>
		<button
			type="submit"
			class="submitButton"
			aria-label={mode === "Login"
				? "Login to account"
				: "Create new account"}
		>
			{mode === "Login" ? "Login" : "Register"}
		</button>
	</form>
</div>

<style>
	.login {
		display: flex;
		flex-direction: column;
		padding: 4rem;

		background-color:var(--AccentColorSecondary);
		border-radius: 1rem;
		filter: drop-shadow(rgb(116, 116, 116) 0.4rem 0.4rem .6rem);
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
		padding: 0rem;
	}

	.submitButton {
		margin-top: 1rem;
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
