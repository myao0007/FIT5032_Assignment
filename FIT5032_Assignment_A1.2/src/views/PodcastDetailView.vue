<template>
    <div class="podcast-detail-root">
        <div class="container">
            <div class="detail-layout">
                <!-- Left: Card -->
                <div class="card-section">
                    <div class="podcast-card"></div>
                </div>

                <!-- Right: Info -->
                <div class="info-section">
                    <h1 class="podcast-title">Echoes of Her Heart</h1>
                    <p class="podcast-producer">SHE Originals</p>

                    <div class="podcast-meta">
                        <span class="rating">⭐ {{ averageRating.toFixed(1) }} ({{ totalRatings }})</span>
                        <span class="category">EMOTIONS</span>
                        <span class="series">WEEKLY SERIES</span>

                    </div>

                    <p class="podcast-description">
                        Whispers from women around the world — sharing late-night confessions, untold love stories, and
                        heartfelt reflections. A safe space for voices that deserve to be heard.
                    </p>

                    <!-- Rating Section -->
                    <div class="rating-section">
                        <h3>Rate this podcast:</h3>
                        <div class="stars" @click="handleStarClick">
                            <span v-for="i in 5" :key="i" :class="['star', { active: i <= userRating }]"
                                :data-rating="i">
                                ⭐
                            </span>
                        </div>
                        <p class="rating-info">
                            Your rating: {{ userRating }}/5
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Simple rating system with real calculation
const userRating = ref(0)
const allRatings = ref([]) // Start from 0, no initial ratings

// Calculate real average rating
const averageRating = computed(() => {
    if (allRatings.value.length === 0) return 0
    const sum = allRatings.value.reduce((total, rating) => total + rating, 0)
    return sum / allRatings.value.length
})

// Total number of ratings
const totalRatings = computed(() => allRatings.value.length)

const handleStarClick = (event) => {
    const rating = parseInt(event.target.dataset.rating)
    if (rating) {
        userRating.value = rating
        // Add user rating to ratings list
        allRatings.value.push(rating)
        console.log('User rated:', rating, 'New average:', averageRating.value.toFixed(1))
    }
}
</script>

<style scoped>
.podcast-detail-root {
    --nav-h: 64px;
    min-height: calc(100vh - var(--nav-h));
    padding: 84px 24px 24px;
    background: linear-gradient(135deg, #ffd8e6, #ffb6c1);
}

.container {
    max-width: 1000px;
    margin: 0 auto;
}

.detail-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 40px;
    align-items: start;
}

.card-section {
    display: flex;
    justify-content: center;
}

.podcast-card {
    width: 280px;
    height: 280px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, .12);
}

.info-section {
    padding-top: 20px;
}

.podcast-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #262c67;
    margin: 0 0 8px 0;
}

.podcast-producer {
    /* color: #666; */
    font-size: 1.1rem;
    margin: 0 0 16px 0;
}

.podcast-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.rating,
.category,
.series {
    /* background: #f0f0f0; */
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #333;
}

.age-rating {
    /* background: #ddd; */
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: #333;
}

.podcast-description {
    color: #333;
    line-height: 1.6;
    margin-bottom: 32px;
    font-size: 1rem;
}

/* Rating Section */
.rating-section {
    margin-top: 32px;
}

.rating-section h3 {
    margin: 0 0 16px 0;
    color: #262c67;
    font-size: 1.2rem;
}

.stars {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.star {
    font-size: 2rem;
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 0.2s;
}

.star.active {
    opacity: 1;
}

.star:hover {
    opacity: 0.8;
}

.rating-info {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
}
</style>
