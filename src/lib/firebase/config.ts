/**
 * Firebase Client Configuration with Explicit Named Database and Storage Isolation
 */

export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'maxco-certificate-generator',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'maxco-certificate-generator.firebaseapp.com',
  databaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'maxco-hr',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'maxco-certificate-generator.firebasestorage.app',
  storagePrefix: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_PREFIX || 'maxco-hr/',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
};

export const IS_FIREBASE_CONFIGURED = Boolean(
  firebaseConfig.projectId &&
  firebaseConfig.apiKey &&
  firebaseConfig.databaseId
);
