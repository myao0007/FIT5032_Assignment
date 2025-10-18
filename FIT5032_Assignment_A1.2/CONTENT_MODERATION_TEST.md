# TreeHole Content Moderation Test Guide

## 🧪 Testing the Content Moderation System

### **Test Cases for Content Moderation**

#### **1. Low Risk Content (Should be Approved)**
**Test Content:**
- "I love my family and friends"
- "Today was a great day at work"
- "I'm grateful for all the support I've received"

**Expected Result:** ✅ **Approved** - Content published immediately

---

#### **2. Medium Risk Content (Needs Revision)**
**Test Content:**
- "I'm so angry at everyone today" (negative sentiment)
- "This is stupid and I hate it" (mild inappropriate language)
- "I feel worthless sometimes" (self-esteem issues)

**Expected Result:** ⚠️ **Needs Revision** - User prompted with suggestions

---

#### **3. High Risk Content (Should be Rejected)**
**Test Content:**
- "I hate everyone and want to die" (hate speech + self-harm)
- "This is so stupid, I want to kill myself" (hate speech + self-harm)
- "I'm ugly and worthless, not worth living" (self-harm + negative sentiment)

**Expected Result:** ❌ **Rejected** - Content blocked with clear reason

---

#### **4. Spam Content (Should be Rejected)**
**Test Content:**
- "Buy now click here buy now click here buy now" (repetitive spam)
- "Click here for amazing deals click here click here" (promotional spam)

**Expected Result:** ❌ **Rejected** - Spam detection triggered

---

### **How to Test**

#### **Step 1: Access Share Thoughts Page**
1. Navigate to TreeHole page
2. Click "Share Your Thoughts" button
3. You should see the form with Keyword and Content fields

#### **Step 2: Test Different Content Types**
1. **Enter a keyword** (e.g., "Test")
2. **Enter test content** from the test cases above
3. **Click "Share" button**
4. **Observe the result:**
   - ✅ **Approved**: "Your post has been published"
   - ⚠️ **Needs Revision**: Dialog with suggestions and choice to revise or submit
   - ❌ **Rejected**: "Your post was not approved: [reason]"

#### **Step 3: Check Console Logs**
Open browser developer tools (F12) and check the Console tab for:
- "Starting content moderation..." message
- "Content moderation result:" with detailed analysis
- Any error messages

---

### **Expected Console Output**

#### **Successful Moderation:**
```
Starting content moderation...
Content moderation result: {
  action: "approved",
  reason: "Content meets community standards",
  suggestions: [],
  riskLevel: "low"
}
```

#### **Needs Revision:**
```
Starting content moderation...
Content moderation result: {
  action: "needs_revision",
  reason: "Content needs minor adjustments",
  suggestions: ["Consider sharing your feelings in a constructive way"],
  riskLevel: "medium"
}
```

#### **Rejected:**
```
Starting content moderation...
Content moderation result: {
  action: "rejected",
  reason: "Content violates community guidelines",
  suggestions: [],
  riskLevel: "high"
}
```

---

### **Troubleshooting**

#### **If Content Moderation Fails:**
1. **Check Firebase Functions:** Ensure `moderateTreeHoleContent` is deployed
2. **Check Authentication:** Ensure user is logged in
3. **Check Console:** Look for specific error messages
4. **Fallback Behavior:** Content should still be saved if moderation fails

#### **Common Issues:**
- **"Cannot read properties of undefined"**: Fixed by using `authComputed.user.value?.uid`
- **"Content moderation service unavailable"**: Cloud Functions not deployed or network issue
- **"Missing or insufficient permissions"**: Firebase security rules need updating

---

### **Admin Dashboard Integration**

#### **View Moderation Statistics:**
1. Login as admin (admin@admin.com / 1234)
2. Go to Admin Dashboard
3. Check "Tree Hole Posts" section for:
   - Total posts count
   - Moderation status distribution
   - Risk level analysis

#### **Monitor Content Health:**
- **Approved Posts**: Should show in TreeHole feed
- **Rejected Posts**: Not visible to users
- **Needs Revision**: May appear if user chose to submit anyway

---

### **Success Criteria**

✅ **System Working Correctly When:**
1. Low-risk content is approved immediately
2. Medium-risk content shows revision suggestions
3. High-risk content is rejected with clear reasons
4. Spam content is detected and blocked
5. Console shows detailed moderation results
6. Admin dashboard reflects moderation statistics
7. No JavaScript errors in console
8. User experience is smooth and informative

---

### **Next Steps After Testing**

1. **Verify All Test Cases** work as expected
2. **Check Admin Dashboard** for moderation statistics
3. **Test Edge Cases** (empty content, very long content)
4. **Verify Error Handling** (network issues, service unavailable)
5. **Document Any Issues** found during testing

---

**Note:** The content moderation system is designed to be user-friendly while maintaining community safety. All moderation decisions are logged for admin review and system improvement.
