// src/services/bookingService.js
import { db } from '@/firebase/config'
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

/**
 * Booking Service - Handle event booking related operations
 */
export class BookingService {
    /**
     * Create new booking
     * @param {Object} bookingData - Booking data
     * @returns {Promise<string>} - Booking ID
     */
    static async createBooking(bookingData) {
        try {
            const docRef = await addDoc(collection(db, 'bookings'), {
                ...bookingData,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            return docRef.id
        } catch (error) {
            console.error('Error creating booking:', error)
            throw new Error('Failed to create booking')
        }
    }

    /**
     * Check if user has already booked an event
     * @param {string} eventId - Event ID
     * @param {string} email - User email
     * @returns {Promise<boolean>} - Whether already booked
     */
    static async hasUserBookedEvent(eventId, email) {
        try {
            const q = query(
                collection(db, 'bookings'),
                where('eventId', '==', parseInt(eventId)),
                where('attendeeInfo.email', '==', email),
                where('status', '==', 'confirmed')
            )
            const querySnapshot = await getDocs(q)
            return !querySnapshot.empty
        } catch (error) {
            console.error('Error checking booking status:', error)
            return false
        }
    }

    /**
     * Get all bookings for an event
     * @param {string} eventId - Event ID
     * @returns {Promise<Array>} - Booking list
     */
    static async getEventBookings(eventId) {
        try {
            const q = query(
                collection(db, 'bookings'),
                where('eventId', '==', parseInt(eventId)),
                where('status', '==', 'confirmed'),
                orderBy('createdAt', 'desc')
            )
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error fetching event bookings:', error)
            return []
        }
    }

    /**
     * Get user's booking history
     * @param {string} email - User email
     * @returns {Promise<Array>} - Booking history
     */
    static async getUserBookings(email) {
        try {
            const q = query(
                collection(db, 'bookings'),
                where('attendeeInfo.email', '==', email),
                orderBy('createdAt', 'desc'),
                limit(50)
            )
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error fetching user bookings:', error)
            return []
        }
    }

    /**
     * Check event capacity
     * @param {string} eventId - Event ID
     * @param {number} maxCapacity - Maximum capacity
     * @returns {Promise<Object>} - Capacity information
     */
    static async checkEventCapacity(eventId, maxCapacity = 20) {
        try {
            const bookings = await this.getEventBookings(eventId)
            const currentBookings = bookings.length
            const isAvailable = currentBookings < maxCapacity
            const remainingSpots = Math.max(0, maxCapacity - currentBookings)

            return {
                currentBookings,
                maxCapacity,
                isAvailable,
                remainingSpots
            }
        } catch (error) {
            console.error('Error checking event capacity:', error)
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
}

export default BookingService

