<template>
    <div class="booking-success-page">
        <div class="container">
            <div class="success-card">
                <div class="success-icon">
                    <i class="fa-solid fa-check-circle"></i>
                </div>

                <h1 class="success-title">Booking Confirmed!</h1>

                <p class="success-message">
                    Your booking has been successfully confirmed. You will receive a confirmation email shortly.
                </p>

                <div class="booking-details" v-if="bookingData">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">{{ bookingData.id }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Event:</span>
                        <span class="detail-value">{{ bookingData.eventTitle }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">{{ formattedDate }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">{{ bookingData.eventTime }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">{{ bookingData.eventLocation }}</span>
                    </div>
                </div>

                <div class="action-buttons">
                    <router-link to="/live" class="btn btn-primary">
                        <i class="fa-solid fa-calendar"></i>
                        View All Events
                    </router-link>
                    <router-link to="/home" class="btn btn-secondary">
                        <i class="fa-solid fa-home"></i>
                        Go Home
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const bookingData = ref(null)

const formattedDate = computed(() => {
    if (!bookingData.value?.eventDate) return ''
    const date = new Date(bookingData.value.eventDate)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

onMounted(() => {
    // Get booking data from route parameters or local storage
    const bookingId = route.query.bookingId
    if (bookingId) {
        // Here we can get booking details from Firestore
        console.log('Booking ID:', bookingId)
    }
})
</script>

<style scoped>
.booking-success-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    max-width: 600px;
    width: 100%;
}

.success-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
}

.success-icon {
    margin-bottom: 24px;
}

.success-icon i {
    font-size: 4rem;
    color: #28a745;
    animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-10px);
    }

    60% {
        transform: translateY(-5px);
    }
}

.success-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #262c67;
    margin: 0 0 16px 0;
}

.success-message {
    font-size: 1.2rem;
    color: #666;
    margin: 0 0 32px 0;
    line-height: 1.6;
}

.booking-details {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    margin: 32px 0;
    text-align: left;
}

.booking-details h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #262c67;
    margin: 0 0 20px 0;
    text-align: center;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    font-weight: 600;
    color: #666;
}

.detail-value {
    color: #333;
    font-weight: 500;
}

.action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 32px;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: linear-gradient(135deg, #262c67, #3b4a8a);
    color: white;
    box-shadow: 0 4px 16px rgba(38, 44, 103, 0.3);
}

.btn-primary:hover {
    background: linear-gradient(135deg, #1a1f4a, #2c3a6b);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(38, 44, 103, 0.4);
}

.btn-secondary {
    background: #f8f9fa;
    color: #666;
    border: 2px solid #e9ecef;
}

.btn-secondary:hover {
    background: #e9ecef;
    color: #333;
}

/* Responsive */
@media (max-width: 768px) {
    .success-card {
        padding: 30px 20px;
    }

    .success-title {
        font-size: 2rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
