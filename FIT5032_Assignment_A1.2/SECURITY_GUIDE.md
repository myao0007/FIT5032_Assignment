# 🔒 Security Guide for SheTalks

This guide explains how to securely manage API keys and sensitive information in the SheTalks project.

## 🚨 Important Security Rules

### ❌ NEVER DO THESE:
- ❌ Commit API keys to Git
- ❌ Share API keys in code or documentation
- ❌ Use the same API key for development and production
- ❌ Store API keys in plain text files that are tracked by Git

### ✅ ALWAYS DO THESE:
- ✅ Use environment variables for all API keys
- ✅ Keep `.env.local` file private and local
- ✅ Use different API keys for different environments
- ✅ Regularly rotate your API keys
- ✅ Run security checks before committing

## 🛠️ Quick Setup

### 1. Set up environment variables:
```bash
# Quick setup (recommended)
./setup-env.sh

# Or manual setup
cp env.template .env.local
# Edit .env.local with your actual API keys
```

### 2. Verify security:
```bash
./security-check.sh
```

## 📁 File Structure

```
project/
├── .env.local          # Your actual API keys (NOT in Git)
├── env.template        # Template file (safe to commit)
├── env.example         # Example file (safe to commit)
├── .gitignore          # Ignores .env* files
├── setup-env.sh        # Setup script
└── security-check.sh   # Security verification script
```

## 🔑 Required API Keys

### Gemini AI (Required for AI features)
- **Get from**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Environment variable**: `VITE_GEMINI_API_KEY`
- **Usage**: AI chat, recommendations, TreeHole responses

### Firebase (Optional - has fallback values)
- **Get from**: [Firebase Console](https://console.firebase.google.com/)
- **Environment variables**: `VITE_FIREBASE_*`
- **Usage**: Authentication, database, storage

### SendGrid (Optional - for email features)
- **Get from**: [SendGrid](https://app.sendgrid.com/)
- **Environment variables**: `SENDGRID_API_KEY`, `FROM_EMAIL`
- **Usage**: Welcome emails, notifications

## 🔍 Security Checks

The `security-check.sh` script verifies:

1. **Environment file security**
   - `.env.local` exists and is in `.gitignore`
   - No sensitive files are tracked by Git

2. **Code security**
   - No hardcoded API keys in source code
   - Environment variables are properly used

3. **Git status**
   - No sensitive files are staged for commit

## 🚀 Development Workflow

### Before starting development:
```bash
# 1. Set up environment
./setup-env.sh

# 2. Verify security
./security-check.sh

# 3. Start development
npm run dev
```

### Before committing code:
```bash
# Always run security check
./security-check.sh

# Only commit if security check passes
git add .
git commit -m "Your commit message"
```

## 🏭 Production Deployment

### Environment Variables for Production:
```bash
# Set these in your production environment
VITE_GEMINI_API_KEY=your-production-gemini-key
VITE_FIREBASE_API_KEY=your-production-firebase-key
# ... other production keys
```

### Security Checklist:
- [ ] Use different API keys for production
- [ ] Set up proper environment variables
- [ ] Enable API key restrictions in service consoles
- [ ] Monitor API usage and costs
- [ ] Set up alerts for unusual activity

## 🆘 Troubleshooting

### "API key not configured" error:
1. Check if `.env.local` exists
2. Verify `VITE_GEMINI_API_KEY` is set
3. Restart development server
4. Check browser console for errors

### "Security check failed":
1. Run `./security-check.sh` to see specific issues
2. Fix any hardcoded API keys
3. Ensure `.env.local` is in `.gitignore`
4. Remove any tracked sensitive files

### "AI features not working":
1. Verify API key is valid
2. Check internet connection
3. Check API usage limits
4. Review browser console for errors

## 📚 Additional Resources

- [Gemini AI Setup Guide](GEMINI_AI_SETUP.md)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

## 🔄 Regular Maintenance

### Weekly:
- Check API usage and costs
- Review security logs
- Update dependencies

### Monthly:
- Rotate API keys
- Review and update security rules
- Audit environment variables

### Before major releases:
- Run full security audit
- Test with production-like environment
- Update documentation

---

**Remember: Security is everyone's responsibility!** 🛡️

If you find any security issues, please report them immediately and do not commit sensitive information to the repository.
