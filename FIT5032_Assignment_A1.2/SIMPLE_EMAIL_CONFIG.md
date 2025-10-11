# Email Setup Guide

## 1. Get SendGrid API Key
- Go to https://sendgrid.com/
- Create account and get API key

## 2. Create .env file
```bash
SENDGRID_API_KEY=your-api-key
FROM_EMAIL=your-email@domain.com
```

## 3. Verify email in SendGrid
- Go to Settings → Sender Authentication
- Verify your email address

## 4. Test
```bash
npm run start
npm run dev
```

Done! Users get welcome emails when they register.
