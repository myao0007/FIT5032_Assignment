/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const puppeteer = require("puppeteer");
const sgMail = require("@sendgrid/mail");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate event PDF and send email
exports.generateEventPDF = onCall(async (request) => {
  try {
    const { eventData, userEmail } = request.data;
    
    if (!eventData) {
      throw new Error("Event data is required");
    }
    
    if (!userEmail) {
      throw new Error("User email is required");
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(eventData);
    
    // Send email
    await sendEmailWithPDF(eventData, pdfBuffer, userEmail);
    
    return { success: true, message: "PDF sent to email successfully" };
  } catch (error) {
    logger.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF: " + error.message);
  }
});

// Send welcome email function
exports.sendWelcomeEmail = onCall(async (request) => {
  try {
    const { email, username } = request.data;
    
    if (!email || !username) {
      throw new Error("Email and username are required");
    }
    
    const msg = {
      to: email,
      from: 'myao0007@student.monash.edu',
      subject: 'Welcome to SheTalks!',
      text: `Hi ${username},\n\nWelcome to SheTalks, a place where women share emotions, stories, and growth.\n\nYour account has been successfully created. You can now log in and start exploring our podcasts, the Tree Hole, and the Discover section.\n\n👍 Go to SheTalks: https://shetalks.web.app\n\nThank you for joining our community 💖\n— The SheTalks Team\n\n---\nIf you didn't sign up for this account, please ignore this email.\n© 2025 SheTalks. All rights reserved.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white;">
          <p>Hi <strong>${username}</strong>,</p>
          <p>Welcome to <strong>SheTalks</strong>, a place where women share emotions, stories, and growth.</p>
          <p>Your account has been successfully created. You can now log in and start exploring our podcasts, the Tree Hole, and the Discover section.</p>
          <p>👍 <a href="https://shetalks.web.app" style="color: #262c67;">Go to SheTalks</a></p>
          <p>Thank you for joining our community 💖<br>— The SheTalks Team</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            If you didn't sign up for this account, please ignore this email.<br>
            © 2025 SheTalks. All rights reserved.
          </p>
        </div>
      `,
      attachments: [{
        content: 'V2VsY29tZSB0byBTaGVUYWxrcywgQ29tbXVuaXR5IQoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCkFCT1VUIFVTCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpTaGVUYWxrcyBpcyBhIHNhZmUgc3BhY2UgZm9yIHdvbWVuIHRvIHNoYXJlIGVtb3Rpb25zLCBzdG9yaWVzLCBhbmQgcGVyc29uYWwgZ3Jvd3RoIHRocm91Z2g6CgpQT0RDQVNUUwrigKIgRWNob2VzIG9mIEhlciBIZWFydCDigJQgSW50aW1hdGUgc3RvcmllcyBvZiBsb3ZlIGFuZCByZWxhdGlvbnNoaXBzCuKAoiBTb3VsIFNpc3RlcnMgVW5pdGUg4oCUIENvbW11bml0eSBzdXBwb3J0IGFuZCBmcmllbmRzaGlwCuKAoiBCbG9vbSBCZXlvbmQgU2lsZW5jZSDigJQgQnJlYWtpbmcgZnJlZSBmcm9tIHNvY2lldGFsIGV4cGVjdGF0aW9ucwoKVFJFRSBIT0xFClNoYXJlIHlvdXIgdGhvdWdodHMgYW5vbnltb3VzbHkgaW4gYSBqdWRnbWVudC1mcmVlIHpvbmUKCkxJVkUgRVZFTlRTCkpvaW4gb3VyIG1vbnRobHkgd29ya3Nob3BzIGFuZCBtZWRpdGF0aW9uIHNlc3Npb25zCgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKR0VUVElORyBTVEFSVEVECjEuIENvbXBsZXRlIHlvdXIgcHJvZmlsZQoyLiBCcm93c2Ugb3VyIHBvZGNhc3QgZXBpc29kZXMKMy4gU2hhcmUgaW4gdGhlIFRyZWUgSG9sZQo0LiBKb2luIHVwY29taW5nIGV2ZW50cwoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCk5FRUQgSEVMUD8KVmlzaXQgb3VyIEZBUTogaHR0cHM6Ly9zaGV0YWxrcy53ZWIuYXBwL2hlbHAKQ29udGFjdCB1czogc3VwcG9ydEBzaGV0YWxrcy5jb20KClRoYW5rIHlvdSBmb3Igam9pbmluZyBvdXIgY29tbXVuaXR5ISDwn5KWCsKpIDIwMjUgU2hlVGFsa3MgQ29tbXVuaXR5LiBBbGwgcmlnaHRzIHJlc2VydmVkLgo=',
        filename: 'welcome.txt',
        type: 'text/plain'
      }]
    };
    
    await sgMail.send(msg);
    return { success: true, message: 'Welcome email sent!' };
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email: ' + error.message);
  }
});

// Simple PDF generation function
async function generatePDF(eventData) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Simple HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
        .detail { margin-bottom: 10px; }
        .label { font-weight: bold; color: #2c3e50; }
        .description { margin-top: 20px; line-height: 1.6; }
        .note { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>${eventData.title}</h1>
      
      <div class="detail">
        <span class="label">Date:</span> ${eventData.date}
      </div>
      <div class="detail">
        <span class="label">Time:</span> ${eventData.time}
      </div>
      <div class="detail">
        <span class="label">Location:</span> ${eventData.location}
      </div>
      
      <div class="description">
        <h3>About This Event</h3>
        <p>${eventData.description}</p>
      </div>
      
      <div class="note">
        <strong>Note:</strong> ${eventData.note}
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(htmlContent);
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  });
  await browser.close();
  return pdf;
}

// Send email
async function sendEmailWithPDF(eventData, pdfBuffer, userEmail) {
  const msg = {
    to: userEmail, // Use real user email
    from: 'myao0007@student.monash.edu',
    subject: `Event Details: ${eventData.title}`,
    text: 'Please find the event details attached.',
    attachments: [
      {
        content: pdfBuffer.toString('base64'),
        filename: `${eventData.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ]
  };
  
  await sgMail.send(msg);
}

// TreeHole content moderation function
exports.moderateTreeHoleContent = onCall(async (request) => {
  try {
    const { content, userId } = request.data;
    
    if (!content || !userId) {
      throw new Error("Content and userId are required");
    }
    
    logger.info(`Moderating content for user: ${userId}`);
    
    // 1. Basic content preprocessing
    const processedContent = preprocessContent(content);
    
    // 2. AI content analysis using Gemini
    const analysis = await analyzeContentWithGemini(processedContent);
    
    // 3. Risk assessment
    const riskLevel = calculateRiskLevel(analysis);
    
    // 4. Determine action based on risk level
    const result = determineModerationAction(content, riskLevel, analysis);
    
    logger.info(`Content moderation result: ${result.action} for user: ${userId}`);
    
    return result;
  } catch (error) {
    logger.error("Error moderating content:", error);
    throw new Error("Failed to moderate content: " + error.message);
  }
});

// Content preprocessing function
function preprocessContent(content) {
  // Remove extra whitespace and normalize text
  return content.trim().replace(/\s+/g, ' ');
}

// Analyze content using Gemini AI
async function analyzeContentWithGemini(content) {
  try {
    // This would integrate with Gemini AI API
    // For now, we'll implement a basic analysis
    const analysis = {
      hateSpeech: checkHateSpeech(content),
      selfHarm: checkSelfHarm(content),
      inappropriate: checkInappropriateContent(content),
      spam: checkSpam(content),
      sentiment: analyzeSentiment(content)
    };
    
    return analysis;
  } catch (error) {
    logger.error("Error analyzing content with Gemini:", error);
    // Fallback to basic analysis
    return {
      hateSpeech: false,
      selfHarm: false,
      inappropriate: false,
      spam: false,
      sentiment: 'neutral'
    };
  }
}

// Basic content checks (can be enhanced with AI)
function checkHateSpeech(content) {
  const hateKeywords = ['hate', 'kill', 'die', 'stupid', 'ugly', 'worthless'];
  const lowerContent = content.toLowerCase();
  return hateKeywords.some(keyword => lowerContent.includes(keyword));
}

function checkSelfHarm(content) {
  const selfHarmKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living'];
  const lowerContent = content.toLowerCase();
  return selfHarmKeywords.some(keyword => lowerContent.includes(keyword));
}

function checkInappropriateContent(content) {
  const inappropriateKeywords = ['sex', 'nude', 'explicit', 'adult'];
  const lowerContent = content.toLowerCase();
  return inappropriateKeywords.some(keyword => lowerContent.includes(keyword));
}

function checkSpam(content) {
  // Check for excessive repetition or promotional content
  const words = content.split(' ');
  const uniqueWords = new Set(words);
  const repetitionRatio = uniqueWords.size / words.length;
  return repetitionRatio < 0.3 || content.includes('buy now') || content.includes('click here');
}

function analyzeSentiment(content) {
  const positiveWords = ['happy', 'joy', 'love', 'grateful', 'blessed', 'amazing', 'wonderful'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'depressed', 'lonely', 'hurt', 'pain'];
  
  const lowerContent = content.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Calculate risk level based on analysis
function calculateRiskLevel(analysis) {
  let riskScore = 0;
  
  if (analysis.hateSpeech) riskScore += 3;
  if (analysis.selfHarm) riskScore += 4;
  if (analysis.inappropriate) riskScore += 2;
  if (analysis.spam) riskScore += 1;
  if (analysis.sentiment === 'negative') riskScore += 1;
  
  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}

// Determine moderation action based on risk level
function determineModerationAction(content, riskLevel, analysis) {
  switch (riskLevel) {
    case 'high':
      return {
        action: 'rejected',
        reason: 'Content violates community guidelines',
        suggestions: [],
        riskLevel: 'high'
      };
    
    case 'medium':
      return {
        action: 'needs_revision',
        reason: 'Content needs minor adjustments',
        suggestions: generateSuggestions(analysis),
        riskLevel: 'medium'
      };
    
    case 'low':
    default:
      return {
        action: 'approved',
        reason: 'Content meets community standards',
        suggestions: [],
        riskLevel: 'low'
      };
  }
}

// Generate suggestions for content improvement
function generateSuggestions(analysis) {
  const suggestions = [];
  
  if (analysis.hateSpeech) {
    suggestions.push('Please avoid using language that could be hurtful to others');
  }
  if (analysis.selfHarm) {
    suggestions.push('If you\'re struggling, please consider reaching out to a mental health professional');
  }
  if (analysis.inappropriate) {
    suggestions.push('Please keep content appropriate for our community');
  }
  if (analysis.spam) {
    suggestions.push('Please avoid promotional or repetitive content');
  }
  if (analysis.sentiment === 'negative') {
    suggestions.push('Consider sharing your feelings in a constructive way');
  }
  
  return suggestions;
}
