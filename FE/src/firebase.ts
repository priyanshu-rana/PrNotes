import { initializeApp } from "firebase/app";
import {} from "firebase/analytics";
import { getStorage } from "firebase/storage";
const env = process.env;
const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
