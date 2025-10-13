<template>
    <div class="event-detail-page" v-if="event">
        <div class="container">
            <!-- Back to Events Link and Download Button -->
            <div class="top-actions">
                <router-link to="/live" class="back-btn">
                    ← Back to All Events
                </router-link>
                <button @click="downloadPDF" class="download-btn" :disabled="isDownloading">
                    {{ isDownloading ? 'Generating...' : '📄 Download PDF' }}
                </button>
            </div>

            <!-- Event Title -->
            <h1 class="event-title">{{ event.title }}</h1>

            <!-- Event Details -->
            <div class="event-details">
                <div class="detail-item">
                    <span class="detail-icon">📅</span>
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">{{ formattedDate }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🕒</span>
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">{{ event.time }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">{{ event.location }}</span>
                </div>
            </div>

            <!-- About This Event Section -->
            <div class="about-section">
                <h2 class="section-title">About This Event</h2>
                <div class="about-content">
                    <p>Sometimes we spend so much energy caring for others that we forget to listen to ourselves.</p>
                    <p>This gentle evening is designed to help you <strong>reconnect with your inner voice</strong>,
                        rebuild self-trust, and rediscover what self-love truly means after emotional exhaustion or
                        heartbreak.</p>
                    <p>Through <strong>guided breathing</strong>, <strong>mindful writing</strong>, and <strong>small
                            group sharing</strong>, you'll be invited to pause, reflect, and meet yourself again — with
                        kindness.</p>
                    <p>You don't need to have any experience with meditation or journaling. All you need is an open
                        heart and the willingness to simply show up as you are.</p>
                </div>
            </div>

            <!-- What You'll Experience Section -->
            <div class="experience-section">
                <h2 class="section-title">What You'll Experience</h2>
                <div class="experience-content">
                    <div class="activity-item">
                        <div class="activity-number">1</div>
                        <div class="activity-content">
                            <h3 class="activity-title">Opening Meditation (10 min)</h3>
                            <p class="activity-description">Settle into the present moment with soft music and
                                candlelight. Feel your body relax as the facilitator guides you through a grounding
                                meditation.</p>
                        </div>
                    </div>

                    <div class="activity-item">
                        <div class="activity-number">2</div>
                        <div class="activity-content">
                            <h3 class="activity-title">Emotion Writing Practice (25 min)</h3>
                            <p class="activity-description">Explore your feelings through gentle prompts such as: "What
                                part of me needs understanding right now?" This reflective writing helps you identify
                                emotions that may have been overlooked.</p>
                        </div>
                    </div>

                    <div class="activity-item">
                        <div class="activity-number">3</div>
                        <div class="activity-content">
                            <h3 class="activity-title">Small Group Sharing (30 min)</h3>
                            <p class="activity-description">In a safe, women-only space, you'll have the chance to share
                                what came up for you — or simply listen to others' stories of healing and growth.</p>
                        </div>
                    </div>

                    <div class="activity-item">
                        <div class="activity-number">4</div>
                        <div class="activity-content">
                            <h3 class="activity-title">Tea & Closing Reflection (15 min)</h3>
                            <p class="activity-description">We'll end the evening with warm tea and a short closing
                                circle, giving thanks to yourself for taking this time to breathe and reconnect.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading or Error State -->
    <div v-else class="loading-state">
        <div class="container">
            <p>Loading event details...</p>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import eventsData from '@/data/events-data.json'
import jsPDF from 'jspdf'

export default {
    name: 'EventDetailView',
    setup() {
        const route = useRoute()
        const event = ref(null)
        const isDownloading = ref(false)

        const formattedDate = computed(() => {
            if (!event.value) return ''
            // Convert "Oct 23, 2025" to "Thursday, October 23, 2025"
            const dateStr = event.value.date
            const date = new Date(dateStr)
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        })

        // Simple PDF download function
        const downloadPDF = () => {
            if (!event.value) return

            isDownloading.value = true

            try {
                // Create PDF
                const doc = new jsPDF()

                // Set font size
                doc.setFontSize(20)
                doc.text(event.value.title, 20, 30)

                // Add event details
                doc.setFontSize(12)
                doc.text(`Date: ${formattedDate.value}`, 20, 50)
                doc.text(`Time: ${event.value.time}`, 20, 60)
                doc.text(`Location: ${event.value.location}`, 20, 70)

                // Add description
                doc.text('About This Event:', 20, 90)
                doc.setFontSize(10)
                const splitDescription = doc.splitTextToSize(event.value.description, 170)
                doc.text(splitDescription, 20, 100)

                // Add activities
                doc.setFontSize(12)
                doc.text('What You\'ll Experience:', 20, 130)
                doc.setFontSize(10)

                // Activities list
                const activities = [
                    '1. Opening Meditation (10 min)',
                    '2. Emotion Writing Practice (25 min)',
                    '3. Small Group Sharing (30 min)',
                    '4. Tea & Closing Reflection (15 min)'
                ]

                let yPos = 140
                activities.forEach(activity => {
                    doc.text(activity, 20, yPos)
                    yPos += 10
                })

                // Add notes
                doc.setFontSize(12)
                doc.text('Note:', 20, yPos + 10)
                doc.setFontSize(10)
                doc.text(event.value.note, 20, yPos + 20)

                // Generate filename
                const fileName = `Event_${event.value.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`

                // Download PDF
                doc.save(fileName)

                alert('PDF downloaded successfully!')
            } catch (error) {
                console.error('Download failed:', error)
                alert('Download failed, please try again later.')
            } finally {
                isDownloading.value = false
            }
        }

        onMounted(() => {
            const eventId = parseInt(route.params.id)
            const foundEvent = eventsData.find(e => e.id === eventId)
            if (foundEvent) {
                event.value = foundEvent
            }
        })

        return {
            event,
            formattedDate,
            isDownloading,
            downloadPDF
        }
    }
}
</script>

<style scoped>
.event-detail-page {
    min-height: 100vh;
    background: white;
    padding: 40px 0;
    --nav-h: 64px;
    padding-top: calc(var(--nav-h) + 40px);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Top Actions */
.top-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.back-btn {
    color: #4a4a4a;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.back-btn:hover {
    color: #666666;
}

.download-btn {
    background: #2c3e50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    font-size: 0.95rem;
}

.download-btn:hover:not(:disabled) {
    background: #34495e;
}

.download-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}

/* Event Title */
.event-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 30px 0;
    line-height: 1.2;
}

/* Event Details */
.event-details {
    margin-bottom: 40px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 1rem;
    line-height: 1.5;
    color: #4a4a4a;
}

.detail-item:last-child {
    margin-bottom: 0;
}

.detail-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
}

.detail-label {
    color: #2c3e50;
    font-weight: 600;
    flex-shrink: 0;
}

.detail-value {
    color: #4a4a4a;
}

/* Section Titles */
.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 20px;
}

/* About Section */
.about-section {
    margin-bottom: 40px;
}

.about-content p {
    font-size: 1rem;
    line-height: 1.6;
    color: #4a4a4a;
    margin-bottom: 16px;
}

.about-content p:last-child {
    margin-bottom: 0;
}

.about-content strong {
    color: #2c3e50;
    font-weight: 600;
}

/* Experience Section */
.experience-section {
    margin-bottom: 40px;
}

.experience-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.activity-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.activity-number {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: #ffb6c1;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 8px 0;
}

.activity-description {
    font-size: 1rem;
    line-height: 1.6;
    color: #4a4a4a;
    margin: 0;
}

/* Loading State */
.loading-state {
    min-height: 100vh;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    --nav-h: 64px;
    padding-top: var(--nav-h);
}

.loading-state p {
    font-size: 1.1rem;
    color: #666666;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }

    .event-title {
        font-size: 2rem;
        white-space: normal;
        overflow-x: visible;
    }

    .section-title {
        font-size: 1.3rem;
    }

    .activity-item {
        gap: 12px;
    }

    .activity-number {
        width: 28px;
        height: 28px;
        font-size: 0.8rem;
    }
}
</style>
