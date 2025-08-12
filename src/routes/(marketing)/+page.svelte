<script lang="ts">
	import Footer from '$lib/client/components/marketing/mainPage/Footer.svelte';
	import FounderMessage from '$lib/client/components/marketing/mainPage/FounderMessage.svelte';
	import InformationCards from '$lib/client/components/marketing/mainPage/InformationCards.svelte';
	import InformationSelectBox from '$lib/client/components/marketing/mainPage/InformationSelectBox.svelte';
	import MainHeadingBox from '$lib/client/components/marketing/mainPage/MainHeadingBox.svelte';
</script>

<svelte:head>
	<title>Ottaga | Home</title>

	<meta
		name="description"
		content="Discover Ottaga: Learn about its innovative features, benefits, and how it can transform your experience. Explore what sets Ottaga apart and why it's the perfect solution for your needs."
	/>
	<meta name="keywords" content="Ottaga, benefits, features, description" />
	<meta charset="UTF-8" />
</svelte:head>

<div class="content">
	<MainHeadingBox />
	<InformationCards />
	<FounderMessage />
	<InformationSelectBox />
	<Footer />
</div>
