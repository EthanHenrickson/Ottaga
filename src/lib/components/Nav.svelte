<script>
	import { page } from '$app/state';
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<header>
	<div class="logo">Alanda</div>
	<button class="hamburger" class:open={isOpen} on:click={toggleMenu} aria-label="Menu">
		<span class="bar"></span>
		<span class="bar"></span>
		<span class="bar"></span>
	</button>
	<nav class="mainNav" class:open={isOpen}>
		<div class="nav-links">
			<a href="/" class:active={page.url.pathname === '/'} on:click={toggleMenu}>Home</a>
			<a href="/chat" class:active={page.url.pathname === '/chat'} on:click={toggleMenu}>Chat</a>
			<a href="/login" class:active={page.url.pathname === '/login'} on:click={toggleMenu}
				>Account</a
			>
		</div>
	</nav>
</header>

<style>
	header {
		height: var(--header-height);
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--hover-bg);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		backdrop-filter: blur(6px);
		z-index: 100;
		max-width: 1500px;
		padding: 10px 10%;
	}

	.logo {
		font-size: 1.7rem;
		font-weight: 400;
		color: var(--primary-color);
		z-index: 101;
	}

	.mainNav {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.mainNav a {
		text-decoration: none;
		color: var(--text-color);
		font-size: 1.25rem;
		transition: color 0.2s;
		font-weight: 400;
	}

	.mainNav a.active {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-decoration-color: var(--AccentColorPrimary);
	}

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: space-around;
		width: 30px;
		height: 30px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 101;
	}

	.bar {
		width: 30px;
		height: 2px;
		background-color: var(--text-color);
		transition: all 0.3s ease-in-out;
		border-radius: 2px;
	}

	.hamburger.open .bar:nth-child(1) {
		transform: translateY(10px) rotate(45deg);
	}

	.hamburger.open .bar:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open .bar:nth-child(3) {
		transform: translateY(-10px) rotate(-45deg);
	}

	.nav-links {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
		gap: 2rem;
	}

	@media (max-width: 760px) {
		header {
			padding: 10px 5%;
		}

		.hamburger {
			display: flex;
		}

		.mainNav {
			display: flex;
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: white !important;
			transform: translateX(100%);
			transition: transform 0.3s ease-in-out;
			z-index: 100;
			padding: 0;
			margin: 0;
		}

		.nav-links {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			gap: 2rem;
		}

		.mainNav.open {
			transform: translateX(0);
		}

		.mainNav a {
			font-size: 1.5rem;
		}
	}
</style>
