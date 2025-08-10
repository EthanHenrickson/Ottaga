<script>
    import ToastMessage from "$lib/components/ToastMessage.svelte";
    import { Toast } from "$lib/stores/toastClient.svelte";

</script>

<div class="toastContainer">
    {#each Toast.values as Message (Message.id)}
        <ToastMessage id={Message.id} message={Message.message} type={Message.toastType}/>
    {/each}
</div>

<style>
    .toastContainer {
        position: absolute;
        top: 100px;
        right: 20px;

        display: flex;
        flex-direction: column;
        gap: 10px;

        z-index: 100;
    }
</style>