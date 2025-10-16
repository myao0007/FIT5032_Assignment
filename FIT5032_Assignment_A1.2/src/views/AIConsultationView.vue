<template>
    <div class="ai-consultation-page">
        <!-- Main Content -->
        <div class="consultation-container">
            <!-- Chat Area -->
            <div class="chat-area">
                <!-- Welcome Message -->
                <div v-if="messages.length === 0" class="welcome-section">
                    <!-- Back Button -->
                    <div class="back-button-container">
                        <button @click="goBack" class="back-button">
                            <i class="fa-solid fa-arrow-left"></i>
                            Go Back
                        </button>
                    </div>

                    <div class="welcome-icon">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                    <h2>Welcome to SheTalks AI Assistant!</h2>
                    <p>I'm here to help you with:</p>
                    <div class="capabilities-grid">
                        <div class="capability-item">
                            <i class="fa-solid fa-podcast"></i>
                            <span>Podcast Recommendations</span>
                        </div>
                        <div class="capability-item">
                            <i class="fa-solid fa-leaf"></i>
                            <span>Wellness Tips</span>
                        </div>
                        <div class="capability-item">
                            <i class="fa-solid fa-users"></i>
                            <span>Community Support</span>
                        </div>
                        <div class="capability-item">
                            <i class="fa-solid fa-calendar"></i>
                            <span>Event Information</span>
                        </div>
                    </div>
                    <div class="quick-actions">
                        <button @click="sendQuickMessage('Recommend podcasts for me')" class="quick-btn">
                            <i class="fa-solid fa-podcast"></i>
                            Get Podcast Recommendations
                        </button>
                        <button @click="sendQuickMessage('Give me wellness tips')" class="quick-btn">
                            <i class="fa-solid fa-leaf"></i>
                            Get Wellness Tips
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="messages-container" ref="messagesContainer">
                    <!-- Back Button for Chat -->
                    <div v-if="messages.length > 0" class="chat-back-button-container">
                        <button @click="goBack" class="chat-back-button">
                            <i class="fa-solid fa-arrow-left"></i>
                            Go Back
                        </button>
                    </div>
                    <div v-for="(message, index) in messages" :key="index" class="message" :class="message.type">
                        <div class="message-avatar">
                            <i :class="message.type === 'user' ? 'fa-solid fa-user' : 'fa-solid fa-robot'"></i>
                        </div>
                        <div class="message-content">
                            <div class="message-text" v-html="formatMessage(message.text)"></div>
                            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                        </div>
                    </div>

                    <!-- Typing Indicator -->
                    <div v-if="isTyping" class="message assistant">
                        <div class="message-avatar">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <div class="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="input-section">
                <div class="input-container">
                    <div class="input-label">
                        <i class="fa-solid fa-comment-dots"></i>
                        <span>Ask me anything about SheTalks...</span>
                    </div>
                    <div class="input-row">
                        <input v-model="currentMessage" @keyup.enter="sendMessage"
                            placeholder="Type your question here..." :disabled="isTyping" class="message-input" />
                        <button @click="sendMessage" :disabled="!currentMessage.trim() || isTyping" class="send-btn">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { GeminiService } from '@/services/geminiService'

const router = useRouter()

// Reactive data
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const geminiAvailable = ref(false)

// Initialize Gemini AI
onMounted(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
        geminiAvailable.value = GeminiService.initialize(apiKey)
    }
})

// Navigation
const goBack = () => {
    router.go(-1)
}

// Message handling
const sendMessage = async () => {
    if (!currentMessage.value.trim() || isTyping.value) return

    const userMessage = {
        type: 'user',
        text: currentMessage.value,
        timestamp: new Date()
    }
    messages.value.push(userMessage)
    currentMessage.value = ''

    await nextTick()
    scrollToBottom()

    isTyping.value = true
    try {
        const response = await GeminiService.generateContent(userMessage.text)
        const aiMessage = {
            type: 'assistant',
            text: response,
            timestamp: new Date()
        }
        messages.value.push(aiMessage)
    } catch (error) {
        console.error('Error generating AI response:', error)
        const errorMessage = {
            type: 'assistant',
            text: 'Sorry, I encountered an error. Please try again later.',
            timestamp: new Date()
        }
        messages.value.push(errorMessage)
    } finally {
        isTyping.value = false
        await nextTick()
        scrollToBottom()
    }
}

const sendQuickMessage = async (message) => {
    currentMessage.value = message
    await sendMessage()
}

// Utility functions
const formatMessage = (text) => {
    return text.replace(/\n/g, '<br>')
}

const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}
</script>

<style>
/* Global styles for AI consultation page */
body {
    background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%) !important;
    margin: 0 !important;
    padding: 0 !important;
}

#app {
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
}
</style>

<style scoped>
.ai-consultation-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%);
    margin: 0;
    padding: 0;
    position: relative;
    overflow-x: hidden;
}


.consultation-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 64px);
}

.chat-area {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 20px;
    max-height: 600px;
    position: relative;
}

/* Back Button */
.back-button-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
}

.back-button {
    background: none;
    color: #2c3e50;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    border-radius: 6px;
}

.back-button:hover {
    background: rgba(44, 62, 80, 0.05);
    color: #1a252f;
}

.back-button i {
    font-size: 12px;
}

/* Chat Back Button */
.chat-back-button-container {
    position: sticky;
    top: 0;
    background: white;
    padding: 10px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    z-index: 10;
}

.chat-back-button {
    background: none;
    color: #2c3e50;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    border-radius: 6px;
}

.chat-back-button:hover {
    background: rgba(44, 62, 80, 0.05);
    color: #1a252f;
}

.chat-back-button i {
    font-size: 12px;
}

.welcome-section {
    padding: 40px;
    text-align: center;
    color: #666;
}

.welcome-icon {
    font-size: 64px;
    color: #f0b6c1;
    margin-bottom: 24px;
}


.welcome-section h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 16px 0;
}

.welcome-section p {
    font-size: 1.1rem;
    margin: 0 0 32px 0;
}

.capabilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 32px 0;
}

.capability-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    font-weight: 600;
    color: #495057;
}

.capability-item i {
    font-size: 20px;
    color: #f0b6c1;
}

.quick-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 32px;
}

.quick-btn {
    background: linear-gradient(135deg, #f0b6c1, #e8a8b8);
    color: #2c3e50;
    border: none;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(240, 182, 193, 0.3);
}

.quick-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(240, 182, 193, 0.4);
    background: linear-gradient(135deg, #e8a8b8, #d99bb0);
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.message {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.message.user {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.message.user .message-avatar {
    background: #2c3e50;
    color: white;
}

.message.assistant .message-avatar {
    background: #e9ecef;
    color: #495057;
}

.message-content {
    max-width: 70%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.message.user .message-content {
    align-items: flex-end;
}

.message-text {
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.4;
    word-wrap: break-word;
}

.message.user .message-text {
    background: #2c3e50;
    color: white;
}

.message-time {
    font-size: 12px;
    color: #6c757d;
    padding: 0 8px;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6c757d;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-10px);
    }
}

.input-section {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 0;
}

.input-container {
    margin-bottom: 16px;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #f0b6c1;
}

.input-row {
    display: flex;
    gap: 12px;
    align-items: center;
}

.message-input {
    flex: 1;
    border: 2px solid #e9ecef;
    border-radius: 24px;
    padding: 16px 20px;
    font-size: 16px;
    outline: none;
    transition: all 0.2s ease;
    background: white;
}

.message-input:focus {
    border-color: #f0b6c1;
    box-shadow: 0 0 0 3px rgba(240, 182, 193, 0.1);
}

.send-btn {
    background: linear-gradient(135deg, #f0b6c1, #e8a8b8);
    color: #2c3e50;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 18px;
}

.send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(240, 182, 193, 0.4);
    background: linear-gradient(135deg, #e8a8b8, #d99bb0);
}

.send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}


/* Responsive Design */
@media (max-width: 768px) {
    .consultation-container {
        padding: 20px 16px;
        height: calc(100vh - 140px);
    }

    .welcome-section {
        padding: 24px;
    }

    .welcome-section h2 {
        font-size: 1.5rem;
    }

    .capabilities-grid {
        grid-template-columns: 1fr;
    }

    .quick-actions {
        flex-direction: column;
        align-items: center;
    }

    .message-content {
        max-width: 85%;
    }

    .header-content {
        padding: 0 16px;
    }

    .page-title {
        font-size: 1.5rem;
    }
}
</style>
