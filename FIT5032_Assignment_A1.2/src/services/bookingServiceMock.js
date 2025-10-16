// src/services/bookingServiceMock.js
// Mock booking service - for testing, no Firestore dependency

/**
 * Mock booking service - for testing booking functionality
 */
export class BookingServiceMock {
    static bookings = [] // Store booking data in memory

    /**
     * Create new booking (mock)
     * @param {Object} bookingData - Booking data
     * @returns {Promise<string>} - Booking ID
     */
    static async createBooking(bookingData) {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            const booking = {
                id: bookingId,
                ...bookingData,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            this.bookings.push(booking)
            console.log('Mock booking created:', booking)
            return bookingId
        } catch (error) {
            console.error('Error creating mock booking:', error)
            throw new Error('Failed to create booking')
        }
    }

    /**
     * Check if user has already booked an event (mock)
     * @param {string} eventId - Event ID
     * @param {string} email - User email
     * @returns {Promise<boolean>} - Whether already booked
     */
    static async hasUserBookedEvent(eventId, email) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const hasBooked = this.bookings.some(booking => 
                booking.eventId === parseInt(eventId) && 
                booking.attendeeInfo.email === email &&
                booking.status === 'confirmed'
            )
            
            console.log('Mock booking check:', { eventId, email, hasBooked })
            return hasBooked
        } catch (error) {
            console.error('Error checking mock booking status:', error)
            return false
        }
    }

    /**
     * Get all bookings for an event (mock)
     * @param {string} eventId - Event ID
     * @returns {Promise<Array>} - Booking list
     */
    static async getEventBookings(eventId) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const eventBookings = this.bookings.filter(booking => 
                booking.eventId === parseInt(eventId) && 
                booking.status === 'confirmed'
            )
            
            console.log('Mock event bookings:', eventBookings)
            return eventBookings
        } catch (error) {
            console.error('Error fetching mock event bookings:', error)
            return []
        }
    }

    /**
     * Check event capacity (mock)
     * @param {string} eventId - Event ID
     * @param {number} maxCapacity - Maximum capacity
     * @returns {Promise<Object>} - Capacity information
     */
    static async checkEventCapacity(eventId, maxCapacity = 20) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const bookings = await this.getEventBookings(eventId)
            const currentBookings = bookings.length
            const isAvailable = currentBookings < maxCapacity
            const remainingSpots = Math.max(0, maxCapacity - currentBookings)

            const capacityInfo = {
                currentBookings,
                maxCapacity,
                isAvailable,
                remainingSpots
            }
            
            console.log('Mock capacity check:', capacityInfo)
            return capacityInfo
        } catch (error) {
            console.error('Error checking mock event capacity:', error)
            return {
                currentBookings: 0,
                maxCapacity,
                isAvailable: true,
                remainingSpots: maxCapacity
            }
        }
    }

    /**
     * Validate booking data
     * @param {Object} bookingData - Booking data
     * @returns {Object} - Validation result
     */
    static validateBookingData(bookingData) {
        const errors = []

        if (!bookingData.eventId) {
            errors.push('Event ID is required')
        }

        if (!bookingData.attendeeInfo?.name?.trim()) {
            errors.push('Name is required')
        }

        if (!bookingData.attendeeInfo?.email?.trim()) {
            errors.push('Email is required')
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(bookingData.attendeeInfo.email)) {
                errors.push('Invalid email format')
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Get all bookings (for debugging)
     * @returns {Array} - All bookings
     */
    static getAllBookings() {
        return this.bookings
    }

    /**
     * Clear all bookings (for testing)
     */
    static clearAllBookings() {
        this.bookings = []
        console.log('All mock bookings cleared')
    }
}

export default BookingServiceMock

