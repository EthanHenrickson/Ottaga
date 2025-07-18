<script lang="ts">
    import { fade, fly } from "svelte/transition";

    let dataJson = {
        "Session Memory":
            "Experience personalized support with our AI that remembers important details from your conversations while maintaining complete privacy. Your chat history helps provide more meaningful responses, but all data is fully anonymized with no connection to your real identity. Must be signed in. Users may also opt out if they would prefer.",
        "Stress and anxiety management":
            "Learn practical coping strategies drawn from cognitive behavioral therapy and positive psychology. Get real-time support in managing stress, anxiety, and overwhelming emotions with techniques like breathing exercises, grounding methods, and structured reflection activities.",
        "Emotional support during difficult times":
            "Experience empathy and validation when you need it most. Our AI companion helps you process difficult emotions, explore underlying patterns, and build resilience while celebrating your progress and framing challenges as opportunities for growth.",
        "Guided relaxation and mindfulness exercises":
            "Access a variety of mindfulness and relaxation techniques to help calm your mind and reduce stress. Practice evidence-based exercises that can help you stay grounded, improve focus, and develop better emotional awareness in your daily life.",
    };

    let dataJsonKeys = Object.keys(dataJson);
    let selectedKey: keyof typeof dataJson =
        dataJsonKeys[0] as keyof typeof dataJson;

    // Generate unique IDs for accessibility
    const tabIds = dataJsonKeys.map((_, i) => `tab-${i}`);
    const panelId = "help-panel";
</script>

<section class="content" aria-label="How Ottaga Can Help">
    <h2>How Ottaga Can Help</h2>
    <div class="informationBox" role="tablist" aria-label="Help categories">
        <div class="keyBlock">
            {#each dataJsonKeys as key, i}
                <button
                    role="tab"
                    id={tabIds[i]}
                    aria-controls={panelId}
                    aria-selected={selectedKey === key}
                    class:active={selectedKey === key}
                    on:click={() =>
                        (selectedKey = key as keyof typeof dataJson)}
                    on:keydown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            selectedKey = key as keyof typeof dataJson;
                        }
                    }}
                >
                    {key}
                    {#if selectedKey == key}
                        &#11208;
                    {/if}
                </button>
            {/each}
        </div>
        <div
            class="valueBlock"
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabIds[dataJsonKeys.indexOf(selectedKey)]}
            tabindex="0"
        >
            {#key selectedKey}
                <div>
                    {dataJson[selectedKey]}
                </div>
            {/key}
        </div>
    </div>
</section>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 4rem 0rem;
        margin: 2rem 0rem;
    }

    .informationBox {
        display: flex;
        flex-direction: row;
        max-width: 900px;
        align-items: center;
        height: 15rem;
        padding: 0rem 1rem;
    }

    h2 {
        font-size: 2.5rem;
        margin-bottom: 2.5rem;
        font-weight: 400;
    }

    .keyBlock {
        display: flex;
        flex-direction: column;
        width: 45%;
    }

    .valueBlock {
        padding: 2rem;
        width: 45%;
        font-size: 1.1rem;
        line-height: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow-x: hidden;
    }

    button {
        outline: none;
        background: var(--AccentColorSecondary);
        cursor: pointer;
        border: none;
        border-bottom: 1px solid black;
        text-align: right;
        font-size: 1.1rem;
        padding: 1.1rem;
        color: black;
        transition: background-color 0.2s;
    }

    button[aria-selected="true"] {
        box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
        background: var(--AccentColorPrimary);
        color: white;
    }

    @media (max-width: 600px) {
        h2 {
            font-size: 2rem;
        }

        .informationBox {
            height: 30rem;
        }

        button {
            font-size: 1rem;
        }

        .valueBlock {
            font-size: 1rem;
            padding: 1rem;
        }
    }
</style>
