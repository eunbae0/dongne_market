// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.DONGNE_MARKET_FIREBASE_APIKEY,
  authDomain: process.env.DONGNE_MARKET_AUTH_DOMAIN,
  projectId: process.env.DONGNE_MARKET_PROJECT_ID,
  storageBucket: process.env.DONGNE_MARKET_STORAGE_BUCKET,
  messagingSenderId: process.env.DONGNE_MARKET_MESSAGING_SENDER_ID,
  appId: process.env.DONGNE_MARKET_APP_ID,
  measurementId: process.env.DONGNE_MARKET_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);