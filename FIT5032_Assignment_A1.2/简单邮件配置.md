# Simple Email Configuration Guide

## Step 1: Get SendGrid API Key

1. Go to https://sendgrid.com/ and register an account
2. After login, click "Settings" -> "API Keys"
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Update API Key in Code

Open the following files and replace `your-sendgrid-api-key-here` with your real API key:

1. `src/services/emailService.js` line 5
2. `server.js` line 13

## Step 3: Update Sender Email

Replace `noreply@yourdomain.com` with your email in the following files:

1. `src/services/emailService.js` line 12
2. `server.js` line 22

## Step 4: Start Server

```bash
npm run start
```

## Step 5: Test

1. Start frontend: `npm run dev`
2. Register a new user
3. Check if welcome email is received

## That's it!

- Users will automatically receive emails after successful registration
- Email includes a simple text attachment
- If email sending fails, it won't affect user registration
