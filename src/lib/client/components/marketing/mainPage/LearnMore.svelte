<script>
	import { resolve } from '$app/paths';
</script>

<section>
	<div class="content">
		<p class="text">Want to learn more about us and why we do it?</p>
		<a
			href={resolve('/learn')}
			class="learnButton"
			role="button"
			aria-label="Learn more about Ottaga">Learn More</a
		>
	</div>
</section>

<style>
	section {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		background-color: var(--bg-secondary);
		padding: 5rem 0;
	}

	.content {
		max-width: 800px;
		padding: 0rem 1rem;

		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 1rem;
	}

	.text {
		font-size: 1.2rem;
		font-weight: 400;
		text-align: center;
		line-height: 2rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	a {
		background-color: var(--bg-primary);
		color: var(--text-primary);
		font-size: 1rem;
		font-weight: 400;

		text-decoration: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.75rem;
		filter: drop-shadow(var(--shadow-sm));
		transition: all 0.25s;
	}

	a:hover {
		filter: drop-shadow(var(--shadow-md));
		transform: translateY(-3px);
	}
	
	a:visited {
	    color: var(--text-primary);
	}
	
	@media (max-width: 600px) {
		.content {
			flex-direction: column;
		}
	}
</style>
