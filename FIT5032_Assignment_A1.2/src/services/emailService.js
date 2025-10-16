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
        content: 'V2VsY29tZSB0byBTaGVUYWxrcywgQ29tbXVuaXR5IQoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCkFCT1VUIFVTCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpTaGVUYWxrcyBpcyBhIHNhZmUgc3BhY2UgZm9yIHdvbWVuIHRvIHNoYXJlIGVtb3Rpb25zLCBzdG9yaWVzLCBhbmQgcGVyc29uYWwgZ3Jvd3RoIHRocm91Z2g6CgpQT0RDQVNUUwrigKIgRWNob2VzIG9mIEhlciBIZWFydCDigJQgSW50aW1hdGUgc3RvcmllcyBvZiBsb3ZlIGFuZCByZWxhdGlvbnNoaXBzCuKAoiBTb3VsIFNpc3RlcnMgVW5pdGUg4oCUIENvbW11bml0eSBzdXBwb3J0IGFuZCBmcmllbmRzaGlwCuKAoiBCbG9vbSBCZXlvbmQgU2lsZW5jZSDigJQgQnJlYWtpbmcgZnJlZSBmcm9tIHNvY2lldGFsIGV4cGVjdGF0aW9ucwoKVFJFRSBIT0xFClNoYXJlIHlvdXIgdGhvdWdodHMgYW5vbnltb3VzbHkgaW4gYSBqdWRnbWVudC1mcmVlIHpvbmUKCkxJVkUgRVZFTlRTCkpvaW4gb3VyIG1vbnRobHkgd29ya3Nob3BzIGFuZCBtZWRpdGF0aW9uIHNlc3Npb25zCgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKR0VUVElORyBTVEFSVEVECjEuIENvbXBsZXRlIHlvdXIgcHJvZmlsZQoyLiBCcm93c2Ugb3VyIHBvZGNhc3QgZXBpc29kZXMKMy4gU2hhcmUgaW4gdGhlIFRyZWUgSG9sZQo0LiBKb2luIHVwY29taW5nIGV2ZW50cwoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCk5FRUQgSEVMUD8KVmlzaXQgb3VyIEZBUTogaHR0cHM6Ly9zaGV0YWxrcy53ZWIuYXBwL2hlbHAKQ29udGFjdCB1czogc3VwcG9ydEBzaGV0YWxrcy5jb20KClRoYW5rIHlvdSBmb3Igam9pbmluZyBvdXIgY29tbXVuaXR5ISDwn5KWCsKpIDIwMjUgU2hlVGFsa3MgQ29tbXVuaXR5LiBBbGwgcmlnaHRzIHJlc2VydmVkLgo=',
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
