<template>
    <div class="ai-podcast-recommendations">
        <div class="recommendations-header">
            <h3>
                <i class="fa-solid fa-robot"></i>
                AI Podcast Recommendations
            </h3>
            <p>Get personalized podcast recommendations based on your interests</p>
        </div>

        <div class="recommendations-content">
            <!-- Interest Input -->
            <div class="interest-input-section">
                <div class="input-group">
                    <label for="userInterest">What are you interested in or how are you feeling today?</label>
                    <textarea v-model="userInterest" id="userInterest"
                        placeholder="e.g., I'm feeling stressed about work, I want to learn about relationships, I need motivation..."
                        class="interest-textarea" rows="3"></textarea>
                </div>

                <button @click="generateRecommendations" :disabled="!userInterest.trim() || isGenerating"
                    class="generate-btn">
                    <i v-if="isGenerating" class="fa-solid fa-spinner fa-spin"></i>
                    <i v-else class="fa-solid fa-magic"></i>
                    {{ isGenerating ? 'Generating...' : 'Get Recommendations' }}
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="isGenerating" class="loading-state">
                <div class="loading-spinner">
                    <i class="fa-solid fa-robot fa-spin"></i>
                </div>
                <p>Analyzing your interests and finding perfect podcast matches...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
                <div class="error-icon">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                </div>
                <p>{{ error }}</p>
                <button @click="generateRecommendations" class="retry-btn">
                    <i class="fa-solid fa-redo"></i>
                    Try Again
                </button>
            </div>

            <!-- AI Recommendations -->
            <div v-else-if="recommendations" class="recommendations-result">
                <div class="result-header">
                    <h4>Your Personalized Recommendations</h4>
                    <button @click="copyRecommendations" class="copy-btn">
                        <i class="fa-solid fa-copy"></i>
                        Copy
                    </button>
                </div>

                <div class="recommendations-text" v-html="formatRecommendations(recommendations)"></div>

                <div class="result-actions">
                    <button @click="generateNewRecommendations" class="action-btn">
                        <i class="fa-solid fa-refresh"></i>
                        Get New Recommendations
                    </button>
                    <button @click="clearAll" class="action-btn secondary">
                        <i class="fa-solid fa-trash"></i>
                        Clear
                    </button>
                </div>
            </div>

            <!-- Initial State -->
            <div v-else class="initial-state">
                <div class="initial-icon">
                    <i class="fa-solid fa-headphones"></i>
                </div>
                <p>Tell us what you're interested in and we'll recommend the perfect podcast episodes for you!</p>

                <!-- Quick Interest Buttons -->
                <div class="quick-interests">
                    <button @click="setQuickInterest('I need motivation and inspiration')" class="quick-btn">
                        <i class="fa-solid fa-fire"></i>
                        Motivation
                    </button>
                    <button @click="setQuickInterest('I want to learn about relationships and love')" class="quick-btn">
                        <i class="fa-solid fa-heart"></i>
                        Relationships
                    </button>
                    <button @click="setQuickInterest('I feel stressed and need relaxation')" class="quick-btn">
                        <i class="fa-solid fa-leaf"></i>
                        Stress Relief
                    </button>
                    <button @click="setQuickInterest('I want to connect with other women')" class="quick-btn">
                        <i class="fa-solid fa-users"></i>
                        Community
                    </button>
                </div>
            </div>

            <!-- API Status -->
            <div class="api-status">
                <span v-if="!geminiAvailable" class="status-error">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    AI recommendations require API key configuration
                </span>
                <span v-else class="status-ok">
                    <i class="fa-solid fa-check-circle"></i>
                    AI Recommendations Ready
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GeminiService } from '@/services/geminiService'

// Reactive data
const userInterest = ref('')
const isGenerating = ref(false)
const recommendations = ref('')
const error = ref('')
const geminiAvailable = ref(false)

// Initialize Gemini AI
onMounted(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
        geminiAvailable.value = GeminiService.initialize(apiKey)
    }
})

// Generate recommendations
const generateRecommendations = async () => {
    if (!geminiAvailable.value) {
        error.value = 'AI service not available. Please configure API key.'
        return
    }

    if (!userInterest.value.trim()) {
        error.value = 'Please tell us what you\'re interested in.'
        return
    }

    isGenerating.value = true
    error.value = ''
    recommendations.value = ''

    try {
        const response = await GeminiService.generatePodcastRecommendations(userInterest.value)
        recommendations.value = response
    } catch (err) {
        console.error('Recommendation generation failed:', err)
        error.value = 'Failed to generate recommendations. Please try again.'
    } finally {
        isGenerating.value = false
    }
}

// Generate new recommendations
const generateNewRecommendations = () => {
    recommendations.value = ''
    generateRecommendations()
}

// Set quick interest
const setQuickInterest = (interest) => {
    userInterest.value = interest
    generateRecommendations()
}

// Copy recommendations
const copyRecommendations = async () => {
    try {
        await navigator.clipboard.writeText(recommendations.value)
        console.log('Recommendations copied to clipboard')
    } catch (err) {
        console.error('Failed to copy recommendations:', err)
    }
}

// Clear all
const clearAll = () => {
    userInterest.value = ''
    recommendations.value = ''
    error.value = ''
}

// Format recommendations text
const formatRecommendations = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.ai-podcast-recommendations {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 600px;
    margin: 20px auto;
}

.recommendations-header {
    padding: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    text-align: center;
}

.recommendations-header h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.recommendations-header p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
}

.recommendations-content {
    padding: 20px;
}

.interest-input-section {
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 16px;
}

.input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.interest-textarea {
    width: 100%;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: border-color 0.2s ease;
}

.interest-textarea:focus {
    border-color: #667eea;
}

.generate-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;
}

.generate-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.generate-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.loading-state {
    text-align: center;
    color: #666;
    padding: 40px 20px;
}

.loading-spinner {
    font-size: 32px;
    color: #667eea;
    margin-bottom: 16px;
}

.loading-state p {
    margin: 0;
    font-size: 14px;
}

.error-state {
    text-align: center;
    color: #dc3545;
    padding: 20px;
}

.error-icon {
    font-size: 32px;
    margin-bottom: 16px;
}

.error-state p {
    margin: 0 0 16px 0;
    font-size: 14px;
}

.retry-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s ease;
}

.retry-btn:hover {
    background: #c82333;
}

.recommendations-result {
    color: #333;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.result-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.copy-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: background 0.2s ease;
}

.copy-btn:hover {
    background: #5a6fd8;
}

.recommendations-text {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    line-height: 1.6;
    font-size: 14px;
    border-left: 4px solid #667eea;
}

.result-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.action-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: background 0.2s ease;
}

.action-btn:hover {
    background: #5a6fd8;
}

.action-btn.secondary {
    background: #6c757d;
}

.action-btn.secondary:hover {
    background: #5a6268;
}

.initial-state {
    text-align: center;
    color: #666;
    padding: 20px;
}

.initial-icon {
    font-size: 32px;
    color: #667eea;
    margin-bottom: 16px;
}

.initial-state p {
    margin: 0 0 20px 0;
    font-size: 14px;
}

.quick-interests {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
    margin-bottom: 20px;
}

.quick-btn {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
}

.quick-btn:hover {
    background: #e9ecef;
    border-color: #667eea;
}

.api-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
}

.status-ok {
    color: #28a745;
}

.status-error {
    color: #dc3545;
}

/* Responsive design */
@media (max-width: 768px) {
    .ai-podcast-recommendations {
        margin: 10px;
        max-width: none;
    }

    .recommendations-content {
        padding: 16px;
    }

    .quick-interests {
        grid-template-columns: repeat(2, 1fr);
    }

    .result-actions {
        flex-direction: column;
    }
}
</style>
