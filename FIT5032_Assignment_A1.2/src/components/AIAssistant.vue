<template>
    <div class="ai-assistant">
        <!-- AI Assistant Toggle Button -->
        <div class="ai-toggle" @click="toggleAssistant">
            <div class="ai-icon" :class="{ active: isOpen }">
                <i class="fa-solid fa-robot"></i>
            </div>
            <span class="ai-label">AI Assistant</span>
        </div>

        <!-- AI Chat Panel -->
        <div class="ai-panel" :class="{ open: isOpen }">
            <div class="ai-header">
                <h3>
                    <i class="fa-solid fa-robot"></i>
                    SheTalks AI Assistant
                </h3>
                <button @click="toggleAssistant" class="close-btn">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>

            <div class="ai-content">
                <!-- Welcome Message -->
                <div v-if="messages.length === 0" class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                    <h4>Welcome to SheTalks AI Assistant!</h4>
                    <p>I'm here to help you with:</p>
                    <ul>
                        <li>Podcast recommendations</li>
                        <li>Wellness tips</li>
                        <li>Community support</li>
                        <li>Event information</li>
                    </ul>
                    <div class="quick-actions">
                        <button @click="sendQuickMessage('Recommend podcasts for me')" class="quick-btn">
                            <i class="fa-solid fa-podcast"></i>
                            Podcast Recommendations
                        </button>
                        <button @click="sendQuickMessage('Give me wellness tips')" class="quick-btn">
                            <i class="fa-solid fa-leaf"></i>
                            Wellness Tips
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="messages-container" ref="messagesContainer">
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

                <!-- Input Area -->
                <div class="input-area">
                    <div class="input-section">
                        <div class="input-label">
                            <i class="fa-solid fa-comment-dots"></i>
                            <span>Ask me anything about SheTalks...</span>
                        </div>
                        <div class="input-container">
                            <input v-model="currentMessage" @keyup.enter="sendMessage"
                                placeholder="Type your question here..." :disabled="isTyping" class="message-input" />
                            <button @click="sendMessage" :disabled="!currentMessage.trim() || isTyping"
                                class="send-btn">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                    <div class="ai-status">
                        <span v-if="!geminiAvailable" class="status-error">
                            <i class="fa-solid fa-exclamation-triangle"></i>
                            AI not available - API key required
                        </span>
                        <span v-else class="status-ok">
                            <i class="fa-solid fa-check-circle"></i>
                            AI Assistant Ready
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { GeminiService } from '@/services/geminiService'

// Reactive data
const isOpen = ref(false)
const currentMessage = ref('')
const messages = ref([])
const isTyping = ref(false)
const geminiAvailable = ref(false)
const messagesContainer = ref(null)

// Initialize Gemini AI
onMounted(() => {
    // Check if API key is available (you can set this in your environment)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
        geminiAvailable.value = GeminiService.initialize(apiKey)
    } else {
        console.warn('⚠️ Gemini API key not found. Set VITE_GEMINI_API_KEY in your environment.')
    }
})

// Toggle assistant panel
const toggleAssistant = () => {
    isOpen.value = !isOpen.value
}

// Send message
const sendMessage = async () => {
    if (!currentMessage.value.trim() || isTyping.value) return

    const userMessage = currentMessage.value.trim()
    currentMessage.value = ''

    // Add user message
    messages.value.push({
        type: 'user',
        text: userMessage,
        timestamp: new Date()
    })

    // Scroll to bottom
    await nextTick()
    scrollToBottom()

    // Show typing indicator
    isTyping.value = true

    try {
        // Generate AI response
        const response = await generateAIResponse(userMessage)

        // Add AI response
        messages.value.push({
            type: 'assistant',
            text: response,
            timestamp: new Date()
        })
    } catch (error) {
        console.error('AI response error:', error)
        messages.value.push({
            type: 'assistant',
            text: 'Sorry, I encountered an error. Please try again later.',
            timestamp: new Date()
        })
    } finally {
        isTyping.value = false
        await nextTick()
        scrollToBottom()
    }
}

// Send quick message
const sendQuickMessage = (message) => {
    currentMessage.value = message
    sendMessage()
}

// Generate AI response based on user input
const generateAIResponse = async (userInput) => {
    if (!geminiAvailable.value) {
        return 'I\'m sorry, but the AI assistant is not available right now. Please check if the API key is configured correctly.'
    }

    const input = userInput.toLowerCase()

    // Route to appropriate AI function based on keywords
    if (input.includes('podcast') || input.includes('recommend')) {
        return await GeminiService.generatePodcastRecommendations(userInput)
    } else if (input.includes('wellness') || input.includes('tip') || input.includes('health')) {
        return await GeminiService.generateWellnessTips(userInput)
    } else if (input.includes('discuss') || input.includes('topic') || input.includes('conversation')) {
        return await GeminiService.generateDiscussionTopics(userInput)
    } else if (input.includes('event') || input.includes('workshop') || input.includes('meeting')) {
        return await GeminiService.generateEventDescription({ title: 'Community Event', date: 'TBD', time: 'TBD', location: 'Online' })
    } else {
        // General response
        return await GeminiService.generateContent(
            `You are a helpful AI assistant for SheTalks, a women's community platform. 
      A user asked: "${userInput}"
      
      Provide a helpful, supportive response that's relevant to women's community, wellness, and empowerment. 
      Keep it friendly and encouraging.`
        )
    }
}

// Format message text (basic markdown support)
const formatMessage = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
}

// Format timestamp
const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Scroll to bottom of messages
const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// Watch for new messages to auto-scroll
watch(messages, () => {
    nextTick(() => {
        scrollToBottom()
    })
}, { deep: true })
</script>

<style scoped>
.ai-assistant {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.ai-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 12px 16px;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
}

.ai-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.ai-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.ai-icon.active {
    transform: rotate(360deg);
}

.ai-label {
    font-weight: 600;
    font-size: 14px;
}

.ai-panel {
    position: absolute;
    bottom: 60px;
    right: 0;
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.ai-panel.open {
    transform: translateY(0) scale(1);
    opacity: 1;
    visibility: visible;
}

.ai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 16px 16px 0 0;
}

.ai-header h3 {
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

.ai-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.welcome-message {
    padding: 16px 20px;
    text-align: center;
    color: #666;
    flex-shrink: 0;
}

.welcome-icon {
    font-size: 48px;
    color: #667eea;
    margin-bottom: 16px;
}

.welcome-message h4 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 18px;
}

.welcome-message p {
    margin: 0 0 16px 0;
    font-size: 14px;
}

.welcome-message ul {
    text-align: left;
    margin: 0 0 20px 0;
    padding-left: 20px;
}

.welcome-message li {
    margin-bottom: 4px;
    font-size: 14px;
}

.quick-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.quick-btn {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
}

.quick-btn:hover {
    background: #e9ecef;
    border-color: #667eea;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
}

.message {
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.message.user {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
}

.message.user .message-avatar {
    background: #667eea;
    color: white;
}

.message.assistant .message-avatar {
    background: #f8f9fa;
    color: #667eea;
    border: 1px solid #e9ecef;
}

.message-content {
    max-width: 80%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.message.user .message-content {
    align-items: flex-end;
}

.message-text {
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.4;
}

.message.user .message-text {
    background: #667eea;
    color: white;
}

.message-time {
    font-size: 11px;
    color: #999;
    padding: 0 4px;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 12px;
}

.typing-indicator span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #999;
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

.input-area {
    padding: 16px;
    border-top: 1px solid #e9ecef;
    background: #f8f9fa;
    position: sticky;
    bottom: 0;
    z-index: 10;
}

.input-section {
    margin-bottom: 12px;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #667eea;
}

.input-label i {
    font-size: 14px;
}

.input-container {
    display: flex;
    gap: 8px;
}

.message-input {
    flex: 1;
    border: 2px solid #e9ecef;
    border-radius: 20px;
    padding: 12px 16px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-input:focus {
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
}

.message-input:disabled {
    background: #f8f9fa;
    color: #999;
}

.send-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.send-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a6fd8, #6a4c93);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.ai-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
}

.status-ok {
    color: #28a745;
}

.status-error {
    color: #dc3545;
}

/* Responsive design */
@media (max-width: 768px) {
    .ai-assistant {
        bottom: 10px;
        right: 10px;
    }

    .ai-panel {
        width: 300px;
        height: 400px;
    }
}
</style>
