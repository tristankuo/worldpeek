/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

// Load environment variables for local development
dotenv.config();

admin.initializeApp();

// For cost control, set maximum number of containers
setGlobalOptions({maxInstances: 10});

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://worldpeek.web.app",
  "https://worldpeek.firebaseapp.com",
  "https://tristankuo.github.io",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

/**
 * Cloud Function to securely provide Google Maps API key
 * Only accessible from authorized domains
 */
export const getMapConfig = onCall(async (request) => {
  // Get origin from request
  const origin = request.rawRequest.headers.origin || "";

  // Verify request is from an allowed origin
  if (!ALLOWED_ORIGINS.includes(origin)) {
    logger.warn(`Unauthorized origin attempt: ${origin}`);
    throw new Error("Access denied: Invalid origin");
  }

  // Get API key from environment variable
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    logger.error("Google Maps API key not configured");
    throw new Error("API key not configured on server");
  }

  // Log usage for monitoring
  logger.info(`Map config requested from: ${origin}`);

  // Return API key only to authorized requests
  return {apiKey: apiKey};
});
