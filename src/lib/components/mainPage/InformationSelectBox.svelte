<script lang="ts">
    let dataJson = {
        "Session Memory >": "Experience personalized support with our AI that remembers important details from your conversations while maintaining complete privacy. Your chat history helps provide more meaningful responses, but all data is fully anonymized with no connection to your real identity. Must be signed in. Users may also opt out if they would prefer.",
        "Stress and anxiety management >": "Learn practical coping strategies drawn from cognitive behavioral therapy and positive psychology. Get real-time support in managing stress, anxiety, and overwhelming emotions with techniques like breathing exercises, grounding methods, and structured reflection activities.",
        "Emotional support during difficult times >": "Experience empathy and validation when you need it most. Our AI companion helps you process difficult emotions, explore underlying patterns, and build resilience while celebrating your progress and framing challenges as opportunities for growth.",
        "Guided relaxation and mindfulness exercises >": "Access a variety of mindfulness and relaxation techniques to help calm your mind and reduce stress. Practice evidence-based exercises that can help you stay grounded, improve focus, and develop better emotional awareness in your daily life.",
    };

    let dataJsonKeys = Object.keys(dataJson);

    let selectedKey: keyof typeof dataJson =
        dataJsonKeys[0] as keyof typeof dataJson;
</script>

<h2>How Ottaga Can Help</h2>
<div class="informationBox">
    <div class="keyBlock">
        {#each dataJsonKeys as key}
            <button
                class:active={selectedKey == key}
                onclick={() => (selectedKey = key as keyof typeof dataJson)}
            >
                {key}
            </button>
        {/each}
    </div>
    <div class="valueBlock">
        {dataJson[selectedKey]}
    </div>
</div>

<style>
    .informationBox {
        display: flex;
        flex-direction: row;
        max-width: 1200px;
        width: 100%;
    }

    h2 {
        font-size: 2.5rem;
        margin-bottom: 2.5rem;
        font-weight: 400;
    }

    .keyBlock {
        display: flex;
        flex-direction: column;
        width: 50%;
    }

    .valueBlock {
        padding: 2rem;
        width: 50%;
        font-size: 1.2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    button {
        outline: none;
        background: rgba(202, 233, 252, 0.8);
        cursor: pointer;
        border: none;
        border-bottom: 1px solid black;

        text-align: right;
        font-size: 1.1rem;
        padding: 1.1rem;
    }

    .active {
        box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
    }
</style>
