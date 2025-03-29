<script lang="ts">
	import Footer from "$lib/components/Footer.svelte";
	import InformationSelectBox from "$lib/components/mainPage/InformationSelectBox.svelte";
	import MainHeadingBox from "$lib/components/mainPage/MainHeadingBox.svelte";
	import SecondaryInfoBox from "$lib/components/mainPage/SecondaryInfoBox.svelte";
</script>

<div class="content">
	<div class="mainHeadingBlock">
		<MainHeadingBox />
	</div>
	<div class="secondaryHeadingBlock">
		<SecondaryInfoBox />
	</div>

	<InformationSelectBox />
</div>
<Footer />

<style>
	.mainHeadingBlock {
		height: 65vh;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		padding-bottom: 10vh;
		background: linear-gradient(to bottom right, white, rgb(228, 240, 250));

		width: 100%;
		padding-left: 3%;
		padding-right: 3%;
	}

	.secondaryHeadingBlock {
		margin: 4rem auto;
		text-align: center;
		max-width: 900px;
	}
</style>
