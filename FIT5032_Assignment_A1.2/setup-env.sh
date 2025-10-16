#!/bin/bash

# SheTalks Environment Setup Script
# This script helps you set up environment variables securely

echo "🚀 SheTalks Environment Setup"
echo "=============================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy template to .env.local
echo "📋 Copying environment template..."
cp env.template .env.local

echo "✅ Created .env.local file"
echo ""

# Get Gemini API key
echo "🔑 Gemini AI API Key Setup"
echo "Get your free API key from: https://makersuite.google.com/app/apikey"
echo ""
read -p "Enter your Gemini API key: " gemini_key

if [ -z "$gemini_key" ]; then
    echo "⚠️  No API key provided. You can add it later to .env.local"
else
    # Replace the placeholder with actual key
    sed -i.bak "s/your-gemini-api-key-here/$gemini_key/" .env.local
    rm .env.local.bak 2>/dev/null || true
    echo "✅ Gemini API key configured"
fi

echo ""
echo "🔧 Optional: SendGrid Configuration"
read -p "Do you want to configure SendGrid email? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your SendGrid API key: " sendgrid_key
    read -p "Enter your email address: " email_address
    
    if [ ! -z "$sendgrid_key" ]; then
        sed -i.bak "s/your-sendgrid-api-key-here/$sendgrid_key/" .env.local
        rm .env.local.bak 2>/dev/null || true
    fi
    
    if [ ! -z "$email_address" ]; then
        sed -i.bak "s/your-email@domain.com/$email_address/" .env.local
        rm .env.local.bak 2>/dev/null || true
    fi
    
    echo "✅ SendGrid configured"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review .env.local file to ensure all values are correct"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit /ai-test to test your Gemini AI integration"
echo ""
echo "🔒 Security reminder:"
echo "- .env.local is already in .gitignore"
echo "- Never commit API keys to Git"
echo "- Keep your API keys private"
echo ""
echo "📚 For more information, see GEMINI_AI_SETUP.md"
