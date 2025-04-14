<footer>
	<div class="footer">
		<div class="content">
			<div class="column">
				<h2>Company</h2>
				<ul>
					<li><a href="/">Who are we?</a></li>
					<li><a href="/">Contact</a></li>
				</ul>
			</div>
			<div class="column">
				<h2>Legal</h2>
				<ul>
					<li><a href="/legal/tos">Terms of Service</a></li>
					<li><a href="/legal/privacy">Privacy Policy</a></li>
					<li><a href="/legal/cookie">Cookie Policy</a></li>
				</ul>
			</div>
		</div>
		<div class="tagLine">
			<p>Ottaga - Your safe space to talk</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;

		justify-content: center;

		padding: 0.5rem 0rem;
	}

	h2 {
		font-size: 1.3rem;
		font-weight: 500;
		margin: 0px;
	}

	ul {
		margin: 0px;
		list-style: none;
		margin: none;
		padding: 0;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
		font-weight: 400;
		font-size: 0.9rem;
	}

	.tagLine {
	}
</style>
