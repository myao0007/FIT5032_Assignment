<template>
    <div class="simple-calendar">
        <div class="event-display">
            <div class="event-card" v-if="event">
                <div class="event-date">
                    <div class="date-day">{{ getEventDay() }}</div>
                    <div class="date-month">{{ getEventMonth() }}</div>
                </div>

                <div class="event-info">
                    <h4 class="event-title">{{ event.title }}</h4>
                    <div class="event-details">
                        <div class="detail-item">
                            <i class="fa-solid fa-clock"></i>
                            <span>{{ event.time }}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fa-solid fa-map-marker-alt"></i>
                            <span>{{ event.location }}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fa-solid fa-users"></i>
                            <span>Capacity: {{ event.capacity || 20 }} people</span>
                        </div>
                    </div>
                </div>

            </div>

            <div v-else class="no-event">
                <i class="fa-solid fa-calendar-xmark"></i>
                <p>No event selected</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    event: {
        type: Object,
        default: null
    }
})

// Get event date
const getEventDay = () => {
    if (!props.event?.date) return '--'
    const date = new Date(props.event.date)
    return date.getDate()
}

// Get event month
const getEventMonth = () => {
    if (!props.event?.date) return '---'
    const date = new Date(props.event.date)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[date.getMonth()]
}
</script>

<style scoped>
.simple-calendar {
    margin-bottom: 30px;
}

.event-display {
    margin-bottom: 0;
}

.event-card {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3), 0 4px 16px rgba(118, 75, 162, 0.2);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    max-width: 800px;
    margin: 0 auto;
}

.event-card:hover {
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4), 0 6px 20px rgba(118, 75, 162, 0.3);
    transform: translateY(-2px);
}

.event-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
}

.event-date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 12px 16px;
    margin-right: 20px;
    min-width: 60px;
}

.date-day {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1;
}

.date-month {
    font-size: 0.8rem;
    font-weight: 500;
    opacity: 0.9;
}

.event-info {
    flex: 1;
}

.event-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    line-height: 1.3;
}

.event-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    opacity: 0.9;
}

.detail-item i {
    width: 14px;
    text-align: center;
}


.no-event {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.no-event i {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.5;
}

.no-event p {
    font-size: 1.1rem;
    margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
    .event-card {
        flex-direction: column;
        text-align: center;
    }

    .event-date {
        margin-right: 0;
        margin-bottom: 16px;
    }

    .event-details {
        align-items: center;
    }

    .detail-item {
        justify-content: center;
    }
}
</style>
