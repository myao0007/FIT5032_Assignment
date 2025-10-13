import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-welcome-email', async (req, res) => {
    try {
        const { email, username } = req.body;

        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Welcome to SheTalks!',
            text: `Hi ${username},\n\nWelcome to SheTalks, a place where women share emotions, stories, and growth.\n\nYour account has been successfully created. You can now log in and start exploring our podcasts, the Tree Hole, and the Discover section.\n\n👍 Go to SheTalks: https://shetalks.web.app\n\nThank you for joining our community 💖\n— The SheTalks Team\n\n---\nIf you didn't sign up for this account, please ignore this email.\n© 2025 SheTalks. All rights reserved.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white;">
                    <p>Hi <strong>${username}</strong>,</p>
                    
                    <p>Welcome to <strong>SheTalks</strong>, a place where women share emotions, stories, and growth.</p>
                    
                    <p>Your account has been successfully created. You can now log in and start exploring our podcasts, the Tree Hole, and the Discover section.</p>
                    
                    <p>👍 <a href="https://shetalks.web.app" style="color: #262c67; text-decoration: none;">Go to SheTalks</a></p>
                    
                    <p>Thank you for joining our community 💖<br>
                    — The SheTalks Team</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <p style="font-size: 12px; color: #666;">
                        If you didn't sign up for this account, please ignore this email.<br>
                        © 2025 SheTalks. All rights reserved.
                    </p>
                </div>
            `,
            attachments: [{
                content: 'V2VsY29tZSB0byBTSEUgUG9kY2FzdCBDb21tdW5pdHkhCgo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KQUJPVVQgVVMKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpTSEUgaXMgYSBzYWZlIHNwYWNlIGZvciB3b21lbiB0byBzaGFyZSBlbW90aW9ucywgc3RvcmllcywgYW5kIHBlcnNvbmFsIGdyb3d0aCB0aHJvdWdoOgoK8J+Ome+4jyBQT0RDQVNUUwogICDigKIgRWNob2VzIG9mIEhlciBIZWFydCDigJMgSW50aW1hdGUgc3RvcmllcyBvZiBsb3ZlIGFuZCByZWxhdGlvbnNoaXBzCiAgIOKAoiBTb3VsIFNpc3RlcnMgVW5pdGUg4oCTIENvbW11bml0eSBzdXBwb3J0IGFuZCBmcmllbmRzaGlwCiAgIOKAoiBCbG9vbSBCZXlvbmQgU2lsZW5jZSDigJMgQnJlYWtpbmcgZnJlZSBmcm9tIHNvY2lldGFsIGV4cGVjdGF0aW9ucwoK8J+MsyBUUkVFIEhPTEUKICAgU2hhcmUgeW91ciB0aG91Z2h0cyBhbm9ueW1vdXNseSBpbiBhIGp1ZGdtZW50LWZyZWUgem9uZQoK8J+ThSBMSVZFIEVWRU5UUwogICBKb2luIG91ciBtb250aGx5IHdvcmtzaG9wcyBhbmQgbWVkaXRhdGlvbiBzZXNzaW9ucwoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CkdFVFRJTkcgU1RBUlRFRAo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCjEuIENvbXBsZXRlIHlvdXIgcHJvZmlsZQoyLiBCcm93c2Ugb3VyIHBvZGNhc3QgZXBpc29kZXMKMy4gU2hhcmUgaW4gdGhlIFRyZWUgSG9sZQo0LiBKb2luIHVwY29taW5nIGV2ZW50cwoKPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ck5FRUQgSEVMUD8KPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgpWaXNpdCBvdXIgRkFROiBodHRwczovL3NoZXRhbGtzLndlYi5hcHAvaGVscApDb250YWN0IHVzOiBzdXBwb3J0QHNoZXRhbGtzLmNvbQoKVGhhbmsgeW91IGZvciBqb2luaW5nIG91ciBjb21tdW5pdHkhIPCfkpYKCi0tLQrCqSAyMDI1IFNIRSBQb2RjYXN0IENvbW11bml0eS4gQWxsIHJpZ2h0cyByZXNlcnZlZC4=',
                filename: 'SHE_Community_Guide.txt',
                type: 'text/plain'
            }]
        };

        const result = await sgMail.send(msg);
        console.log('SendGrid response:', result);
        res.json({ success: true, message: 'Email sent!', details: result });

    } catch (error) {
        console.error('SendGrid error:', error);
        res.json({ success: false, error: error.message, details: error });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});