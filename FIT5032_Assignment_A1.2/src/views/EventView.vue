<template>
    <div class="event-root">
        <div class="container">
            <!-- Page Header -->
            <div class="page-header">
                <h1 class="page-title">Events</h1>
                <p class="page-subtitle">Join our healing circles and workshops</p>
            </div>

            <!-- Events List -->
            <div class="events-list">
                <div v-for="event in eventsData" :key="event.id" class="event-card">
                    <!-- Left: Visual Section -->
                    <div class="event-visual">
                        <div class="visual-background">
                            <div class="visual-overlay">
                                <div class="visual-text">
                                    <h2 class="visual-title">{{ event.title.split(' – ')[0] }}</h2>
                                    <p class="visual-subtitle">{{ event.title.split(' – ')[1] || 'Workshop' }}</p>
                                </div>
                            </div>
                            <div class="date-tag">
                                <span class="date-text">{{ event.date.split(', ')[0].split(' ')[0] }}</span>
                                <span class="date-number">{{ event.date.split(', ')[0].split(' ')[1] }}</span>
                                <div class="date-line"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Event Details -->
                    <div class="event-details">
                        <h3 class="event-title">{{ event.title }}</h3>

                        <div class="event-info">
                            <div class="info-item">
                                <span class="info-icon">🕒</span>
                                <span class="info-text">{{ event.time }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-icon">📍</span>
                                <span class="info-text">{{ event.location }}</span>
                            </div>
                        </div>

                        <div class="event-description">
                            <p>{{ event.description }}</p>
                        </div>

                        <div class="event-note">
                            <p><strong>Note:</strong> {{ event.note }}</p>
                        </div>

                        <button class="view-event-btn" @click="goToEventDetail(event.id)">
                            View Event →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import eventsData from '@/data/events-data.json'

const router = useRouter()

// Reactive data
const events = ref([])

// Load events data
onMounted(() => {
    events.value = eventsData
})

// Navigate to event detail page
const goToEventDetail = (eventId) => {
    router.push(`/event/${eventId}`)
}
</script>

<style scoped>
.event-root {
    --nav-h: 64px;
    padding-top: var(--nav-h);
    min-height: calc(100vh - var(--nav-h));
    background: #f8f9fa;
    font-family: 'Inter', sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

/* Page Header */
.page-header {
    text-align: center;
    margin-bottom: 60px;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #262c67;
    margin: 0 0 16px 0;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0;
}

/* Events List */
.events-list {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

/* Event Card */
.event-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    min-height: 400px;
}

/* Left: Visual Section */
.event-visual {
    flex: 0 0 45%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.visual-background {
    width: 100%;
    max-width: 400px;
    height: 400px;
    background: white;
    border-radius: 20px;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.visual-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 40px;
}

.visual-text {
    flex: 1;
}

.visual-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #262c67;
    margin: 0 0 8px 0;
    line-height: 1.2;
}

.visual-subtitle {
    font-size: 1.4rem;
    color: #666;
    margin: 0;
    font-weight: 300;
}


.date-tag {
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.date-text {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
}

.date-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    color: #262c67;
    margin-top: 4px;
}

.date-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #ddd;
    transform: translateY(-50%);
    z-index: 1;
}

/* Right: Event Details */
.event-details {
    flex: 1;
    padding: 40px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.event-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #262c67;
    margin: 0 0 20px 0;
    line-height: 1.3;
}

.event-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.info-icon {
    font-size: 1.2rem;
}

.info-text {
    font-size: 1rem;
    color: #333;
    font-weight: 500;
}

.event-description {
    margin-bottom: 20px;
}

.event-description p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    margin: 0;
}

.event-note {
    margin-bottom: 30px;
    padding: 16px;
    background: #fff3cd;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
}

.event-note p {
    font-size: 0.95rem;
    color: #856404;
    margin: 0;
    line-height: 1.5;
}

.view-event-btn {
    background: #262c67;
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    align-self: flex-start;
}

.view-event-btn:hover {
    background: #1a1f4a;
}

/* Responsive Design */
@media (max-width: 768px) {
    .event-card {
        flex-direction: column;
    }

    .event-visual {
        flex: none;
        height: 300px;
        padding: 15px;
    }

    .visual-background {
        height: 300px;
        max-width: 300px;
    }

    .visual-overlay {
        padding: 20px;
    }

    .visual-title {
        font-size: 1.8rem;
    }

    .visual-subtitle {
        font-size: 1.2rem;
    }

    .event-details {
        padding: 30px 20px;
    }

    .page-title {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 20px 15px;
    }

    .visual-title {
        font-size: 1.5rem;
    }

    .visual-subtitle {
        font-size: 1rem;
    }

    .event-details {
        padding: 20px 15px;
    }

    .event-title {
        font-size: 1.5rem;
    }
}
</style>
