<script>
	import Footer from '$lib/components/Footer.svelte';
	import { fly } from 'svelte/transition';
</script>

<div class="content">
	<div class="header">
		<h1>We care about <span class="highlightYou">you</span>.</h1>
	</div>
	<div class="getStarted">
		<div class="left">
			We know how it feels to be in a bad place mentally, thats why we provide a mental health companion to help
			completely free of charge.
		</div>
		<div class="right">
			<a href="/chat">Start a conversation > </a>
		</div>
	</div>
	<div class="chatBot">
		<!-- <div>
			Our chat bot is designed to help you through difficult situations that you are dealing with
		</div> -->
	</div>
</div>
<Footer />

<style>
	.content {
		margin-top: 5rem;
		margin-bottom: 10rem;
		margin-left: auto;
		margin-right: auto;
		max-width: 1000px;
	}

	.header {
		display: flex;
		justify-content: center;
		margin: 1rem 0rem;
	}

	.highlightYou {
		position: relative;
	}

	.highlightYou::before {
		content: 'You';
		text-decoration: underline;
		text-decoration-color: var(--AccentColorPrimary);
		text-decoration-thickness: 4px;
		position: absolute;
		color: transparent;
		z-index: -1;
	}

	h1 {
		font-size: 6rem;
		font-weight: 400;
	}

	.getStarted {
		display: grid;
		max-width: 900px;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 30px;
		margin: 2rem auto;
	}

	.getStarted .left {
		font-size: 1.4rem;
		font-weight: 300;
	}

	.getStarted .right {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	a {
		text-decoration: none;
		color: var(--text-color);
		padding: 1rem 2rem;
		border-radius: 0.75rem;
		font-size: 1.2rem;
		font-weight: 500;
		background-color: var(--AccentColorPrimary);
		filter: drop-shadow(rgb(130, 130, 130) 0.4rem 0.5rem 8px);
		transition: all 0.25s;
	}

	a:hover {
		filter: drop-shadow(rgb(119, 130, 137) 0.2rem 0.3rem 4px);
	}

	@media (max-width: 800px) {
		.content {
			padding-top: 4rem;
		}
		h1 {
			font-size: 4rem;
			font-size: 200;
		}
	}
</style>
