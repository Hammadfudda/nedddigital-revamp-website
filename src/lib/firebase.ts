import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Firebase web config values are publishable; they're read from VITE_ env vars.
const config = {
  apiKey: import.meta.env['VITE_FIREBASE_API_KEY'] as string | undefined,
  authDomain: (import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'] as string | undefined) ??
    (import.meta.env['VITE_FIREBASE_PROJECT_ID'] ? `${import.meta.env['VITE_FIREBASE_PROJECT_ID']}.firebaseapp.com` : undefined),
  projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'] as string | undefined,
  storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'] as string | undefined,
  messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'] as string | undefined,
  appId: import.meta.env['VITE_FIREBASE_APP_ID'] as string | undefined,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
function getApp(): FirebaseApp {
  if (!firebaseConfigured) throw new Error("Firebase is not configured");
  app ??= getApps()[0] ?? initializeApp(config as FirebaseOptions);
  return app;
}

export const getDb = (): Firestore => getFirestore(getApp());
export const getFirebaseAuth = (): Auth => getAuth(getApp());
export const CONTACT_COLLECTION = "contact_submissions";
