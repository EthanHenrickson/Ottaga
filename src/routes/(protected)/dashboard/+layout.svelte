<script lang="ts">
	import type { UserSettingsDTO } from '$lib/DTOs/UserSettings.js';
	import { setUserSettings } from '$lib/stores/userSettings.svelte.js';
	import { onMount } from 'svelte';
	let { data, children } = $props();

	onMount(() => {
		const userPreferences = JSON.parse(data.preferences) as UserSettingsDTO;
		setUserSettings(userPreferences);
	});
</script>

{@render children()}
