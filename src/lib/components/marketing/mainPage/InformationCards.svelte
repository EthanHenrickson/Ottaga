<script>
	import Clock from '$lib/icons/clock.svelte';
	import CutCreditCard from '$lib/icons/cutCreditCard.svelte';
	import Lock from '$lib/icons/lock.svelte';
	import OpenDoor from '$lib/icons/openDoor.svelte';
</script>

<section class="content" aria-labelledby="feature-heading" id="cards">
	<h2 id="feature-heading">What Makes Ottaga Special?</h2>
	<div class="features" role="list">
		<div class="feature" role="listitem">
			<Clock />
			<h3>Always Available</h3>
			<p>
				24/7 support whenever you need it. No appointments, no waiting lists - just immediate,
				compassionate assistance when you need it most.
			</p>
		</div>
		<div class="feature" role="listitem">
			<Lock />
			<h3>Private & Secure</h3>
			<p>
				Your conversations are completely private and we will never share or sell your data. You
				maintain full control over your information.
			</p>
		</div>
		<div class="feature" role="listitem">
			<CutCreditCard />
			<h3>Completely Free</h3>
			<p>
				Mental health support should be accessible to everyone. Our services will always remain 100%
				free with no hidden costs or premium barriers.
			</p>
		</div>
		<div class="feature" role="listitem">
			<OpenDoor />
			<h3>Open Source</h3>
			<p>
				Our code is fully transparent and accessible to everyone. This transparency allows everyone
				to verify our commitment to your privacy and security.
			</p>
		</div>
	</div>
</section>

<style>
	.content {
		width: 100%;
		margin: 7rem 0rem;
	}

	h2 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		font-weight: 400;
		text-align: center;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin: 2rem auto;
		width: 100%;
		max-width: 900px;
	}

	.feature {
		padding: 1.5rem;
		border-radius: 1rem;
		background-color: #ffffff;
		box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
		text-align: center;
	}

	.feature h3 {
		color: black;
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		font-size: 1.6rem;
		font-weight: 400;
	}

	.feature p {
		font-size: 1rem;
		font-weight: 300;
	}

	@media (max-width: 600px) {
		.feature {
			margin: 0px 1rem;
		}

		h2 {
			font-size: 1.7rem;
		}

		.feature p {
			font-size: 0.9rem;
		}

		.feature h3 {
			font-size: 1.4rem;
		}
	}
</style>
