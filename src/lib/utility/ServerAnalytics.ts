import { PostHog } from "posthog-node";

const Analytics = new PostHog('phc_JwfdqBC9yuWRv3yj15gqwvfYrARzy3epM4Kmr4PjWJQ', { host: 'https://us.i.posthog.com', flushAt: 1, flushInterval: 0 });

export default Analytics