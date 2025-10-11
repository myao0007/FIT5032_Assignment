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
                    <h1 class="podcast-title">Soul Sisters Radio</h1>
                    <p class="podcast-producer">SHE Originals</p>

                    <div class="podcast-meta">
                        <span class="rating">⭐ {{ averageRating.toFixed(1) }} ({{ totalRatings }})</span>
                        <span class="category">SISTERHOOD</span>
                        <span class="series">WEEKLY SERIES</span>
                    </div>

                    <p class="podcast-description">
                        Celebrating the power of sisterhood and authentic connections. Join us as we explore stories of
                        friendship,
                        courage, and the beautiful journey of women supporting women through life's challenges and
                        triumphs.
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

            <!-- Episodes Table Section -->
            <div class="episodes-section">
                <!-- Header with title and search -->
                <div class="episodes-header">
                    <h2 class="episodes-title">Episodes</h2>
                    <div class="controls-box">
                        <div class="search-box">
                            <div class="search-input-wrapper">
                                <i class="pi pi-search search-icon"></i>
                                <InputText v-model="searchText" placeholder="Search" class="search-input" />
                                <Button v-if="searchText" @click="clearSearch" icon="pi pi-times" severity="secondary"
                                    text size="small" class="clear-btn" />
                            </div>
                        </div>
                        <div class="sort-box">
                            <select v-model="sortBy" class="sort-select">
                                <option value="title">Sort by Title</option>
                                <option value="author">Sort by Author</option>
                                <option value="length">Sort by Length</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Episodes List -->
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

                <!-- Simple Pagination -->
                <div class="simple-pagination">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
                        &lt;
                    </button>
                    <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import episodesData from '@/data/soul-sisters-episodes.json'

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

// Episodes data and functionality
const episodes = ref([])
const searchText = ref('')
const sortBy = ref('title')
const currentPage = ref(1)
const itemsPerPage = 5

// Load episodes data
onMounted(() => {
    episodes.value = episodesData
})

// Filter and sort episodes
const filteredEpisodes = computed(() => {
    let filtered = episodes.value

    // Filter by search text
    if (searchText.value) {
        filtered = filtered.filter(episode =>
            episode.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
            episode.author.toLowerCase().includes(searchText.value.toLowerCase()) ||
            episode.summary.toLowerCase().includes(searchText.value.toLowerCase())
        )
    }

    // Sort episodes
    return filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'title':
                return a.title.localeCompare(b.title)
            case 'author':
                return a.author.localeCompare(b.author)
            case 'length':
                // Extract numbers from length strings (e.g., "43 min" -> 43)
                const aLength = parseInt(a.length)
                const bLength = parseInt(b.length)
                return aLength - bLength
            default:
                return 0
        }
    })
})

// Calculate total pages
const totalPages = computed(() => {
    return Math.ceil(filteredEpisodes.value.length / itemsPerPage)
})

// Get episodes for current page
const currentPageEpisodes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredEpisodes.value.slice(start, end)
})

// Clear search
const clearSearch = () => {
    searchText.value = ''
    currentPage.value = 1
}

// Go to specific page
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// Reset to page 1 when search changes
watch(searchText, () => {
    currentPage.value = 1
})
</script>

<style scoped>
.podcast-detail-root {
    --nav-h: 64px;
    min-height: calc(100vh - var(--nav-h));
    padding: 84px 24px 24px;
    background: white;
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
    background-image: url('/images/podcast-soul.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 32px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, .12);
    position: relative;
    overflow: hidden;
}

.podcast-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.05);
    z-index: 1;
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
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
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

/* Episodes Section */
.episodes-section {
    margin-top: 60px;
    padding: 0 20px;
}

/* Episodes Header */
.episodes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.episodes-title {
    font-size: 28px;
    font-weight: bold;
    color: #262c67;
    margin: 0;
}

.controls-box {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sort-box {
    display: flex;
    align-items: center;
}

.sort-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    color: #333;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.sort-select:focus {
    outline: none;
    border-color: #262c67;
    box-shadow: 0 0 0 2px rgba(38, 44, 103, 0.1);
}

.sort-select:hover {
    border-color: #262c67;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 300px;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: #666;
    font-size: 14px;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: border-color 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #262c67;
    box-shadow: 0 0 0 2px rgba(38, 44, 103, 0.1);
}

.clear-btn {
    position: absolute;
    right: 8px;
    padding: 4px;
    min-width: auto;
    width: 24px;
    height: 24px;
}

/* Episodes List Styles */
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

/* Simple Pagination */
.simple-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    padding: 16px 0;
}

.page-btn {
    background: white;
    border: 1px solid #ddd;
    color: #666;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
    background: #f0f0f0;
    color: #333;
    border-color: #ccc;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-info {
    color: #666;
    font-size: 14px;
    font-weight: 500;
}
</style>
