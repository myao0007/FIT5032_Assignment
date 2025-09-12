<template>
    <div class="podcasts-root">
        <div class="container">
            <!-- Featured Section -->
            <section class="featured-section">
                <h2 class="section-title">Top Podcasts</h2>
                <div class="featured-grid">

                    <div class="featured-item" @click="$router.push('/podcast/1')">
                        <div class="featured-card"></div>
                        <h3 class="featured-title">Echoes of Her Heart</h3>
                    </div>
                    <div class="featured-item" @click="$router.push('/podcast/2')">
                        <div class="featured-card"></div>
                        <h3 class="featured-title">Soul Sisters Radio</h3>
                    </div>
                    <div class="featured-item" @click="$router.push('/podcast/3')">
                        <div class="featured-card"></div>
                        <h3 class="featured-title">Bloom Beyond Silence</h3>
                    </div>
                </div>
            </section>

            <!-- Regular Podcasts Grid -->
            <section class="podcasts-section">
                <h2 class="section-title">All Podcasts</h2>
                <div class="podcasts-grid">
                    <div v-for="(podcast, i) in podcasts" :key="i" class="podcast-item">
                        <div class="podcast-card"></div>
                        <h4 class="podcast-title">{{ podcast.title }}</h4>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>


const podcasts = [
    { title: "Midnight Heart Talks" },
    { title: "Her Growth Diary" },
    { title: "Us in Love" },
    { title: "Voices of Healing" },
    { title: "Bestie's Chatroom" },
    { title: "She Speaks: To Be Continued" },
    { title: "Whispers of Self-Love" },
    { title: "Letters She Never Sent" },
    { title: "The Silent Struggles" },
    { title: "Bloom in Your Own Time" }
];
</script>

<style scoped>
.podcasts-root {
    --nav-h: 64px;
    min-height: calc(100vh - var(--nav-h));
    padding: 84px 24px 24px;
    background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    color: #262c67;
    font-weight: 800;
    font-size: 1.8rem;
    margin-bottom: 24px;
    text-align: left;
}

/* Featured Section */
.featured-section {
    margin-bottom: 48px;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
}

.featured-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.featured-card {
    width: 100%;
    height: 200px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, .12);
    margin-bottom: 16px;
}

.featured-title {
    color: #262c67;
    font-weight: 700;
    font-size: 1.2rem;
    text-align: center;
    margin: 0;
}

/* Regular Podcasts Section */
.podcasts-section {
    margin-bottom: 32px;
}

.podcasts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.podcast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.podcast-card {
    width: 100%;
    height: 120px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, .08);
    margin-bottom: 12px;
}

.podcast-title {
    color: #262c67;
    font-weight: 600;
    font-size: 1rem;
    text-align: center;
    margin: 0;
    line-height: 1.3;
}
</style>