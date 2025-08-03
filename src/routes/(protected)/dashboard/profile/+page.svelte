<script lang="ts">
	import { getUserSettings, setUserSettings } from '$lib/stores/userSettings.svelte';

	let userSettings = getUserSettings();

	async function saveUserSettings() {
		setUserSettings(userSettings);
		await fetch('/api/userSettings', {
			method: 'POST',
			body: JSON.stringify(userSettings),
			headers: {
				'content-type': 'application/json'
			}
		});
	}
</script>

<div class="content">
	<div class="profile">
		<h2>Settings</h2>
		<div class="section">
			<h3>Preferences</h3>
			<div class="dropdown setting">
				<label for="theme">Color Theme</label>
				<select name="" id="theme" bind:value={userSettings.theme}>
					<option value="Dark">Dark</option>
					<option value="Light">Light</option>
				</select>
			</div>
			<div class="checkbox setting">
				<label for="digest">Receive Community Digest (Email)</label>
				<input
					type="checkbox"
					name=""
					id="digest"
					bind:checked={userSettings.receiveCommunityDigest}
				/>
			</div>
		</div>
		<div class="section">
			<h3>Accessibility</h3>
			<div class="checkbox setting">
				<label for="simplifiedLanguage">Use Simplified Language</label>
				<input
					type="checkbox"
					name=""
					id="simplifiedLanguage"
					bind:checked={userSettings.simplifiedLanguage}
				/>
			</div>
			<div class="checkbox setting">
				<label for="reducedMotion">Use Reduced Motion</label>
				<input
					type="checkbox"
					name=""
					id="reducedMotion"
					bind:checked={userSettings.reduceMotion}
				/>
			</div>
		</div>
		<div class="section">
			<h3>Privacy</h3>
			<div class="checkbox setting">
				<label for="saveConversations">Save Conversations</label>
				<input
					type="checkbox"
					name=""
					id="saveConversations"
					bind:checked={userSettings.saveConversations}
				/>
			</div>
		</div>
		<div class="section save">
			<button onclick={saveUserSettings}>Save</button>
		</div>
	</div>
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100%;
		padding-top: 4rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.profile {
		max-width: 600px;
		width: 100%;
		height: 90vh;
		overflow-y: auto;
		padding: 0rem 3rem;

		border-left: 1px solid;
		border-right: 1px solid;
		border-image: linear-gradient(
				to bottom,
				transparent 0%,
				var(--AccentColorPrimary) 10%,
				var(--AccentColorPrimary) 80%,
				transparent 90%
			)
			1 100%;
	}

	.setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem;
	}

	.save {
		display: flex;
		justify-content: end;
		width: 100%;
		padding-top: 5rem;
	}

	@media (width < 800px) {
		.profile {
			padding: 0rem 0.5rem;
		}
	}
</style>
