# Gemini AI Integration Setup

This document explains how to set up and use the Gemini AI features in the SheTalks application.

## 🚀 Getting Started

### 1. Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

**⚠️ IMPORTANT: Never commit API keys to Git!**

1. **Copy the template file:**
   ```bash
   cp env.template .env.local
   ```

2. **Edit `.env.local` with your actual API key:**
   ```bash
   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your-actual-api-key-here
   
   # Optional: Other configurations
   SENDGRID_API_KEY=your-sendgrid-api-key-here
   FROM_EMAIL=your-email@domain.com
   PORT=3000
   ```

3. **Verify `.env.local` is in `.gitignore`:**
   The file `.env.local` is already configured to be ignored by Git, so your API keys will never be committed to the repository.

### 3. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## 🤖 AI Features Available

### 1. AI Assistant (Floating Chat)
- **Location**: Available on all pages (bottom-right corner)
- **Features**:
  - Personalized podcast recommendations
  - Wellness tips and advice
  - Community support
  - General questions about SheTalks

### 2. AI TreeHole Responses
- **Location**: TreeHole view when viewing a specific thought
- **Features**:
  - Generate supportive responses to anonymous thoughts
  - Empathetic and encouraging AI feedback
  - Copy responses for sharing

### 3. AI Podcast Recommendations
- **Location**: Podcasts page
- **Features**:
  - Personalized podcast recommendations based on interests
  - Quick interest buttons for common topics
  - Detailed explanations for each recommendation

## 🛠️ Technical Implementation

### Services
- `src/services/geminiService.js` - Main Gemini AI service
- Handles all AI interactions and content generation

### Components
- `src/components/AIAssistant.vue` - Floating chat assistant
- `src/components/AITreeHoleResponse.vue` - TreeHole AI responses
- `src/components/AIPodcastRecommendations.vue` - Podcast recommendations

### Integration Points
- `src/App.vue` - AI Assistant integration
- `src/views/TreeHoleView.vue` - AI response integration
- `src/views/PodcastsView.vue` - AI recommendations integration

## 🔧 API Usage

### Available Methods

```javascript
import { GeminiService } from '@/services/geminiService'

// Initialize (done automatically)
GeminiService.initialize(apiKey)

// Generate podcast recommendations
const recommendations = await GeminiService.generatePodcastRecommendations('I feel stressed')

// Generate TreeHole responses
const response = await GeminiService.generateTreeHoleResponse('I feel lonely')

// Generate wellness tips
const tips = await GeminiService.generateWellnessTips('stress management')

// Generate discussion topics
const topics = await GeminiService.generateDiscussionTopics('relationships')

// General content generation
const content = await GeminiService.generateContent('Your custom prompt')
```

## 🎯 Use Cases

### For Users
- Get personalized podcast recommendations
- Receive supportive responses to their thoughts
- Access wellness tips and advice
- Get help navigating the platform

### For Community
- Enhanced user engagement
- Personalized content discovery
- Supportive community interactions
- AI-powered content curation

## 🔒 Privacy & Safety

### API Key Security
- **Never commit API keys to Git** - Use `.env.local` file
- **Use environment variables** - Keys are loaded at runtime
- **Template file provided** - Copy `env.template` to `.env.local`
- **Git ignore configured** - `.env.local` is automatically ignored

### Data Privacy
- All AI interactions are processed securely
- User data is not stored permanently
- AI responses are designed to be supportive and appropriate
- Content is filtered for community safety

### Best Practices
1. **Keep API keys private** - Never share in code or documentation
2. **Use different keys** - Separate keys for development and production
3. **Monitor usage** - Check API usage regularly
4. **Rotate keys** - Change keys periodically for security

## 🚨 Troubleshooting

### Common Issues

1. **"AI not available" message**
   - Check if `VITE_GEMINI_API_KEY` is set correctly
   - Verify the API key is valid
   - Restart the development server

2. **"Failed to generate response" error**
   - Check internet connection
   - Verify API key has proper permissions
   - Check browser console for detailed errors

3. **Slow response times**
   - Normal for AI generation (2-5 seconds)
   - Check network connection
   - API rate limits may apply

### Debug Mode

Enable debug logging by opening browser console to see detailed AI interaction logs.

## 📊 API Limits

- **Free Tier**: 15 requests per minute
- **Daily Limit**: 1,500 requests per day
- **Cost**: Free for development and testing

## 🔄 Updates

The AI features are designed to be:
- **Modular**: Easy to add new AI capabilities
- **Extensible**: Simple to integrate additional AI services
- **Maintainable**: Clean separation of concerns

## 📝 Notes

- Gemini AI is free for development and testing
- No credit card required for basic usage
- Perfect for educational and community projects
- Can be easily upgraded to paid plans for production use

## 🆘 Support

If you encounter issues:
1. Check this documentation
2. Verify your API key configuration
3. Check the browser console for errors
4. Ensure you have a stable internet connection

---

**Happy AI-powered community building!** 🤖💜
