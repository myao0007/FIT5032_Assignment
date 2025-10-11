// Simple email service
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY || 'your-api-key')

export async function sendWelcomeEmail(email, username) {
  try {
    const msg = {
      to: email,
      from: process.env.VITE_FROM_EMAIL || 'your-email@domain.com',
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
        content: 'VGhpcyBpcyBhIHdlbGNvbWUgZmlsZQ==',
        filename: 'welcome.txt',
        type: 'text/plain'
      }]
    }
    
    await sgMail.send(msg)
    return true
  } catch (error) {
    console.log('Email failed:', error.message)
    return false
  }
}
