/**
 * Safe Firebase Client Initializer for FrapperHR / MaxcoHRMS
 * Targets named Firestore Database: `maxco-hr`
 * Strict client-side isolation: Zero Admin credentials exposed.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { firebaseConfig, IS_FIREBASE_CONFIGURED, getMissingClientConfig } from './config';

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

if (typeof window !== 'undefined' && IS_FIREBASE_CONFIGURED) {
  try {
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    // Explicitly bind to named database maxco-hr
    dbInstance = getFirestore(appInstance, firebaseConfig.databaseId);
    googleProviderInstance = new GoogleAuthProvider();
    googleProviderInstance.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.error('Failed to initialize Firebase client SDK:', err);
  }
}

export const firebaseApp = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = googleProviderInstance;
export { IS_FIREBASE_CONFIGURED, getMissingClientConfig };

export type DiagnosticStatus =
  | 'UNCONFIGURED'
  | 'NETWORK_OFFLINE'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'SUCCESS'
  | 'ERROR';

export interface DiagnosticResult {
  status: DiagnosticStatus;
  connected: boolean;
  code?: string;
  message: string;
  databaseId: string;
  projectId: string;
  missingVariables?: string[];
}

/**
 * Validates connection to the named Firestore database maxco-hr.
 * Never writes or mutates data.
 * Clearly separates configuration errors, permission errors, network errors, and successful reads.
 */
export async function testFirestoreConnection(): Promise<DiagnosticResult> {
  const missing = getMissingClientConfig();

  if (missing.length > 0 || !dbInstance) {
    return {
      status: 'UNCONFIGURED',
      connected: false,
      message: `Firebase client is unconfigured. Missing environment variables: ${missing.join(', ')}`,
      databaseId: firebaseConfig.databaseId,
      projectId: firebaseConfig.projectId,
      missingVariables: missing,
    };
  }

  try {
    // Non-destructive probe against the companies collection root
    const probeDoc = await getDocFromServer(doc(dbInstance, 'companies', '_probe_'));
    if (probeDoc.exists()) {
      return {
        status: 'SUCCESS',
        connected: true,
        message: `Successfully connected to named database "${firebaseConfig.databaseId}" and read probe document.`,
        databaseId: firebaseConfig.databaseId,
        projectId: firebaseConfig.projectId,
      };
    } else {
      return {
        status: 'NOT_FOUND',
        connected: true,
        message: `Successfully connected to named database "${firebaseConfig.databaseId}". Server roundtrip confirmed (document not found).`,
        databaseId: firebaseConfig.databaseId,
        projectId: firebaseConfig.projectId,
      };
    }
  } catch (error: unknown) {
    const errObj = error as { code?: string; message?: string };
    const errMessage = errObj.message || String(error);
    const errCode = errObj.code || 'unknown';

    if (errCode === 'permission-denied' || errMessage.toLowerCase().includes('permission')) {
      return {
        status: 'PERMISSION_DENIED',
        connected: false,
        code: errCode,
        message: `Access rejected by Firestore security rules on "${firebaseConfig.databaseId}". Authentication and valid company membership required.`,
        databaseId: firebaseConfig.databaseId,
        projectId: firebaseConfig.projectId,
      };
    }

    if (
      errCode === 'unavailable' ||
      errMessage.toLowerCase().includes('client is offline') ||
      errMessage.toLowerCase().includes('network')
    ) {
      return {
        status: 'NETWORK_OFFLINE',
        connected: false,
        code: errCode,
        message: `Network offline or Firestore backend unreachable. Check internet connectivity.`,
        databaseId: firebaseConfig.databaseId,
        projectId: firebaseConfig.projectId,
      };
    }

    return {
      status: 'ERROR',
      connected: false,
      code: errCode,
      message: `Firestore request failed: ${errMessage}`,
      databaseId: firebaseConfig.databaseId,
      projectId: firebaseConfig.projectId,
    };
  }
}
