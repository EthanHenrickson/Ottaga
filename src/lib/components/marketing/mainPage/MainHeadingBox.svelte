<script lang="ts">
    import { fly } from "svelte/transition";

</script>
<header class="content" aria-label="Main page header">
    <div class="header" role="heading" aria-level="1">
        <h1>We care about <span class="highlightYou" aria-hidden="true">you</span><span class="sr-only">you</span>.</h1>
    </div>
    <div class="messaging">
        <p>Your digital mental health companion - always here, always free.</p>
    </div>
    <div class="getStarted">
        <a href="/chat" class="conversationButton" role="button" aria-label="Start a conversation with Ottaga">Start a conversation</a>
        <a href="/learn" class="learnButton" role="button" aria-label="Learn more about Ottaga">Learn More</a>
    </div>
</header>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        height: 100vh;
        justify-content: center;
        background: linear-gradient(
			to bottom,
			var(--AccentColorSecondary),
			rgba(255, 255, 255, 0)
		);
    }

    .highlightYou {
        position: relative;
    }

    .highlightYou::before {
        content: "You";
        text-decoration: underline;
        text-decoration-color: var(--AccentColorPrimary);
        text-decoration-thickness: 3px;
        position: absolute;
        color: transparent;
        z-index: -1;
        transform: translateY(-8px);
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .header h1 {
        font-size: 6rem;
        font-weight: 300;
        margin: 0rem;
        text-align: center;
    }

    .messaging {
        display: block;
        max-width: 500px;
    }

    .messaging p {
        margin: 0px;
        font-weight: 300;
        font-size: 1.7rem;
        text-align: center;
    }

    .getStarted {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: row wrap;
        gap: 1rem;
    }

    .conversationButton {
        background-color: var(--AccentColorPrimary);
        color: white;
    }

    .learnButton {
        background-color: white;
        color: black;
    }

    a {
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1.2rem;
        font-weight: 500;
        filter: drop-shadow(rgb(151, 151, 151) 0.4rem 0.5rem 7px);
        transition: all 0.25s;
    }

    a:hover {
        filter: drop-shadow(rgb(139, 139, 139) 0.2rem 0.3rem 5px);
        transform: translateY(-3px);
    }

    @media (max-width: 600px) {
        .getStarted {
            align-items: center;
            justify-content: center;
        }

        .header h1 {
            font-size: 3rem;
        }

        .highlightYou::before {
            content: "You";
            text-decoration: underline;
            text-decoration-color: var(--AccentColorPrimary);
            text-decoration-thickness: 2px;
            position: absolute;
            color: transparent;
            z-index: -1;
            transform: translateY(-5px);
        }
    }
</style>
