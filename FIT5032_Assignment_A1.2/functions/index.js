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
    const { eventData } = request.data;
    
    if (!eventData) {
      throw new Error("Event data is required");
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(eventData);
    
    // Send email
    await sendEmailWithPDF(eventData, pdfBuffer);
    
    return { success: true, message: "PDF sent to email successfully" };
  } catch (error) {
    logger.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF: " + error.message);
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
async function sendEmailWithPDF(eventData, pdfBuffer) {
  const msg = {
    to: 'user@example.com', // Should get real email from user authentication
    from: 'noreply@yourapp.com',
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
