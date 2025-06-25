import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { PUBLIC_POSTHOG_API_KEY } from '$env/static/public';

export const load = async () => {
	if (browser && !dev) {
		posthog.init(PUBLIC_POSTHOG_API_KEY, {
			api_host: 'https://us.i.posthog.com',
			capture_pageview: false,
			capture_pageleave: false,
			persistence: 'memory',
			person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
		});
	}
	return;
};
