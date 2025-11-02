# OpenAI API Setup Guide

## 🎯 Purpose
AI Navigator uses OpenAI's GPT-4 to generate intelligent insights from your assessment data. This guide helps you configure the API key.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Log in or create an OpenAI account
3. Click **"Create new secret key"**
4. Name it "AI Navigator" 
5. Copy the key (starts with `sk-...`)
   - ⚠️ **Important:** Save it now! You can't view it again later

### Step 2: Add to Your Project

#### Option A: Create `.env.local` file (Recommended)
```bash
# In your project root directory, create .env.local
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env.local
```

#### Option B: Use Environment Variables
```bash
# On Windows PowerShell
$env:OPENAI_API_KEY="sk-your-actual-key-here"

# On macOS/Linux
export OPENAI_API_KEY="sk-your-actual-key-here"
```

### Step 3: Restart Dev Server
```bash
# Stop your current server (Ctrl+C)
npm run dev
```

### Step 4: Verify It Works
1. Open http://localhost:3000
2. Navigate to **Sentiment** section
3. Click on heatmap to view analysis
4. You should see real GPT insights (not mock data)
5. Check browser console for "OpenAI API key not configured" warnings (should be gone)

---

## 🎛️ Configuration Options

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional - Choose GPT model (default: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini

# Other options:
# OPENAI_MODEL=gpt-4o          # Latest GPT-4, more capable
# OPENAI_MODEL=gpt-4-turbo     # Fast GPT-4
# OPENAI_MODEL=gpt-3.5-turbo   # Cheaper, less capable
```

### Model Recommendations

| Model | Speed | Quality | Cost | Recommended For |
|-------|-------|---------|------|-----------------|
| **gpt-4o-mini** | ⚡⚡⚡ Fast | ⭐⭐⭐ Good | 💰 Cheap | **Production** (Default) |
| **gpt-4o** | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Excellent | 💰💰💰 Expensive | High-quality demos |
| **gpt-4-turbo** | ⚡⚡⚡ Fast | ⭐⭐⭐⭐ Great | 💰💰 Moderate | Good balance |
| **gpt-3.5-turbo** | ⚡⚡⚡⚡ Very Fast | ⭐⭐ OK | 💰 Very Cheap | Testing only |

**Recommendation:** Use `gpt-4o-mini` for production (default setting) - great quality at low cost.

---

## 📊 What Features Use OpenAI

### 1. **Sentiment Analysis** (`/api/gpt/analyze`)
- **Input:** Lowest-scoring sentiment cells
- **Output:** 3-5 problem categories with descriptions
- **Example:** "The Opaque AI" - trust issues around transparency
- **Average Cost:** ~$0.02 per analysis

### 2. **Interventions** (`/api/gpt/interventions`)
- **Input:** A problem category
- **Output:** 3 actionable recommendations
- **Example:** "Launch AI Transparency Workshops"
- **Average Cost:** ~$0.03 per category

### 3. **Open-Ended Summaries** (`/api/gpt/summary`)
- **Input:** Employee text responses
- **Output:** Synthesized insights and themes
- **Example:** Key achievements, challenges, milestones
- **Average Cost:** ~$0.01-0.05 per summary (depends on response count)

### 4. **Executive Summaries** (`/api/gpt/summary`)
- **Input:** Full sentiment + capability data
- **Output:** Board-ready executive summary
- **Example:** "Your organization shows..."
- **Average Cost:** ~$0.02 per summary

**Total Cost Per Full Analysis:** ~$0.08-0.15 (8-15 cents)

---

## 🛡️ Graceful Fallback System

AI Navigator **automatically falls back to mock data** if:
- ❌ No API key is configured
- ❌ API key is invalid
- ❌ OpenAI service is down
- ❌ Rate limit exceeded

**What this means:**
- ✅ Platform works even without API key (uses demo data)
- ✅ No crashes or errors
- ✅ Perfect for demos and development
- ✅ Console warnings tell you when fallback is active

**Example Console Warning:**
```
⚠️ OpenAI API key not configured, using mock data
```

---

## 🧪 Testing Your Setup

### Test 1: Problem Categories
```bash
# Navigate to Sentiment section
# Click on any cell in heatmap
# Should generate categories in ~10-15 seconds
# Check console for API calls (not "using mock data")
```

### Test 2: Interventions
```bash
# After problem categories load
# Click on any category card
# Should generate 3 interventions
# Check that content is specific to your data
```

### Test 3: Open-Ended Summary
```bash
# Navigate to Capability section
# View open-ended responses summary
# Should synthesize actual survey responses
# Not generic mock data
```

---

## 💰 Cost Management

### Estimated Monthly Costs

| Usage Level | Analyses/Month | Est. Cost |
|-------------|----------------|-----------|
| **Development** | 50 | $5 |
| **Demo/Pilot** | 200 | $20 |
| **Light Production** | 500 | $50 |
| **Heavy Production** | 2000 | $200 |

### Cost-Saving Tips

1. **Use caching** - Results are automatically cached per analysis
2. **Use gpt-4o-mini** - 10x cheaper than gpt-4o, nearly same quality
3. **Limit filters** - Each filter combination = new analysis
4. **Batch uploads** - Process multiple clients at once
5. **Monitor usage** - Check [OpenAI usage dashboard](https://platform.openai.com/usage)

### Set Spending Limits

1. Go to [https://platform.openai.com/account/billing/limits](https://platform.openai.com/account/billing/limits)
2. Set a **monthly budget** (e.g., $50)
3. Set **email alerts** at 50% and 90%
4. Platform will auto-disable key if limit reached

---

## 🚨 Troubleshooting

### Issue: "OpenAI API key not configured"

**Solution:**
```bash
# Check if .env.local exists
ls .env.local

# Check if key is set
cat .env.local | grep OPENAI_API_KEY

# Verify key format (should start with sk-)
# If missing, add it:
echo "OPENAI_API_KEY=sk-your-key-here" >> .env.local

# Restart server
npm run dev
```

### Issue: "API Error: 401 Unauthorized"

**Cause:** Invalid API key

**Solution:**
1. Check key has no extra spaces or quotes
2. Verify key is active on [OpenAI dashboard](https://platform.openai.com/api-keys)
3. Try creating a new key
4. Check organization has billing enabled

### Issue: "API Error: 429 Rate Limit"

**Cause:** Too many requests

**Solution:**
1. Wait 60 seconds and try again
2. Upgrade to [Tier 2+ billing](https://platform.openai.com/account/rate-limits)
3. Use caching (already implemented)
4. Reduce analysis frequency

### Issue: "API Error: 500 Internal Server Error"

**Cause:** OpenAI service issue (rare)

**Solution:**
- Check [OpenAI Status Page](https://status.openai.com/)
- Platform will automatically fall back to mock data
- Try again in 5 minutes

### Issue: Results are too generic/low quality

**Solution:**
1. Upgrade to `gpt-4o` model (in .env.local)
2. Ensure you're sending full data (check network tab)
3. Verify sentiment/capability scores are realistic
4. Check that company context is provided

---

## 📋 Checklist: Is GPT Working?

Run through this checklist:

- [ ] `.env.local` file exists in project root
- [ ] `OPENAI_API_KEY` is set and starts with `sk-`
- [ ] Dev server restarted after adding key
- [ ] No console warnings about "using mock data"
- [ ] Problem categories generate in <20 seconds
- [ ] Content is specific to your data (not generic)
- [ ] Network tab shows `POST /api/gpt/analyze` with 200 status
- [ ] OpenAI usage shows activity at [platform.openai.com/usage](https://platform.openai.com/usage)

---

## 🎓 Learn More

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GPT-4 Models Guide](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

---

## 💡 Pro Tips

1. **Development:** Don't set API key - use mock data (free, fast)
2. **Demo:** Set API key with `gpt-4o-mini` (impressive, cheap)
3. **Production:** Use `gpt-4o-mini` with caching (reliable, scalable)
4. **High-Stakes Demo:** Temporarily use `gpt-4o` (best quality)

5. **Monitor costs:** Check usage weekly during development
6. **Pre-generate:** For demos, run analysis once, screenshot results
7. **Batch processing:** Upload all clients at once to save time
8. **Test with small data:** Use subset of responses during dev

---

**Questions?** Check the console for detailed error messages or create an issue in the repo.

**Ready!** Your AI Navigator is now powered by GPT 🚀


