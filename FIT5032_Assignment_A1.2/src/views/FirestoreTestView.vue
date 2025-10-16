<template>
    <div class="firestore-test-page">
        <div class="container">
            <h1>Firestore Connection Test</h1>

            <div class="test-section">
                <h2>Connection Status</h2>
                <div class="status-card" :class="connectionStatus">
                    <i v-if="connectionStatus === 'checking'" class="fa-solid fa-spinner fa-spin"></i>
                    <i v-else-if="connectionStatus === 'connected'" class="fa-solid fa-check-circle"></i>
                    <i v-else-if="connectionStatus === 'failed'" class="fa-solid fa-exclamation-triangle"></i>
                    <span>{{ statusMessage }}</span>
                </div>
            </div>

            <div class="test-section">
                <h2>Test Operations</h2>
                <div class="test-buttons">
                    <button @click="runDiagnostic" :disabled="isRunning" class="test-btn">
                        <i class="fa-solid fa-stethoscope"></i>
                        Run Full Diagnostic
                    </button>
                    <button @click="testWrite" :disabled="isRunning" class="test-btn">
                        <i class="fa-solid fa-pen"></i>
                        Test Write
                    </button>
                    <button @click="testRead" :disabled="isRunning" class="test-btn">
                        <i class="fa-solid fa-eye"></i>
                        Test Read
                    </button>
                    <button @click="testBooking" :disabled="isRunning" class="test-btn">
                        <i class="fa-solid fa-calendar-check"></i>
                        Test Booking
                    </button>
                </div>
            </div>

            <div class="test-section" v-if="testResults.length > 0">
                <h2>Test Results</h2>
                <div class="results-container">
                    <div v-for="(result, index) in testResults" :key="index" class="result-item" :class="result.type">
                        <div class="result-header">
                            <i :class="result.icon"></i>
                            <span class="result-title">{{ result.title }}</span>
                            <span class="result-time">{{ result.time }}</span>
                        </div>
                        <div class="result-content">
                            <pre>{{ result.details }}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <div class="test-section">
                <h2>Environment Information</h2>
                <div class="env-info">
                    <div class="info-item">
                        <strong>Project ID:</strong> {{ projectId }}
                    </div>
                    <div class="info-item">
                        <strong>Database ID:</strong> {{ databaseId }}
                    </div>
                    <div class="info-item">
                        <strong>Environment:</strong> {{ environment }}
                    </div>
                    <div class="info-item">
                        <strong>Time:</strong> {{ currentTime }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import FirestoreDiagnostic from '@/services/firestoreDiagnostic.js'
import BookingService from '@/services/bookingService.js'

// Reactive data
const connectionStatus = ref('checking')
const statusMessage = ref('Checking connection...')
const isRunning = ref(false)
const testResults = ref([])
const projectId = ref('')
const databaseId = ref('')
const environment = ref('')
const currentTime = ref('')

// Add test result
const addTestResult = (title, type, details, icon) => {
    testResults.value.unshift({
        title,
        type,
        details: JSON.stringify(details, null, 2),
        icon,
        time: new Date().toLocaleTimeString()
    })
}

// Run full diagnostic
const runDiagnostic = async () => {
    isRunning.value = true
    addTestResult('Full Diagnostic', 'info', 'Starting full diagnostic...', 'fa-solid fa-stethoscope')

    try {
        const result = await FirestoreDiagnostic.runFullDiagnostic()
        addTestResult('Full Diagnostic', result.overall.success ? 'success' : 'error', result,
            result.overall.success ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle')

        if (result.overall.success) {
            connectionStatus.value = 'connected'
            statusMessage.value = '✅ Firestore connection normal'
        } else {
            connectionStatus.value = 'failed'
            statusMessage.value = '❌ Firestore connection failed'
        }
    } catch (error) {
        addTestResult('Full Diagnostic', 'error', { error: error.message, stack: error.stack }, 'fa-solid fa-times-circle')
        connectionStatus.value = 'failed'
        statusMessage.value = '❌ Error during diagnostic process'
    } finally {
        isRunning.value = false
    }
}

// Test write
const testWrite = async () => {
    isRunning.value = true
    addTestResult('Write Test', 'info', 'Starting write test...', 'fa-solid fa-pen')

    try {
        const result = await FirestoreDiagnostic.testBookingWrite()
        addTestResult('Write Test', result.success ? 'success' : 'error', result,
            result.success ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle')
    } catch (error) {
        addTestResult('Write Test', 'error', { error: error.message }, 'fa-solid fa-times-circle')
    } finally {
        isRunning.value = false
    }
}

// Test read
const testRead = async () => {
    isRunning.value = true
    addTestResult('Read Test', 'info', 'Starting read test...', 'fa-solid fa-eye')

    try {
        const { collection, getDocs } = await import('firebase/firestore')
        const querySnapshot = await getDocs(collection(db, 'bookings'))
        const bookings = []
        querySnapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() })
        })

        addTestResult('Read Test', 'success', {
            count: bookings.length,
            bookings: bookings.slice(0, 3) // Only show first 3
        }, 'fa-solid fa-check-circle')
    } catch (error) {
        addTestResult('Read Test', 'error', { error: error.message }, 'fa-solid fa-times-circle')
    } finally {
        isRunning.value = false
    }
}

// Test booking
const testBooking = async () => {
    isRunning.value = true
    addTestResult('Booking Test', 'info', 'Starting booking test...', 'fa-solid fa-calendar-check')

    try {
        const testBookingData = {
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
            notes: 'Test booking from diagnostic page',
            status: 'test'
        }

        const bookingId = await BookingService.createBooking(testBookingData)
        addTestResult('Booking Test', 'success', {
            bookingId,
            message: 'Booking created successfully'
        }, 'fa-solid fa-check-circle')

        // Clean up test data
        const { doc, deleteDoc } = await import('firebase/firestore')
        await deleteDoc(doc(db, 'bookings', bookingId))
        addTestResult('Cleanup Test', 'success', {
            message: 'Test data cleaned up'
        }, 'fa-solid fa-broom')

    } catch (error) {
        addTestResult('Booking Test', 'error', { error: error.message }, 'fa-solid fa-times-circle')
    } finally {
        isRunning.value = false
    }
}

// Initialize
onMounted(() => {
    projectId.value = db.app.options.projectId
    databaseId.value = db._databaseId.databaseId
    environment.value = 'Production'
    currentTime.value = new Date().toLocaleString()

    // Auto run diagnostic
    runDiagnostic()
})
</script>

<style scoped>
.firestore-test-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

h1 {
    color: white;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 40px;
    font-weight: 700;
}

.test-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
    color: #262c67;
    font-size: 1.5rem;
    margin-bottom: 20px;
    font-weight: 600;
}

.status-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.1rem;
}

.status-card.checking {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

.status-card.connected {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.status-card.failed {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.test-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.test-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #262c67;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.test-btn:hover:not(:disabled) {
    background: #1a1f4a;
    transform: translateY(-2px);
}

.test-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}

.results-container {
    max-height: 400px;
    overflow-y: auto;
}

.result-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
}

.result-item.success {
    border-color: #c3e6cb;
    background: #f8fff9;
}

.result-item.error {
    border-color: #f5c6cb;
    background: #fff8f8;
}

.result-item.info {
    border-color: #bee5eb;
    background: #f8feff;
}

.result-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.05);
    font-weight: 600;
}

.result-title {
    flex: 1;
}

.result-time {
    font-size: 0.8rem;
    opacity: 0.7;
}

.result-content {
    padding: 12px 16px;
}

.result-content pre {
    margin: 0;
    font-size: 0.9rem;
    white-space: pre-wrap;
    word-break: break-word;
}

.env-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}

.info-item {
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #262c67;
}

.info-item strong {
    color: #262c67;
}

@media (max-width: 768px) {
    .test-buttons {
        grid-template-columns: 1fr;
    }

    .env-info {
        grid-template-columns: 1fr;
    }
}
</style>
