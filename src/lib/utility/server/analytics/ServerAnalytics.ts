import { PostHog } from 'posthog-node';
import { PUBLIC_POSTHOG_API_KEY } from '$env/static/public';

const PostHogAnalytics = new PostHog(PUBLIC_POSTHOG_API_KEY, {
	host: 'https://us.i.posthog.com',
	flushAt: 1,
	flushInterval: 0
});

export default PostHogAnalytics;
