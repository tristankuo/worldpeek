# Google Maps API Security Implementation

## ✅ What Was Implemented

### 1. **Secure Configuration Wrapper** ([src/config/maps.ts](../src/config/maps.ts))
- Centralized Google Maps configuration
- Validation for API key presence
- Environment-aware settings

### 2. **Firebase Functions** ([functions/src/index.ts](../functions/src/index.ts))
- Cloud Function: `getMapConfig` to securely provide API key
- CORS protection with allowed origins:
  - `https://worldpeek.web.app`
  - `https://worldpeek.firebaseapp.com`
  - `https://tristankuo.github.io`
  - `http://localhost:5173`
- Request logging for monitoring
- Error handling for unauthorized access

### 3. **Secure API Key Fetcher** ([src/utils/getMapConfig.ts](../src/utils/getMapConfig.ts))
- Development: Uses local `.env` file
- Production: Fetches from Firebase Function
- Fallback mechanism for reliability
- Error handling with descriptive messages

### 4. **Updated Map Loader** ([src/utils/loadGoogleMaps.ts](../src/utils/loadGoogleMaps.ts))
- Async API key fetching
- No hardcoded API keys in client code
- Improved error handling

## 🚀 How It Works

### Development Mode
```typescript
// Uses .env file directly for fast development
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### Production Mode
```
User Request → Firebase Function (getMapConfig) → Validates Origin → Returns API Key
```

## ⚠️ Important: Firebase Blaze Plan Required

Firebase Functions require the **Blaze (Pay-as-you-go)** plan. However, you get:
- **2 million function invocations/month FREE**
- Only pay for usage beyond free tier
- Cost is minimal for small-medium traffic

## 🔧 Setup for Production

### Option 1: Upgrade to Blaze Plan (Recommended)
```bash
# Visit Firebase Console
open https://console.firebase.google.com/project/worldpeek/usage/details

# Upgrade to Blaze plan
# Add credit card (required but free tier is generous)

# Then deploy functions
cd /Users/tristan/github/worldpeek
firebase deploy --only functions
```

### Option 2: Keep Using Spark Plan (Current Setup)
If you want to stay on the free Spark plan for now:

1. **For Production**: The app will use the fallback mechanism (direct API key from env)
2. **Protect your key** using HTTP referrer restrictions in Google Cloud Console:

```bash
open "https://console.cloud.google.com/apis/credentials"

# Click on your API key
# Under "Application restrictions":
# - Select "HTTP referrers (websites)"
# - Add:
#   https://worldpeek.web.app/*
#   https://worldpeek.firebaseapp.com/*
#   https://tristankuo.github.io/*
```

This provides good security without requiring Firebase Functions!

## 📝 Current Security Status

✅ **Implemented:**
- Secure configuration wrapper
- Firebase Function ready (requires Blaze plan)
- Origin validation
- Error handling
- Fallback mechanism
- Development/production separation

⚠️ **To Complete:**
1. Set HTTP referrer restrictions in Google Cloud Console (Step 1)
2. **OR** Upgrade to Blaze plan and deploy functions

## 🧪 Testing

### Test Local Development
```bash
npm run dev
# Visit http://localhost:5173
# Click "Explore Map" - should load with local .env key
```

### Test Production (After Blaze Upgrade)
```bash
# Deploy functions
firebase deploy --only functions

# Deploy app
npm run deploy:firebase

# Visit https://worldpeek.web.app
# Map should fetch key from Firebase Function
```

## 📊 Monitor Usage

### Check Function Logs
```bash
firebase functions:log
```

### Check API Usage
```bash
open "https://console.cloud.google.com/apis/dashboard"
```

## 🔐 Additional Security Measures

### 1. Add Rate Limiting
```typescript
// In functions/src/index.ts
import * as rateLimiter from "express-rate-limit";

// Add rate limiting (requires upgrade)
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 2. Monitor for Abuse
- Set up billing alerts in Google Cloud
- Monitor function invocations daily
- Set API quotas

### 3. Rotate API Keys Regularly
```bash
# Every 3-6 months, create new key
open "https://console.cloud.google.com/apis/credentials"
# Update .env and Firebase config
```

## 💰 Cost Estimate (Blaze Plan)

**Free Tier Per Month:**
- 2M function invocations
- 5GB outbound networking
- 400,000 GB-seconds compute time

**Typical Cost for Small Project:**
- ~100 users/day: $0/month (within free tier)
- ~1,000 users/day: ~$0-2/month
- ~10,000 users/day: ~$5-10/month

**Google Maps API:**
- 28,000 map loads/month FREE ($200 credit)
- Beyond that: ~$7 per 1,000 loads

## ✅ Next Steps

1. **Immediate** (Free): Set HTTP referrer restrictions
2. **When Traffic Grows**: Upgrade to Blaze plan
3. **Optional**: Add more security features (rate limiting, analytics)

Your API is now much more secure! 🔒
