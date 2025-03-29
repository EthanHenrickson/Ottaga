<script lang="ts">
    let dataJson = {
        "Manage sessions >": "test1",
        "Stress and anxiety management >": "test2",
        "Emotional support during difficult times >": "test3",
        "Guided relaxation and mindfulness exercises >": "test4",
        "Resources for professional mental health services >": "test5",
    };

    let dataJsonKeys = Object.keys(dataJson);

    let selectedKey: keyof typeof dataJson =
        dataJsonKeys[0] as keyof typeof dataJson;
</script>

<div class="content">
    <h2>How Alanda Can Help</h2>
    <div class="informationBox">
        <div class="keyBlock">
            {#each dataJsonKeys as key}
                <button
                    class="bar"
                    class:active={selectedKey == key}
                    onclick={() => (selectedKey = key as keyof typeof dataJson)}
                >
                    <p>{key}</p>
                </button>
            {/each}
        </div>
        <div class="valueBlock">
            {dataJson[selectedKey]}
        </div>
    </div>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
    }

    .informationBox {
        display: flex;
        flex-direction: row;
    }

    .keyBlock {
        display: flex;
        flex-direction: column;
        width: 40%;
    }

    .valueBlock {
        padding: 1rem;
    }

    button {
        outline: none;
        background: none;
        border: 1px solid rgb(75, 75, 75);
        cursor: pointer;
        text-align: right;
        font-size: 1.1rem;
    }

    .active {
        background-color: rgb(226, 226, 226);
        box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
    }
</style>
