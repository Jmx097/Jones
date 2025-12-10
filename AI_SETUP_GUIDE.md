# AI Integration Setup Guide

## 🚀 Quick Start

The Ontario Curriculum Workbook Generator now supports **real AI-powered custom worksheet generation** using OpenAI GPT-4, Anthropic Claude, or Google Gemini.

---

## 📋 Prerequisites

1. **API Key** from one of these providers:
   - [OpenAI](https://platform.openai.com/api-keys) - GPT-4
   - [Anthropic](https://console.anthropic.com/) - Claude
   - [Google AI Studio](https://makersuite.google.com/app/apikey) - Gemini

2. **Payment Method** configured (most APIs require billing)

---

## ⚙️ Setup Instructions

### Step 1: Get Your API Key

**OpenAI (Recommended):**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

**Claude:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create new key

**Gemini:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"

### Step 2: Configure the Application

Open `ai-integration.js` and update the configuration:

```javascript
const AI_CONFIG = {
    // Choose your provider
    provider: 'openai',  // or 'claude' or 'gemini'
    
    // Add your API key
    apiKeys: {
        openai: 'sk-your-actual-key-here',  // Replace with your key
        claude: 'YOUR_CLAUDE_API_KEY_HERE',
        gemini: 'YOUR_GEMINI_API_KEY_HERE'
    },
    
    // Optional: Change model
    models: {
        openai: 'gpt-4',  // or 'gpt-3.5-turbo' for cheaper/faster
        claude: 'claude-3-sonnet-20240229',
        gemini: 'gemini-pro'
    }
};
```

### Step 3: Enable AI Integration

Add this line to `index.html` before `script.js`:

```html
<script src="ai-integration.js"></script>
```

### Step 4: Update Custom Worksheet Generator

The custom worksheet generator will automatically use real AI when configured.

---

## 💰 Cost Estimates

### OpenAI GPT-4
- **Input:** $0.03 per 1K tokens
- **Output:** $0.06 per 1K tokens
- **Average worksheet:** ~$0.10-0.30

### OpenAI GPT-3.5-Turbo (Cheaper Alternative)
- **Input:** $0.0015 per 1K tokens
- **Output:** $0.002 per 1K tokens
- **Average worksheet:** ~$0.01-0.03

### Anthropic Claude
- **Input:** $0.015 per 1K tokens
- **Output:** $0.075 per 1K tokens
- **Average worksheet:** ~$0.08-0.25

### Google Gemini
- **Free tier:** 60 requests/minute
- **Paid:** $0.00025 per 1K characters
- **Average worksheet:** ~$0.005-0.01

---

## 🔒 Security Best Practices

### ⚠️ IMPORTANT: Never Commit API Keys to Git

**Current Setup (Development Only):**
- API keys in `ai-integration.js`
- **DO NOT** commit this file with real keys
- Add to `.gitignore`:
  ```
  ai-integration.js
  .env
  ```

### ✅ Production Setup (Recommended)

**Option 1: Environment Variables**
```javascript
const AI_CONFIG = {
    apiKeys: {
        openai: process.env.OPENAI_API_KEY,
        claude: process.env.CLAUDE_API_KEY,
        gemini: process.env.GEMINI_API_KEY
    }
};
```

**Option 2: Backend Proxy (Most Secure)**
```javascript
async function generateWithOpenAI(prompt, grade, subject) {
    // Call your own backend instead of OpenAI directly
    const response = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, grade, subject })
    });
    return await response.json();
}
```

**Option 3: User-Provided Keys**
- Let users enter their own API keys
- Store in localStorage (encrypted)
- Users pay for their own usage

---

## 🎯 Features

### ✅ What's Included

1. **Multi-Provider Support**
   - OpenAI GPT-4 / GPT-3.5
   - Anthropic Claude
   - Google Gemini

2. **Smart Prompt Engineering**
   - Curriculum-aligned content
   - Age-appropriate language
   - Structured JSON output

3. **Rate Limiting**
   - Prevents API overuse
   - Configurable limits

4. **Error Handling**
   - Graceful fallbacks
   - User-friendly error messages

5. **Answer Keys**
   - Automatic generation
   - Step-by-step explanations

6. **Question Variety**
   - Multiple choice
   - Short answer
   - Problem solving
   - Long answer

---

## 📝 Usage Examples

### Example 1: Math Worksheet
```
Description: "Create a Grade 7 math worksheet on solving linear equations with 8 problems of varying difficulty"

AI generates:
- Title: "Solving Linear Equations"
- 8 problems (easy → hard)
- Step-by-step solutions
- Real-world applications
```

### Example 2: Science Worksheet
```
Description: "Grade 6 science worksheet about ecosystems with diagrams and food chain questions"

AI generates:
- Ecosystem concepts
- Food chain problems
- Diagram-based questions
- Answer key with explanations
```

### Example 3: English Worksheet
```
Description: "Grade 8 persuasive writing worksheet with examples and practice prompts"

AI generates:
- Persuasive techniques
- Example arguments
- Writing prompts
- Evaluation rubric
```

---

## 🐛 Troubleshooting

### "API key not configured"
- Check that you've replaced `YOUR_API_KEY_HERE` with your actual key
- Verify the key starts with the correct prefix (sk- for OpenAI)

### "Rate limit exceeded"
- Wait 60 seconds between requests
- Increase `maxRequestsPerMinute` in config

### "API error: 401 Unauthorized"
- API key is invalid
- Check for extra spaces or characters
- Regenerate key if needed

### "API error: 429 Too Many Requests"
- You've exceeded your API quota
- Check your billing/usage limits
- Upgrade your plan or wait

### "Network error"
- Check internet connection
- Verify API endpoint URLs
- Check for CORS issues (use backend proxy)

---

## 🔄 Switching Providers

To switch from OpenAI to Claude:

```javascript
const AI_CONFIG = {
    provider: 'claude',  // Change this
    apiKeys: {
        claude: 'your-claude-key-here'  // Add your key
    }
};
```

To switch to Gemini:

```javascript
const AI_CONFIG = {
    provider: 'gemini',  // Change this
    apiKeys: {
        gemini: 'your-gemini-key-here'  // Add your key
    }
};
```

---

## 📊 Monitoring Usage

### OpenAI
- Dashboard: https://platform.openai.com/usage
- View costs, requests, tokens used

### Claude
- Console: https://console.anthropic.com/
- Monitor API usage and billing

### Gemini
- Google Cloud Console
- Track API calls and quotas

---

## 🚀 Advanced Configuration

### Custom System Prompts

Edit the `systemPrompt` in each provider function:

```javascript
const systemPrompt = `You are an expert Ontario curriculum educator.
Create worksheets that:
- Align with Grade ${grade} expectations
- Include real-world examples
- Use inclusive language
- Provide scaffolding for struggling learners
- Challenge advanced students`;
```

### Adjust Temperature (Creativity)

```javascript
temperature: 0.7  // 0.0 = deterministic, 1.0 = creative
```

### Increase Max Tokens (Longer Worksheets)

```javascript
max_tokens: 3000  // Default: 2000
```

---

## ✅ Testing

1. **Test with Demo Mode First**
   - Keep `YOUR_API_KEY_HERE` to use demo mode
   - Verify UI and workflow

2. **Test with Real API**
   - Add API key
   - Generate simple worksheet
   - Check console for errors
   - Verify output quality

3. **Test Error Handling**
   - Try invalid API key
   - Exceed rate limits
   - Check error messages

---

## 📚 Next Steps

1. ✅ Get API key
2. ✅ Configure `ai-integration.js`
3. ✅ Add script tag to `index.html`
4. ✅ Test with simple worksheet
5. ✅ Monitor costs and usage
6. ✅ Implement backend proxy (production)
7. ✅ Add user authentication (optional)

---

## 🆘 Support

**Issues?**
- Check console for error messages
- Review API provider documentation
- Verify API key and billing status

**Questions?**
- OpenAI: https://help.openai.com/
- Claude: https://docs.anthropic.com/
- Gemini: https://ai.google.dev/docs

---

## 📄 License & Usage

This AI integration is for educational purposes. Ensure compliance with:
- API provider terms of service
- Ontario curriculum copyright
- Student data privacy laws (PIPEDA, FIPPA)

**Do not:**
- Share API keys publicly
- Exceed rate limits
- Use for commercial purposes without proper licensing
