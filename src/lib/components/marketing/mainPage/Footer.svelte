<footer>
	<div class="footer">
		<div class="content">
			<div class="section">
				<a href="/learn">Who are we?</a>
				<a href="/contact">Contact Info</a>
			</div>
			<div class="section">
				<a href="/legal/tos">Terms of Service</a>
				<a href="/legal/privacy">Privacy Policy</a>
				<a href="/legal/cookie">Cookie Policy</a>
			</div>
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
</style>
