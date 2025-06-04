<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    const loadingMessageOptions = [
        "Loading... ",
        "Analyzing message...",
        "Generating response...",
    ];

    let index = 0;
    let currentMessage = "";

    onMount(() => {
        currentMessage = loadingMessageOptions[index];

        let LoadingMessageInterval = setInterval(() => {
            if (index < loadingMessageOptions.length - 1) {
                index += 1;
            }
            currentMessage = loadingMessageOptions[index];
        }, 2500);

        //Remove interval when component is destroyed
        return () => clearInterval(LoadingMessageInterval);
    });
</script>

<div class="grid">
    {#key currentMessage}
        <p
            class="loading"
            in:fade={{ delay: 500, duration: 500 }}
            out:fade={{ duration: 400 }}
        >
            {currentMessage}
        </p>
    {/key}
</div>

<style>
    .grid {
        display: grid;
        place-items: center;
    }

    p {
        grid-area: 1/1;
    }
</style>
