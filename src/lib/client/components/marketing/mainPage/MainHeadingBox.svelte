<script lang="ts">
	import { resolve } from "$app/paths";

</script>

<header aria-label="Main page header">
	<div class="content">
		<div class="header" role="heading" aria-level="1">
			<h1>
				We care about <span class="highlightYou" aria-hidden="true">you</span><span class="sr-only"
					>you</span
				>.
			</h1>
		</div>
		<div class="messaging">
			<p>Your digital mental health companion - always here, always free.</p>
		</div>
		<div class="getStarted">
			<a
				href={resolve("/chat")}
				class="conversationButton"
				role="button"
				aria-label="Start a conversation with Ottaga">Start a conversation →</a
			>
			<a href="#cards" class="learnButton" role="button" aria-label="Learn more about Ottaga"
				>Learn More</a
			>
		</div>
		<div class="features-quick">
			<div class="feature-item">
				<span class="icon">✓</span>
				<span>No Sign Up Required</span>
			</div>
			<div class="feature-item">
				<span class="icon">✓</span>
				<span>100% Free Forever</span>
			</div>
			<div class="feature-item">
				<span class="icon">✓</span>
				<span>Completely Private</span>
			</div>
		</div>
	</div>
	<div class="wave-divider">
		<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
			<path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
		</svg>
	</div>
</header>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: 2rem;
		height: 85vh;
		justify-content: center;
		background-color: var(--bg-secondary);
	}

	.highlightYou {
		position: relative;
	}

	.highlightYou::before {
		content: 'you';
		text-decoration: underline;
		text-decoration-color: var(--accent-primary);
		text-decoration-thickness: 3px;
		position: absolute;
		color: transparent;
		z-index: 1;
		transform: translateY(-8px);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.header h1 {
		font-size: 6rem;
		font-weight: 400;
		margin: 0rem;
		text-align: center;
		color: var(--text-primary);
	}

	.messaging {
		display: block;
		max-width: 500px;
	}

	.messaging p {
		margin: 0px;
		font-weight: 300;
		font-size: 1.6rem;
		text-align: center;
		color: var(--text-primary);
	}

	.getStarted {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: row wrap;
		gap: 1rem;
	}

	.conversationButton {
		background-color: var(--accent-primary);
		color: var(--text-inverse);
	}

	.learnButton {
		background-color: var(--bg-primary);
		color: var(--text-primary);
	}

	.features-quick {
		position: relative;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.feature-item {
		color: var(--text-primary)
	}

	.icon {
		color: var(--accent-primary);
		font-weight: 600;
	}

	a {
		text-decoration: none;
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-size: 1.1rem;
		font-weight: 400;
		filter: drop-shadow(var(--shadow-sm));
		transition: all 0.25s;
	}

	a:hover {
		filter: drop-shadow(var(--shadow-md));
		transform: translateY(-3px);
	}

	.wave-divider {
		position: relative;
		width: 100%;
		height: 100px;
		overflow: hidden;
		line-height: 0;
	}

	.wave-divider svg {
		position: relative;
		display: block;
		width: calc(100% + 1.3px);
		height: 100%;
		fill: var(--bg-secondary);
		transform: rotateY(180deg);
	}

	@media (max-width: 600px) {
		.getStarted {
			align-items: center;
			justify-content: center;
		}

		.messaging p {
			font-size: 1.2rem;
		}

		.header h1 {
			font-size: 2.6rem;
		}

		.highlightYou::before {
			content: 'You';
			text-decoration: underline;
			text-decoration-color: var(--AccentColorPrimary);
			text-decoration-thickness: 2px;
			position: absolute;
			color: transparent;
			z-index: -1;
			transform: translateY(-5px);
		}

		a {
			font-size: 1rem;
			padding: 1rem 2rem;
			border-radius: 0.75rem;
		}

		.features-quick {
			flex-direction: column;
			gap: .75rem;
		}
	}
</style>
