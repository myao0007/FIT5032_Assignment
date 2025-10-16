#!/bin/bash

# Security Check Script for SheTalks
# This script checks for potential security issues before committing

echo "🔒 SheTalks Security Check"
echo "=========================="
echo ""

# Check if .env.local exists and is in gitignore
echo "📋 Checking environment file security..."

if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check if .env.local is in gitignore
    if grep -q "\.env\.local" .gitignore; then
        echo "✅ .env.local is in .gitignore"
    else
        echo "❌ WARNING: .env.local is NOT in .gitignore!"
        echo "   Add '.env.local' to .gitignore to prevent accidental commits"
    fi
    
    # Check if .env.local is tracked by git
    if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
        echo "❌ CRITICAL: .env.local is tracked by Git!"
        echo "   Run: git rm --cached .env.local"
        echo "   Then add .env.local to .gitignore"
        exit 1
    else
        echo "✅ .env.local is not tracked by Git"
    fi
else
    echo "⚠️  .env.local file not found"
    echo "   Run ./setup-env.sh to create it"
fi

echo ""

# Check for hardcoded API keys in source code
echo "🔍 Scanning for potential hardcoded API keys..."

# Common API key patterns
PATTERNS=(
    "AIza[0-9A-Za-z_-]{35}"
    "sk-[0-9A-Za-z]{48}"
    "xoxb-[0-9]{11}-[0-9]{11}-[0-9A-Za-z]{24}"
    "AKIA[0-9A-Z]{16}"
    "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
)

FOUND_ISSUES=0

for pattern in "${PATTERNS[@]}"; do
    # Search in source files, excluding node_modules and dist
    # But exclude lines that use environment variables as fallbacks
    if grep -r -E "$pattern" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "import.meta.env" | grep -v "process.env"; then
        echo "❌ Potential hardcoded API key found in source code!"
        echo "   Pattern: $pattern"
        echo "   Make sure to use environment variables instead"
        FOUND_ISSUES=1
    fi
done

if [ $FOUND_ISSUES -eq 0 ]; then
    echo "✅ No hardcoded API keys found in source code"
    echo "   (Fallback values in config files are acceptable)"
fi

echo ""

# Check for environment variable usage
echo "🔧 Checking environment variable usage..."

if grep -r "import.meta.env.VITE_" src/ >/dev/null 2>&1; then
    echo "✅ Environment variables are properly used (import.meta.env.VITE_*)"
else
    echo "⚠️  No environment variables found in source code"
fi

echo ""

# Check git status for sensitive files
echo "📊 Checking Git status for sensitive files..."

SENSITIVE_FILES=(
    ".env"
    ".env.local"
    ".env.production"
    ".env.development"
    "config.json"
    "secrets.json"
)

for file in "${SENSITIVE_FILES[@]}"; do
    # Check if file exists and is tracked by git (not ignored)
    if [ -f "$file" ] && ! git check-ignore "$file" >/dev/null 2>&1; then
        if git status --porcelain | grep -q "$file"; then
            echo "❌ WARNING: $file is staged or modified!"
            echo "   Make sure it's in .gitignore before committing"
        fi
    fi
done

echo ""

# Final security summary
echo "🛡️  Security Check Summary"
echo "=========================="

if [ $FOUND_ISSUES -eq 0 ]; then
    echo "✅ Security check passed!"
    echo "   Your repository appears to be secure"
    echo ""
    echo "💡 Best practices:"
    echo "   - Keep API keys in .env.local only"
    echo "   - Never commit .env files"
    echo "   - Use environment variables in code"
    echo "   - Regularly rotate API keys"
else
    echo "❌ Security issues found!"
    echo "   Please fix the issues above before committing"
    exit 1
fi

echo ""
echo "🔗 For more security information, see GEMINI_AI_SETUP.md"
