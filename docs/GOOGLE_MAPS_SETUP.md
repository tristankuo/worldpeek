# Google Maps API Setup Guide

## 🔑 Get Your Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" → "New Project"
   - Name: `WorldPeek` or any name you prefer
   - Click "Create"

3. **Enable Required APIs**
   - Go to: https://console.cloud.google.com/apis/library
   - Search and enable these APIs:
     - ✅ **Maps JavaScript API**
     - ✅ **Geocoding API** (optional, for later)
     - ✅ **Places API** (optional, for search)

4. **Create API Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - Copy the API key

5. **Restrict Your API Key (Important!)**
   - Click on your API key name
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add these referrers:
       ```
       http://localhost:5173/*
       https://worldpeek.web.app/*
       https://tristankuo.github.io/*
       ```
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose only the APIs you enabled above
   - Click "Save"

## 📝 Add API Key to Your Project

1. **Copy `.env.example` to `.env`**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file and add your API key:**
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## 🚀 Test the Map

1. Open http://localhost:5173
2. Click "Explore Map →"
3. You should see:
   - 🗺️ Interactive Google Map
   - 📍 8 sample webcam markers worldwide
   - 🔴 Live status indicators
   - 📹 Click markers to see info windows

## 💰 Pricing Note

Google Maps offers **$200 free credit per month**, which covers:
- ~28,000 map loads/month
- Perfect for development and small-to-medium traffic

## ⚠️ Troubleshooting

**Map not loading?**
- Check console for errors
- Verify API key is correct in `.env`
- Make sure you enabled "Maps JavaScript API"
- Check that HTTP referrers are properly configured

**"This page can't load Google Maps correctly"?**
- Your API key needs to be unrestricted temporarily, or
- Add your domain to HTTP referrers

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Pricing Calculator](https://cloud.google.com/maps-platform/pricing)
