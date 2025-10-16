<template>
    <!-- Episodes List (Card Layout) -->
    <div class="episodes-list">
        <div v-for="episode in currentPageEpisodes" :key="episode.title" class="episode-card">
            <div class="episode-header">
                <h3 class="episode-title">{{ episode.title }}</h3>
                <span class="episode-duration">{{ episode.length }}</span>
            </div>
            <p class="episode-author">By {{ episode.author }}</p>
            <p class="episode-summary">{{ episode.summary }}</p>
        </div>
    </div>
</template>

<script setup>
// This component expects the following props:
// - currentPageEpisodes: Array of episode objects
defineProps({
    currentPageEpisodes: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
/* Episodes List Styles (Card Layout) */
.episodes-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.episode-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    transition: box-shadow 0.2s ease;
}

.episode-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.episode-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.episode-title {
    font-size: 20px;
    font-weight: 600;
    color: #262c67;
    margin: 0;
    flex: 1;
    line-height: 1.3;
}

.episode-duration {
    background: #f0f0f0;
    color: #666;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    margin-left: 16px;
}

.episode-author {
    color: #888;
    font-size: 14px;
    margin: 0 0 16px 0;
    font-style: italic;
}

.episode-summary {
    color: #555;
    line-height: 1.6;
    margin: 0;
    font-size: 15px;
}
</style>
