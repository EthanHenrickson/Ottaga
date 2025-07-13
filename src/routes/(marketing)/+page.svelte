<script lang="ts">
	import MainHeadingBox from "$lib/components/marketing/mainPage/MainHeadingBox.svelte";
	import SecondaryInfoBox from "$lib/components/marketing/mainPage/SecondaryInfoBox.svelte";
	import InformationSelectBox from "$lib/components/marketing/mainPage/InformationSelectBox.svelte";
	import Footer from "$lib/components/marketing/mainPage/Footer.svelte";
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
	<SecondaryInfoBox />
	<InformationSelectBox />
	<Footer />
</div>
