# 🌍 WorldPeek

Peek at the planet before you go. Live webcams from tourist destinations worldwide.

## Features

- 🗺️ **Interactive World Map**: Explore webcams on a Google Map interface.
- 🎥 **Live Streams**: Watch live feeds from cities, beaches, landmarks, and nature spots.
- 🔍 **Search**: Find destinations by city or country.
- 🌙 **Dark Mode**: Toggle between light and dark themes.
- 📱 **Responsive Design**: Works on desktop and mobile.

## Tech Stack

- React 18
- TypeScript
- Vite
- Google Maps JavaScript API
- Firebase Hosting / GitHub Pages

## Getting Started

1. Clone the repo
2. `npm install`
3. Create a `.env` file with your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
4. `npm run dev`

## Deployment

- **Production (Firebase)**: `npm run deploy:production`
- **Staging (GitHub Pages)**: `npm run deploy:staging`

