<footer aria-label="Site footer">
	<div class="footer">
		<div class="content">
			<nav aria-label="About Information" class="section">
				<h2 class="sr-only">About Ottaga</h2>
				<a href="/learn" aria-label="Learn about Ottaga">Who are we?</a>
				<a href="/contact" aria-label="Contact Ottaga">Contact Info</a>
			</nav>
			<nav aria-label="Legal information" class="section">
				<h2 class="sr-only">Legal</h2>
				<a href="/legal/tos" aria-label="Terms of Service">Terms of Service</a>
				<a href="/legal/privacy" aria-label="Privacy Policy">Privacy Policy</a>
				<a href="/legal/cookie" aria-label="Cookie Policy">Cookie Policy</a>
			</nav>
		</div>
	</div>
</footer>

<style>

	.content {
		width: 100%;

		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 50px;

		padding: 1rem 0rem;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0),
			rgba(210, 235, 250, 0.8)
		);
	}

	.section {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 15px;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
		font-weight: 400;
		font-size: 1rem;
	}

	a:hover {
		text-decoration: underline;
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
		border: 0;
	}
</style>
