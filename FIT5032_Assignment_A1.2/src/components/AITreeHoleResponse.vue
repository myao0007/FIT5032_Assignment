<template>
    <div class="ai-treehole-response">
        <div class="response-header">
            <h3>
                <i class="fa-solid fa-robot"></i>
                AI Support Response
            </h3>
            <button @click="closeResponse" class="close-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>

        <div class="response-content">
            <!-- Loading State -->
            <div v-if="isGenerating" class="loading-state">
                <div class="loading-spinner">
                    <i class="fa-solid fa-robot fa-spin"></i>
                </div>
                <p>Generating supportive response...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
                <div class="error-icon">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                </div>
                <p>{{ error }}</p>
                <button @click="generateResponse" class="retry-btn">
                    <i class="fa-solid fa-redo"></i>
                    Try Again
                </button>
            </div>

            <!-- AI Response -->
            <div v-else-if="aiResponse" class="ai-response">
                <div class="response-text" v-html="formatResponse(aiResponse)"></div>
                <div class="response-actions">
                    <button @click="copyResponse" class="action-btn">
                        <i class="fa-solid fa-copy"></i>
                        Copy Response
                    </button>
                    <button @click="generateNewResponse" class="action-btn">
                        <i class="fa-solid fa-refresh"></i>
                        Generate New
                    </button>
                </div>
            </div>

            <!-- Initial State -->
            <div v-else class="initial-state">
                <div class="initial-icon">
                    <i class="fa-solid fa-heart"></i>
                </div>
                <p>Get AI-generated supportive response for this thought</p>
                <button @click="generateResponse" class="generate-btn" :disabled="!geminiAvailable">
                    <i class="fa-solid fa-magic"></i>
                    Generate AI Response
                </button>
                <div v-if="!geminiAvailable" class="api-warning">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    AI feature requires API key configuration
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GeminiService } from '@/services/geminiService'

// Props
const props = defineProps({
    userThought: {
        type: String,
        required: true
    }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const isGenerating = ref(false)
const aiResponse = ref('')
const error = ref('')
const geminiAvailable = ref(false)

// Initialize Gemini AI
onMounted(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
        geminiAvailable.value = GeminiService.initialize(apiKey)
    }
})

// Generate AI response
const generateResponse = async () => {
    if (!geminiAvailable.value) {
        error.value = 'AI service not available. Please configure API key.'
        return
    }

    isGenerating.value = true
    error.value = ''
    aiResponse.value = ''

    try {
        const response = await GeminiService.generateTreeHoleResponse(props.userThought)
        aiResponse.value = response
    } catch (err) {
        console.error('AI response generation failed:', err)
        error.value = 'Failed to generate response. Please try again.'
    } finally {
        isGenerating.value = false
    }
}

// Generate new response
const generateNewResponse = () => {
    aiResponse.value = ''
    generateResponse()
}

// Copy response to clipboard
const copyResponse = async () => {
    try {
        await navigator.clipboard.writeText(aiResponse.value)
        // You could add a toast notification here
        console.log('Response copied to clipboard')
    } catch (err) {
        console.error('Failed to copy response:', err)
    }
}

// Close response panel
const closeResponse = () => {
    emit('close')
}

// Format response text
const formatResponse = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.ai-treehole-response {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 500px;
    margin: 20px auto;
}

.response-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.response-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.response-content {
    padding: 20px;
}

.loading-state {
    text-align: center;
    color: #666;
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

.ai-response {
    color: #333;
}

.response-text {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    line-height: 1.6;
    font-size: 14px;
    border-left: 4px solid #667eea;
}

.response-actions {
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

.initial-state {
    text-align: center;
    color: #666;
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

.generate-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    margin-bottom: 12px;
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

.api-warning {
    background: #fff3cd;
    color: #856404;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
}

/* Responsive design */
@media (max-width: 768px) {
    .ai-treehole-response {
        margin: 10px;
        max-width: none;
    }

    .response-content {
        padding: 16px;
    }

    .response-actions {
        flex-direction: column;
    }
}
</style>
