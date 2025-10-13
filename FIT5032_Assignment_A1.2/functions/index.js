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
      subject: 'Welcome to SHE Podcast Community!',
      text: `Hi ${username}, welcome to our community!`,
      html: `<div>Hi ${username}, welcome to our community!</div>`,
      attachments: [{
        content: 'V2VsY29tZSB0byBTSEUgUG9kY2FzdCBDb21tdW5pdHkhCgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KQUJPVVQgVVMKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpTSEUgaXMgYSBzYWZlIHNwYWNlIGZvciB3b21lbiB0byBzaGFyZSBlbW90aW9ucywgc3RvcmllcywgYW5kIHBlcnNvbmFsIGdyb3d0aCB0aHJvdWdoOgoK8J+Ome+4jyBQT0RDQVNUUwogICDigKIgRWNob2VzIG9mIEhlciBIZWFydCDigJMgSW50aW1hdGUgc3RvcmllcyBvZiBsb3ZlIGFuZCBsb3NzCgogIOKAoiBZb3VyIFN0b3J5IOKAmSBQZXJzb25hbCBncm93dGggYW5kIGVtcG93ZXJtZW50CgogIOKAoiBTaGUgVGFsa3Mg4oCTIENhcmVlciBhbmQgbGlmZSBhZHZpY2UKCvCfjpnvuI8gQ09NTVVOSVRZCgogIOKAoiBGYWNlYm9vayBHcm91cCDigJMgQ29ubmVjdCB3aXRoIG90aGVyIHdvbWVuCgogIOKAoiBEaXNjb3JkIFNlcnZlciDigJMgUmVhbC10aW1lIGNoYXRzCgogIOKAoiBXZWJzaXRlIOKAmSBVcGRhdGVzIGFuZCBldmVudHMKCvCfjpnvuI8gRVZFTlRTCgogIOKAoiBXb3Jrc2hvcHMg4oCTIExlYXJuIG5ldyBza2lsbHMKCuKAoiBOZXR3b3JraW5nIOKAmSBNZWV0IGxpa2UtbWluZGVkIHBlb3BsZQoK4oCiIFNlbWluYXJzIOKAmSBTcGVha2VycyBhbmQgaW5zcGlyYXRpb24KCvCfjpnvuI8gUkVTT1VSQ0VTCgogIOKAoiBQb2RjYXN0IEVwaXNvZGVzIOKAmSBBcmNoaXZlZCBjb250ZW50CgogIOKAoiBCbG9nIFBvc3RzIOKAmSBBcnRpY2xlcyBhbmQgdGlwcyAKCuKAoiBQb2RjYXN0IFNlcmllcyDigJMgVGhlbWF0aWMgY29udGVudAoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CkZPTExPVyBVUyBPTgoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpGYWNlYm9vazogQHRoZXNoZXBvZGNhc3QKQnJvd3NlOiB0aGVzaGVwb2RjYXN0LmNvbQpJbnN0YWdyYW06IEB0aGVzaGVwb2RjYXN0CkRpc2NvcmQ6IGpvaW4gb3VyIGNvbW11bml0eQoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CldFTENPTUUgVE8gT1VSIEZBTUlMWSEKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09',
        filename: 'SHE_Community_Guide.txt',
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
