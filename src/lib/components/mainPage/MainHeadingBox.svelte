<div class="header">
    <h1>We care about <span class="highlightYou">you</span>.</h1>
</div>
<div class="getStarted">
    <div class="left">
        We know how it feels to be in a bad place mentally, thats why we provide
        a mental health companion to help completely free of charge.
    </div>
    <div class="right">
        <a href="/chat">Start a conversation > </a>
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: center;
        margin: 2rem 0rem;
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

    h1 {
        font-size: 6rem;
        font-weight: 400;
    }

    .getStarted {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        max-width: 800px;
        gap: 2rem;
    }

    .left {
        font-size: 1.4rem;
        font-weight: 300;
        text-align: right;
        max-width: 350px;
        text-align: center;
    }

    .right {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    a { 
        text-decoration: none;
        color: var(--text-color);
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        font-size: 1.2rem;
        font-weight: 500;
        background-color: var(--AccentColorPrimary);
        filter: drop-shadow(rgb(130, 130, 130) 0.4rem 0.5rem 8px);
        transition: all 0.25s;
    }

    a:hover {
        filter: drop-shadow(rgb(119, 130, 137) 0.2rem 0.3rem 4px);
    }

    @media (max-width: 600px) {
        .getStarted {
            align-items: center;
            justify-content: center;
        }

        .left {
            text-align: center;
        }

        h1 {
            font-size: 3rem;
        }
    }
</style>
