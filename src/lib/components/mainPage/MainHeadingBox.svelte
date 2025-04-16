<div class="content">
    <div class="header">
        <h1>We care about <span class="highlightYou">you</span>.</h1>
    </div>
    <div class="messaging">
        <p>Your digital mental health companion - always here, always free.</p>
    </div>
    <div class="getStarted">
        <a href="/chat" class="conversationButton">Start a conversation</a>
        <a href="/learn" class="learnButton">Learn More</a>
    </div>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 10rem 0rem;
        padding-top: 14rem;
        background: linear-gradient(
			to top,
			rgba(255, 255, 255, 0),
			rgba(188, 223, 245, 0.8)
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

    .header h1 {
        font-size: 6rem;
        font-weight: 400;
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
        filter: drop-shadow(rgb(130, 130, 130) 0.4rem 0.5rem 8px);
        transition: all 0.25s;
    }

    a:hover {
        filter: drop-shadow(rgb(119, 130, 137) 0.2rem 0.3rem 4px);
    }

    @media (max-width: 600px) {
        .content {
            padding: 6rem 0rem;
            padding-top: 14rem;
        }

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
