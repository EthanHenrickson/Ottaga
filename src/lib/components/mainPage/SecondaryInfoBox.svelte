<script>
    import Clock from "$lib/icons/clock.svelte";
    import CutCreditCard from "$lib/icons/cutCreditCard.svelte";
    import Lock from "$lib/icons/lock.svelte";
</script>

<div class="content">
    <h2>What Makes Ottaga Special?</h2>
    <div class="features">
        <div class="feature">
            <Clock />
            <h3>Always Available</h3>
            <p>24/7 Support, no matter the time.</p>
        </div>
        <div class="feature">
            <Lock />
            <h3>Private & Secure</h3>
            <p>You control all your data.</p>
        </div>
        <div class="feature">
            <CutCreditCard />
            <h3>Completely Free</h3>
            <p>We will always be free for everyone</p>
        </div>
    </div>
</div>

<style>
    .content {
        width: 100%;
        margin: 5rem 0rem;
    }

    h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        font-weight: 400;
        text-align: center;
    }

    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin: 2rem auto;
        width: 100%;
        max-width: 900px;
    }

    .feature {
        padding: 1.5rem;
        border-radius: 1rem;
        background-color: white;
        box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
        text-align: center;
    }

    .feature h3 {
        color: black;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        font-size: 1.6rem;
        font-weight: 500;
    }

    .feature p {
        font-size: 1.1rem;
        line-height: 1.5;
        font-weight: 300;
    }

    @media (max-width: 600px) {
        .feature {
            margin: 0px 1rem;
        }
    }
</style>
