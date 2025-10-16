// src/services/firestoreTest.js
import { db } from '@/firebase/config'
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'

/**
 * Firestore Connection Test Service
 */
export class FirestoreTest {
    /**
     * Test Firestore connection
     * @returns {Promise<Object>} Test result
     */
    static async testConnection() {
        try {
            console.log('Testing Firestore connection...')
            
            // Test write permission
            const testData = {
                test: true,
                timestamp: new Date(),
                message: 'Firestore connection test'
            }
            
            const docRef = await addDoc(collection(db, 'test'), testData)
            console.log('✅ Firestore write test successful:', docRef.id)
            
            // Test read permission
            const querySnapshot = await getDocs(collection(db, 'test'))
            console.log('✅ Firestore read test successful:', querySnapshot.size, 'documents')
            
            // Clean up test data
            await deleteDoc(doc(db, 'test', docRef.id))
            console.log('✅ Firestore delete test successful')
            
            return {
                success: true,
                message: 'Firestore connection is working perfectly!',
                testDocId: docRef.id
            }
            
        } catch (error) {
            console.error('❌ Firestore test failed:', error)
            return {
                success: false,
                message: `Firestore test failed: ${error.message}`,
                error: error
            }
        }
    }
    
    /**
     * Test bookings collection read/write permissions
     * @returns {Promise<Object>} Test result
     */
    static async testBookingsCollection() {
        try {
            console.log('Testing bookings collection...')
            
            // Test write booking data
            const testBooking = {
                eventId: 999,
                eventTitle: 'Test Event',
                eventDate: '2025-01-01',
                eventTime: '10:00 AM',
                eventLocation: 'Test Location',
                attendeeInfo: {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '1234567890'
                },
                notes: 'This is a test booking',
                status: 'test',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            const docRef = await addDoc(collection(db, 'bookings'), testBooking)
            console.log('✅ Bookings collection write test successful:', docRef.id)
            
            // Test read booking data
            const querySnapshot = await getDocs(collection(db, 'bookings'))
            console.log('✅ Bookings collection read test successful:', querySnapshot.size, 'bookings')
            
            // Clean up test data
            await deleteDoc(doc(db, 'bookings', docRef.id))
            console.log('✅ Bookings collection delete test successful')
            
            return {
                success: true,
                message: 'Bookings collection is working perfectly!',
                testBookingId: docRef.id
            }
            
        } catch (error) {
            console.error('❌ Bookings collection test failed:', error)
            return {
                success: false,
                message: `Bookings collection test failed: ${error.message}`,
                error: error
            }
        }
    }
    
    /**
     * Run complete Firestore test
     * @returns {Promise<Object>} Complete test result
     */
    static async runFullTest() {
        console.log('🚀 Starting full Firestore test...')
        
        const connectionTest = await this.testConnection()
        const bookingsTest = await this.testBookingsCollection()
        
        const allTestsPassed = connectionTest.success && bookingsTest.success
        
        const result = {
            success: allTestsPassed,
            connectionTest,
            bookingsTest,
            message: allTestsPassed 
                ? '🎉 All Firestore tests passed! Ready for production use.'
                : '❌ Some Firestore tests failed. Check the details above.'
        }
        
        console.log('📊 Full test result:', result)
        return result
    }
}

export default FirestoreTest

