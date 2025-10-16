// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Gemini AI Service - Handle AI-powered features
 */
export class GeminiService {
    static genAI = null
    static model = null

    /**
     * Initialize Gemini AI
     * @param {string} apiKey - Gemini API key
     */
    static initialize(apiKey) {
        try {
            this.genAI = new GoogleGenerativeAI(apiKey)
            this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
            console.log('✅ Gemini AI initialized successfully')
            return true
        } catch (error) {
            console.error('❌ Failed to initialize Gemini AI:', error)
            return false
        }
    }

    /**
     * Generate content using Gemini AI
     * @param {string} prompt - The prompt for content generation
     * @param {Object} options - Additional options
     * @returns {Promise<string>} - Generated content
     */
    static async generateContent(prompt, options = {}) {
        try {
            if (!this.model) {
                throw new Error('Gemini AI not initialized. Please provide API key.')
            }

            const result = await this.model.generateContent(prompt)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error('❌ Content generation failed:', error)
            throw error
        }
    }

    /**
     * Generate podcast episode recommendations
     * @param {string} userInterest - User's interest or mood
     * @returns {Promise<string>} - AI-generated recommendations
     */
    static async generatePodcastRecommendations(userInterest) {
        const prompt = `You are a helpful assistant for SheTalks, a women's community platform. 
        Based on the user's interest: "${userInterest}", recommend 3 podcast episodes from our collection:
        
        Available podcasts:
        1. Echoes of Her Heart - Intimate stories of love and relationships
        2. Soul Sisters Unite - Community support and friendship
        3. Bloom Beyond Silence - Breaking free from social expectations
        
        Provide personalized recommendations with brief explanations of why each episode would be suitable. 
        Keep the response friendly, supportive, and encouraging.`
        
        return await this.generateContent(prompt)
    }

    /**
     * Generate personalized TreeHole responses
     * @param {string} userThought - User's anonymous thought
     * @returns {Promise<string>} - AI-generated supportive response
     */
    static async generateTreeHoleResponse(userThought) {
        const prompt = `You are a compassionate AI assistant for SheTalks TreeHole, where women share anonymous thoughts.
        
        A user shared: "${userThought}"
        
        Provide a supportive, empathetic response that:
        - Acknowledges their feelings
        - Offers gentle encouragement
        - Suggests positive perspectives
        - Maintains anonymity and safety
        - Is warm and understanding
        
        Keep the response under 150 words and appropriate for a women's support community.`
        
        return await this.generateContent(prompt)
    }

    /**
     * Generate event descriptions
     * @param {Object} eventData - Event information
     * @returns {Promise<string>} - AI-generated event description
     */
    static async generateEventDescription(eventData) {
        const prompt = `Create an engaging event description for a women's community event:
        
        Event Details:
        - Title: ${eventData.title}
        - Date: ${eventData.date}
        - Time: ${eventData.time}
        - Location: ${eventData.location}
        - Type: ${eventData.type || 'Community Event'}
        
        Write a compelling description that:
        - Highlights the benefits for women
        - Creates excitement and anticipation
        - Emphasizes community and connection
        - Is inclusive and welcoming
        - Encourages participation
        
        Keep it under 200 words and make it inspiring.`
        
        return await this.generateContent(prompt)
    }

    /**
     * Generate wellness tips
     * @param {string} topic - Wellness topic (e.g., "stress", "self-care", "relationships")
     * @returns {Promise<string>} - AI-generated wellness tips
     */
    static async generateWellnessTips(topic) {
        const prompt = `You are a wellness expert for SheTalks community. Provide 5 practical wellness tips for women on the topic: "${topic}".
        
        Make the tips:
        - Practical and actionable
        - Specifically relevant to women's experiences
        - Supportive and encouraging
        - Easy to implement in daily life
        - Focused on mental and emotional well-being
        
        Format as a numbered list with brief explanations.`
        
        return await this.generateContent(prompt)
    }

    /**
     * Generate community discussion topics
     * @param {string} category - Discussion category
     * @returns {Promise<string>} - AI-generated discussion topics
     */
    static async generateDiscussionTopics(category) {
        const prompt = `Generate 5 engaging discussion topics for SheTalks community in the category: "${category}".
        
        Topics should be:
        - Relevant to women's experiences
        - Encouraging open and supportive dialogue
        - Inclusive and respectful
        - Thought-provoking but not controversial
        - Suitable for a safe community space
        
        Format as a numbered list with brief descriptions.`
        
        return await this.generateContent(prompt)
    }

    /**
     * Check if Gemini AI is available
     * @returns {boolean} - Whether Gemini AI is initialized
     */
    static isAvailable() {
        return this.model !== null
    }

    /**
     * Get AI status information
     * @returns {Object} - Status information
     */
    static getStatus() {
        return {
            initialized: this.isAvailable(),
            model: this.model ? 'gemini-2.5-flash' : null,
            timestamp: new Date().toISOString()
        }
    }
}

export default GeminiService
