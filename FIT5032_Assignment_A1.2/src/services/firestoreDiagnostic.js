// src/services/firestoreDiagnostic.js
import { db } from '@/firebase/config'
import { collection, addDoc, getDocs, doc, deleteDoc, connectFirestoreEmulator } from 'firebase/firestore'

/**
 * Firestore Diagnostic Service
 */
export class FirestoreDiagnostic {
    /**
     * Diagnose Firestore connection issues
     */
    static async diagnoseConnection() {
        console.log('🔍 Starting Firestore diagnostic...')
        
        const results = {
            connection: null,
            writeTest: null,
            readTest: null,
            cleanup: null,
            summary: null
        }
        
        try {
            // 1. Check connection status
            console.log('📡 Checking Firestore connection...')
            console.log('Project ID:', db.app.options.projectId)
            console.log('Database ID:', db._databaseId.databaseId)
            
            results.connection = {
                success: true,
                projectId: db.app.options.projectId,
                databaseId: db._databaseId.databaseId,
                message: 'Firestore instance created successfully'
            }
            
            // 2. Test write
            console.log('✍️ Testing write operation...')
            const testData = {
                diagnostic: true,
                timestamp: new Date(),
                test: 'write-operation',
                message: 'This is a diagnostic test document'
            }
            
            const docRef = await addDoc(collection(db, 'diagnostic'), testData)
            console.log('✅ Write test successful:', docRef.id)
            
            results.writeTest = {
                success: true,
                docId: docRef.id,
                message: 'Write operation successful'
            }
            
            // 3. Test read
            console.log('📖 Testing read operation...')
            const querySnapshot = await getDocs(collection(db, 'diagnostic'))
            console.log('✅ Read test successful:', querySnapshot.size, 'documents found')
            
            results.readTest = {
                success: true,
                documentCount: querySnapshot.size,
                message: 'Read operation successful'
            }
            
            // 4. Clean up test data
            console.log('🧹 Cleaning up test data...')
            await deleteDoc(doc(db, 'diagnostic', docRef.id))
            console.log('✅ Cleanup successful')
            
            results.cleanup = {
                success: true,
                message: 'Test data cleaned up successfully'
            }
            
            // 5. Summary
            results.summary = {
                success: true,
                message: '🎉 All Firestore operations working correctly!',
                environment: 'Production Firestore'
            }
            
        } catch (error) {
            console.error('❌ Diagnostic failed:', error)
            
            // Analyze error type
            let errorType = 'Unknown'
            let suggestion = 'Please check your internet connection and Firebase configuration'
            
            if (error.code === 'permission-denied') {
                errorType = 'Permission Denied'
                suggestion = 'Check Firestore security rules'
            } else if (error.code === 'unavailable') {
                errorType = 'Service Unavailable'
                suggestion = 'Check if you are connected to the internet'
            } else if (error.code === 'unauthenticated') {
                errorType = 'Authentication Required'
                suggestion = 'User needs to be authenticated'
            } else if (error.message.includes('emulator')) {
                errorType = 'Emulator Connection'
                suggestion = 'Make sure Firebase emulator is running'
            }
            
            results.summary = {
                success: false,
                error: error,
                errorType: errorType,
                suggestion: suggestion,
                message: `❌ Firestore diagnostic failed: ${error.message}`
            }
        }
        
        console.log('📊 Diagnostic results:', results)
        return results
    }
    
    /**
     * Test booking data write
     */
    static async testBookingWrite() {
        console.log('🎫 Testing booking data write...')
        
        try {
            const testBooking = {
                eventId: 999,
                eventTitle: 'Diagnostic Test Event',
                eventDate: '2025-01-01',
                eventTime: '10:00 AM',
                eventLocation: 'Test Location',
                attendeeInfo: {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '1234567890'
                },
                notes: 'This is a diagnostic test booking',
                status: 'test',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            const docRef = await addDoc(collection(db, 'bookings'), testBooking)
            console.log('✅ Booking write test successful:', docRef.id)
            
            // Clean up immediately
            await deleteDoc(doc(db, 'bookings', docRef.id))
            console.log('✅ Booking test data cleaned up')
            
            return {
                success: true,
                message: 'Booking data write test successful',
                docId: docRef.id
            }
            
        } catch (error) {
            console.error('❌ Booking write test failed:', error)
            return {
                success: false,
                error: error,
                message: `Booking write test failed: ${error.message}`
            }
        }
    }
    
    /**
     * Run full diagnostic
     */
    static async runFullDiagnostic() {
        console.log('🚀 Running full Firestore diagnostic...')
        
        const connectionResults = await this.diagnoseConnection()
        const bookingResults = await this.testBookingWrite()
        
        const fullResults = {
            connection: connectionResults,
            booking: bookingResults,
            overall: {
                success: connectionResults.summary?.success && bookingResults.success,
                message: connectionResults.summary?.success && bookingResults.success 
                    ? '🎉 All tests passed! Firestore is working correctly.'
                    : '❌ Some tests failed. Check the details above.'
            }
        }
        
        console.log('📋 Full diagnostic results:', fullResults)
        return fullResults
    }
}

export default FirestoreDiagnostic
