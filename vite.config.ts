import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		maxConcurrency: 8,
		testTimeout: 30000,
		include: ['src/**/*.test.{js,ts}'],
		exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
		cache: false
	}
});
