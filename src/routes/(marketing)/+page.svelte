<script lang="ts">
	import MainHeadingBox from "$lib/components/mainPage/MainHeadingBox.svelte";
	import SecondaryInfoBox from "$lib/components/mainPage/SecondaryInfoBox.svelte";
	import InformationSelectBox from "$lib/components/mainPage/InformationSelectBox.svelte";
	import Footer from "$lib/components/mainPage/Footer.svelte";
</script>

<div class="content">
	<div class="mainHeadingBlock">
		<MainHeadingBox />
	</div>
	<div class="secondaryHeadingBlock">
		<SecondaryInfoBox />
	</div>
	<div class="thirdHeadingBlock">
		<InformationSelectBox />
	</div>
	<div class="footer">
		<Footer />
	</div>
</div>

<style>
	.mainHeadingBlock {
		height: 75vh;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		background: linear-gradient(
			to top,
			rgba(255, 255, 255, 0),
			rgba(210, 235, 250, 0.8)
		);

		width: 94%;
		padding-left: 3%;
		padding-right: 3%;
	}

	.secondaryHeadingBlock {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		height: 60vh;

		width: 94%;
		padding-left: 3%;
		padding-right: 3%;
	}

	.thirdHeadingBlock {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		height: 60vh;
		margin-left: auto;
		margin-right: auto;

		width: 94%;
		padding-left: 3%;
		padding-right: 3%;
		max-width: 900px;
	}

	.footer {
		margin: 3rem auto;
		margin-top: 5rem;
	}
</style>
