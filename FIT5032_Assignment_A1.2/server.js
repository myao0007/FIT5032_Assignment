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
                content: 'VGhpcyBpcyBhIHdlbGNvbWUgZmlsZQ==',
                filename: 'welcome.txt',
                type: 'text/plain'
            }]
        };

        await sgMail.send(msg);
        res.json({ success: true, message: 'Email sent!' });

    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});