import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const userCreationApp = initializeApp(firebaseConfig, "userCreation");

// Note for developer (me lol)
// These are the three pieces the rest of the app will import and use directly:
// auth -> for login/signup
// db -> for reading/writing Firestore data (farms, ponds, readings, etc.)
// storage -> for uploaded files (e.g. generated reports, profile photos)
export const auth = getAuth(app);
export const userCreationAuth = getAuth(userCreationApp);
export const db = getFirestore(app);
export const storage = getStorage(app)
;
export const rtdb = getDatabase(app); //realtimedatabase

export default app;