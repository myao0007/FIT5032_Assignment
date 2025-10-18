# TreeHole Content Moderation System

## 🎯 Overview

The TreeHole Content Moderation System uses Cloud Functions and AI to automatically review user-submitted content before publication, ensuring community safety and maintaining a supportive environment.

## 🔧 Technical Architecture

### Cloud Function: `moderateTreeHoleContent`

**Location:** `functions/index.js`

**Purpose:** Analyzes user content for inappropriate material, hate speech, self-harm, and spam.

**Input Parameters:**
- `content` (string): The user's post content
- `userId` (string): The user's unique identifier

**Output:**
```javascript
{
  action: 'approved' | 'needs_revision' | 'rejected',
  reason: string,
  suggestions: string[],
  riskLevel: 'low' | 'medium' | 'high'
}
```

## 📊 Content Analysis Features

### 1. **Hate Speech Detection**
- Keywords: 'hate', 'kill', 'die', 'stupid', 'ugly', 'worthless'
- Risk Score: +3 points

### 2. **Self-Harm Prevention**
- Keywords: 'suicide', 'kill myself', 'end it all', 'not worth living'
- Risk Score: +4 points
- Provides mental health resources

### 3. **Inappropriate Content Filter**
- Keywords: 'sex', 'nude', 'explicit', 'adult'
- Risk Score: +2 points

### 4. **Spam Detection**
- Repetition ratio analysis
- Promotional content detection
- Risk Score: +1 point

### 5. **Sentiment Analysis**
- Positive words: 'happy', 'joy', 'love', 'grateful', 'blessed'
- Negative words: 'sad', 'angry', 'frustrated', 'depressed', 'lonely'
- Risk Score: +1 point for negative sentiment

## 🎚️ Risk Assessment Levels

### **Low Risk (0-1 points)**
- **Action:** `approved`
- **Result:** Content published immediately
- **Message:** "Your post has been published."

### **Medium Risk (2-3 points)**
- **Action:** `needs_revision`
- **Result:** User prompted to revise or submit anyway
- **Message:** Shows specific suggestions for improvement

### **High Risk (4+ points)**
- **Action:** `rejected`
- **Result:** Content blocked from publication
- **Message:** "Content violates community guidelines"

## 🔄 User Experience Flow

### **Step 1: Content Submission**
```
User submits TreeHole post → Frontend validation → Cloud Function call
```

### **Step 2: AI Analysis**
```
Cloud Function → Content preprocessing → AI analysis → Risk calculation
```

### **Step 3: Result Processing**
```
Risk assessment → Action determination → User notification → Content handling
```

## 📱 Frontend Integration

### **File:** `src/views/ShareThoughtsView.vue`

**Key Changes:**
1. **Import Firebase Functions:**
   ```javascript
   import { getFunctions, httpsCallable } from 'firebase/functions'
   ```

2. **Content Moderation Call:**
   ```javascript
   const functions = getFunctions()
   const moderateContent = httpsCallable(functions, 'moderateTreeHoleContent')
   const moderationResult = await moderateContent({
     content: formData.value.content.trim(),
     userId: authComputed.userId.value
   })
   ```

3. **Result Handling:**
   - **Rejected:** Show rejection message, prevent submission
   - **Needs Revision:** Show suggestions, allow user choice
   - **Approved:** Proceed with normal submission

## 🛡️ Safety Features

### **Automatic Fallback**
- If moderation service fails, content is still saved
- Error handling prevents system breakdown
- User-friendly error messages

### **Privacy Protection**
- Content analysis happens server-side
- No content stored in moderation logs
- User data remains secure

### **Community Guidelines**
- Clear rejection reasons
- Constructive improvement suggestions
- Mental health resource recommendations

## 📈 Monitoring & Analytics

### **Firestore Data Structure**
```javascript
{
  keyword: string,
  content: string,
  author: string,
  createdAt: timestamp,
  moderationStatus: 'approved' | 'needs_revision' | 'rejected',
  riskLevel: 'low' | 'medium' | 'high'
}
```

### **Admin Dashboard Integration**
- Moderation statistics
- Risk level distribution
- Content approval rates
- Community health metrics

## 🚀 Future Enhancements

### **Gemini AI Integration**
- Replace basic keyword detection with AI analysis
- Context-aware content understanding
- Multilingual support
- Cultural sensitivity training

### **Advanced Features**
- Image content moderation
- Real-time content monitoring
- User behavior analysis
- Automated community management

## 🔧 Deployment

### **Cloud Functions Deployment**
```bash
cd functions
npm install
firebase deploy --only functions
```

### **Frontend Updates**
- No additional deployment required
- Changes are automatically reflected
- Backward compatibility maintained

## 📞 Support & Maintenance

### **Error Handling**
- Graceful degradation if moderation fails
- Clear error messages for users
- Admin notification for system issues

### **Performance Optimization**
- Caching for repeated content analysis
- Batch processing for high-volume periods
- Efficient resource utilization

---

**Note:** This system ensures a safe, supportive environment for the SheTalks community while maintaining user privacy and providing constructive feedback for content improvement.
