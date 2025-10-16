<template>
    <div class="booking-page" v-if="event">
        <div class="container">
            <!-- Back to Event Link -->
            <div class="top-actions">
                <router-link :to="`/event/${eventId}`" class="back-btn">
                    ← Back to Event
                </router-link>
            </div>

            <!-- Page Title -->
            <h1 class="page-title">Book This Event</h1>

            <!-- Simple Event Calendar (No API) -->
            <SimpleEventCalendar :event="event" />


            <!-- Booking Form -->
            <div class="booking-form-section">
                <h3 class="form-title">Your Information</h3>
                <form @submit.prevent="handleBooking" class="booking-form">
                    <div class="form-group">
                        <label for="name" class="form-label">Full Name <span class="required-asterisk">*</span></label>
                        <input type="text" id="name" v-model="form.name" class="form-input"
                            placeholder="Enter your full name" required />
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Email Address <span
                                class="required-asterisk">*</span></label>
                        <input type="email" id="email" v-model="form.email" class="form-input"
                            placeholder="Enter your email address" required />
                    </div>

                    <div class="form-group">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" id="phone" v-model="form.phone" class="form-input"
                            placeholder="Enter your phone number (optional)" />
                    </div>

                    <div class="form-group">
                        <label for="notes" class="form-label">Special Requirements</label>
                        <textarea id="notes" v-model="form.notes" class="form-textarea"
                            placeholder="Any special requirements or notes (optional)" rows="3"></textarea>
                    </div>

                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="form.agreeTerms" required />
                            <span class="checkbox-text">
                                I agree to the <a href="#" class="terms-link">Terms and Conditions</a>
                            </span>
                        </label>
                    </div>

                    <div class="form-actions">
                        <button type="button" @click="goBack" class="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" class="confirm-btn" :disabled="isSubmitting">
                            <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                            {{ isSubmitting ? 'Processing...' : 'Confirm Booking' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
        <div class="container">
            <div class="loading-spinner">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <p>Loading event details...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import eventsData from '@/data/events-data.json'
import BookingService from '@/services/bookingService.js'
import FirestoreDiagnostic from '@/services/firestoreDiagnostic.js'
import SimpleEventCalendar from '@/components/SimpleEventCalendar.vue'

const route = useRoute()
const router = useRouter()

// Reactive data
const event = ref(null)
const eventId = ref(null)
const isSubmitting = ref(false)

// Force using Firestore service
const ensureFirestoreConnection = async () => {
    try {
        console.log('🔍 Running Firestore diagnostic...')
        const diagnosticResult = await FirestoreDiagnostic.runFullDiagnostic()

        if (diagnosticResult.overall.success) {
            console.log('✅ Firestore is ready for booking operations')
            return true
        } else {
            console.error('❌ Firestore diagnostic failed:', diagnosticResult.overall.message)

            // Display detailed error information
            if (diagnosticResult.connection?.summary?.error) {
                const error = diagnosticResult.connection.summary.error
                console.error('Error details:', {
                    code: error.code,
                    message: error.message,
                    type: diagnosticResult.connection.summary.errorType,
                    suggestion: diagnosticResult.connection.summary.suggestion
                })
            }

            throw new Error(`Firestore connection failed: ${diagnosticResult.overall.message}`)
        }
    } catch (error) {
        console.error('❌ Firestore connection error:', error)
        throw error
    }
}

// Form data
const form = ref({
    name: '',
    email: '',
    phone: '',
    notes: '',
    agreeTerms: false
})

// Computed properties - removed formattedDate as event details card was removed

// Methods
const loadEvent = () => {
    eventId.value = parseInt(route.params.id)
    const foundEvent = eventsData.find(e => e.id === eventId.value)
    if (foundEvent) {
        event.value = foundEvent
    } else {
        // Event not found, redirect to events page
        router.push('/live')
    }
}

const handleBooking = async () => {
    if (!form.value.agreeTerms) {
        alert('Please agree to the Terms and Conditions')
        return
    }

    isSubmitting.value = true

    try {
        // Ensure Firestore connection is normal
        await ensureFirestoreConnection()

        // Prepare booking data
        const bookingData = {
            eventId: eventId.value,
            eventTitle: event.value.title,
            eventDate: event.value.date,
            eventTime: event.value.time,
            eventLocation: event.value.location,
            attendeeInfo: {
                name: form.value.name.trim(),
                email: form.value.email.trim(),
                phone: form.value.phone.trim()
            },
            notes: form.value.notes.trim(),
            status: 'confirmed'
        }

        // Validate data
        const validation = BookingService.validateBookingData(bookingData)
        if (!validation.isValid) {
            alert('Please fix the following errors:\n' + validation.errors.join('\n'))
            return
        }

        // Check if user has already booked this event
        const hasBooked = await BookingService.hasUserBookedEvent(eventId.value, form.value.email.trim())
        if (hasBooked) {
            alert('You have already booked this event!')
            return
        }

        // Check event capacity
        const capacityInfo = await BookingService.checkEventCapacity(eventId.value, 20)
        if (!capacityInfo.isAvailable) {
            alert('Sorry, this event is fully booked!')
            return
        }

        // Create booking in Firestore
        const bookingId = await BookingService.createBooking(bookingData)
        console.log('✅ Booking created in Firestore with ID:', bookingId)

        // Show success message
        alert(`🎉 Booking confirmed! Your booking ID is: ${bookingId}\n📧 You will receive a confirmation email shortly.\n💾 Data saved to Firestore for future use.`)

        // Redirect to events page
        router.push('/live')

    } catch (error) {
        console.error('❌ Booking error:', error)
        if (error.message.includes('Firestore')) {
            alert('❌ Firestore connection failed. Please check your internet connection and try again.\n\nError: ' + error.message)
        } else {
            alert('Sorry, there was an error processing your booking. Please try again.\n\nError: ' + error.message)
        }
    } finally {
        isSubmitting.value = false
    }
}

// Removed handleEventClick function as simple calendar doesn't need event click handling

const goBack = () => {
    router.push(`/event/${eventId.value}`)
}

// Lifecycle
onMounted(() => {
    loadEvent()
})
</script>

<style scoped>
.booking-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 104px 0 40px 0;
    /* Increase top margin to avoid being covered by fixed navigation bar */
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Top Actions */
.top-actions {
    margin-bottom: 30px;
}

.back-btn {
    color: #2c3e50;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s ease;
}

.back-btn:hover {
    color: #1a252f;
}

/* Page Title */
.page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2c3e50;
    margin: 0 0 40px 0;
    text-align: center;
}


/* Booking Form Section */
.booking-form-section {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
}

.form-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 30px 0;
    text-align: center;
}

.booking-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-weight: 600;
    color: #333;
    font-size: 1rem;
}

.required-asterisk {
    color: #dc3545;
    font-weight: 700;
}

.form-input,
.form-textarea {
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
    font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #262c67;
    box-shadow: 0 0 0 3px rgba(38, 44, 103, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.checkbox-group {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
    margin: 0;
    margin-top: 2px;
}

.checkbox-text {
    color: #666;
}

.terms-link {
    color: #262c67;
    text-decoration: none;
    font-weight: 600;
}

.terms-link:hover {
    text-decoration: underline;
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 20px;
}

.cancel-btn,
.confirm-btn {
    padding: 14px 28px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.cancel-btn {
    background: #f8f9fa;
    color: #666;
    border: 2px solid #e9ecef;
}

.cancel-btn:hover {
    background: #e9ecef;
    color: #333;
}

.confirm-btn {
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: white;
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.3);
}

.confirm-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #1a252f, #2c3e50);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(44, 62, 80, 0.4);
}

.confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Loading State */
.loading-state {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    text-align: center;
    color: #666;
}

.loading-spinner i {
    font-size: 2rem;
    margin-bottom: 16px;
    color: #262c67;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 16px;
    }

    .page-title {
        font-size: 2rem;
    }

    .booking-form-section {
        padding: 20px;
    }

    .form-actions {
        flex-direction: column;
    }

    .cancel-btn,
    .confirm-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
