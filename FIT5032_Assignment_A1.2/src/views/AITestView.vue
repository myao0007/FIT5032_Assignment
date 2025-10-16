<template>
    <div class="ai-test-page">
        <div class="container">
            <h1 class="page-title">AI Features Test</h1>
            <p class="page-subtitle">Test all Gemini AI features in one place</p>

            <!-- API Status -->
            <div class="status-section">
                <h2>API Status</h2>
                <div class="status-card" :class="apiStatus.class">
                    <i :class="apiStatus.icon"></i>
                    <span>{{ apiStatus.message }}</span>
                </div>
            </div>

            <!-- Test Sections -->
            <div class="test-sections">
                <!-- Podcast Recommendations Test -->
                <div class="test-section">
                    <h3>Podcast Recommendations</h3>
                    <div class="test-content">
                        <input v-model="testInterest" placeholder="Enter your interest (e.g., 'I feel stressed')"
                            class="test-input" />
                        <button @click="testPodcastRecommendations" :disabled="isLoading" class="test-btn">
                            {{ isLoading ? 'Testing...' : 'Test Recommendations' }}
                        </button>
                        <div v-if="podcastResult" class="test-result">
                            <h4>Result:</h4>
                            <div class="result-content" v-html="formatText(podcastResult)"></div>
                        </div>
                    </div>
                </div>

                <!-- TreeHole Response Test -->
                <div class="test-section">
                    <h3>TreeHole Response</h3>
                    <div class="test-content">
                        <textarea v-model="testThought" placeholder="Enter a thought (e.g., 'I feel lonely today')"
                            class="test-textarea" rows="3"></textarea>
                        <button @click="testTreeHoleResponse" :disabled="isLoading" class="test-btn">
                            {{ isLoading ? 'Testing...' : 'Test Response' }}
                        </button>
                        <div v-if="treeHoleResult" class="test-result">
                            <h4>Result:</h4>
                            <div class="result-content" v-html="formatText(treeHoleResult)"></div>
                        </div>
                    </div>
                </div>

                <!-- Wellness Tips Test -->
                <div class="test-section">
                    <h3>Wellness Tips</h3>
                    <div class="test-content">
                        <input v-model="testTopic" placeholder="Enter topic (e.g., 'stress', 'self-care')"
                            class="test-input" />
                        <button @click="testWellnessTips" :disabled="isLoading" class="test-btn">
                            {{ isLoading ? 'Testing...' : 'Test Tips' }}
                        </button>
                        <div v-if="wellnessResult" class="test-result">
                            <h4>Result:</h4>
                            <div class="result-content" v-html="formatText(wellnessResult)"></div>
                        </div>
                    </div>
                </div>

                <!-- General Content Test -->
                <div class="test-section">
                    <h3>General Content Generation</h3>
                    <div class="test-content">
                        <textarea v-model="testPrompt" placeholder="Enter any prompt" class="test-textarea"
                            rows="3"></textarea>
                        <button @click="testGeneralContent" :disabled="isLoading" class="test-btn">
                            {{ isLoading ? 'Testing...' : 'Test Generation' }}
                        </button>
                        <div v-if="generalResult" class="test-result">
                            <h4>Result:</h4>
                            <div class="result-content" v-html="formatText(generalResult)"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <button @click="runAllTests" :disabled="isLoading" class="action-btn primary">
                    <i class="fa-solid fa-play"></i>
                    Run All Tests
                </button>
                <button @click="clearAllResults" class="action-btn secondary">
                    <i class="fa-solid fa-trash"></i>
                    Clear Results
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GeminiService } from '@/services/geminiService'

// Reactive data
const apiStatus = ref({
    class: 'checking',
    icon: 'fa-solid fa-spinner fa-spin',
    message: 'Checking API status...'
})

const isLoading = ref(false)
const testInterest = ref('I feel stressed about work')
const testThought = ref('I feel lonely and disconnected from others')
const testTopic = ref('stress management')
const testPrompt = ref('Write a motivational message for women')

const podcastResult = ref('')
const treeHoleResult = ref('')
const wellnessResult = ref('')
const generalResult = ref('')

// Initialize and check API status
onMounted(() => {
    checkAPIStatus()
})

const checkAPIStatus = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!apiKey) {
        apiStatus.value = {
            class: 'error',
            icon: 'fa-solid fa-exclamation-triangle',
            message: 'API key not configured'
        }
        return
    }

    const initialized = GeminiService.initialize(apiKey)

    if (initialized) {
        apiStatus.value = {
            class: 'success',
            icon: 'fa-solid fa-check-circle',
            message: 'API ready and connected'
        }
    } else {
        apiStatus.value = {
            class: 'error',
            icon: 'fa-solid fa-times-circle',
            message: 'Failed to initialize API'
        }
    }
}

// Test functions
const testPodcastRecommendations = async () => {
    if (!testInterest.value.trim()) return

    isLoading.value = true
    podcastResult.value = ''

    try {
        const result = await GeminiService.generatePodcastRecommendations(testInterest.value)
        podcastResult.value = result
    } catch (error) {
        podcastResult.value = `Error: ${error.message}`
    } finally {
        isLoading.value = false
    }
}

const testTreeHoleResponse = async () => {
    if (!testThought.value.trim()) return

    isLoading.value = true
    treeHoleResult.value = ''

    try {
        const result = await GeminiService.generateTreeHoleResponse(testThought.value)
        treeHoleResult.value = result
    } catch (error) {
        treeHoleResult.value = `Error: ${error.message}`
    } finally {
        isLoading.value = false
    }
}

const testWellnessTips = async () => {
    if (!testTopic.value.trim()) return

    isLoading.value = true
    wellnessResult.value = ''

    try {
        const result = await GeminiService.generateWellnessTips(testTopic.value)
        wellnessResult.value = result
    } catch (error) {
        wellnessResult.value = `Error: ${error.message}`
    } finally {
        isLoading.value = false
    }
}

const testGeneralContent = async () => {
    if (!testPrompt.value.trim()) return

    isLoading.value = true
    generalResult.value = ''

    try {
        const result = await GeminiService.generateContent(testPrompt.value)
        generalResult.value = result
    } catch (error) {
        generalResult.value = `Error: ${error.message}`
    } finally {
        isLoading.value = false
    }
}

const runAllTests = async () => {
    await testPodcastRecommendations()
    await testTreeHoleResponse()
    await testWellnessTips()
    await testGeneralContent()
}

const clearAllResults = () => {
    podcastResult.value = ''
    treeHoleResult.value = ''
    wellnessResult.value = ''
    generalResult.value = ''
}

const formatText = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.ai-test-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 100px 20px 40px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2c3e50;
    margin: 0 0 8px 0;
    text-align: center;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 40px 0;
    text-align: center;
}

.status-section {
    margin-bottom: 40px;
}

.status-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
}

.status-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-radius: 8px;
    font-weight: 600;
}

.status-card.checking {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

.status-card.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.status-card.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.test-sections {
    display: grid;
    gap: 24px;
    margin-bottom: 40px;
}

.test-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-section h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
}

.test-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.test-input,
.test-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s ease;
}

.test-input:focus,
.test-textarea:focus {
    border-color: #667eea;
}

.test-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    align-self: flex-start;
}

.test-btn:hover:not(:disabled) {
    background: #5a6fd8;
}

.test-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.test-result {
    margin-top: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.test-result h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.result-content {
    font-size: 14px;
    line-height: 1.6;
    color: #555;
}

.quick-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.action-btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.action-btn.primary {
    background: #667eea;
    color: white;
}

.action-btn.primary:hover:not(:disabled) {
    background: #5a6fd8;
    transform: translateY(-1px);
}

.action-btn.secondary {
    background: #6c757d;
    color: white;
}

.action-btn.secondary:hover {
    background: #5a6268;
}

.action-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}

/* Responsive design */
@media (max-width: 768px) {
    .ai-test-page {
        padding: 80px 10px 20px;
    }

    .page-title {
        font-size: 2rem;
    }

    .test-section {
        padding: 16px;
    }

    .quick-actions {
        flex-direction: column;
    }
}
</style>
