import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';

export const load = async () => {
	if (browser && !dev) {
		posthog.init('phc_JwfdqBC9yuWRv3yj15gqwvfYrARzy3epM4Kmr4PjWJQ', {
			api_host: 'https://us.i.posthog.com',
			capture_pageview: false,
			capture_pageleave: false,
			person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
		});
	}
	return;
};
