'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, IS_FIREBASE_CONFIGURED } from '../lib/firebase/client';
import type { UserRole, Company, CompanyMembership } from '../types/hrms';

// Clearly defined mock companies for Sandbox Preview mode
export const SANDBOX_DEMO_COMPANIES: Company[] = [
  {
    id: 'demo_maxco_tech',
    name: '[Sandbox Demo] Maxco Technologies',
    slug: 'maxco-tech-demo',
    code: 'MAX-DEMO',
    currency: 'INR',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-23T00:00:00Z',
    createdBy: 'sandbox_seed',
    status: 'trial',
    settings: {
      statutoryPFEnabled: true,
      statutoryESIEnabled: true,
      statutoryPTEnabled: true,
      statutoryTDSEnabled: true,
      workingDaysPerWeek: 5,
      defaultShiftHours: 8.5,
      fiscalYearStartMonth: 4,
    },
  },
  {
    id: 'demo_apex_solutions',
    name: '[Sandbox Demo] Apex Digital LLP',
    slug: 'apex-digital-demo',
    code: 'APX-DEMO',
    currency: 'INR',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-10-23T00:00:00Z',
    createdBy: 'sandbox_seed',
    status: 'trial',
    settings: {
      statutoryPFEnabled: true,
      statutoryESIEnabled: false,
      statutoryPTEnabled: true,
      statutoryTDSEnabled: true,
      workingDaysPerWeek: 6,
      defaultShiftHours: 8,
      fiscalYearStartMonth: 4,
    },
  },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  activeCompany: Company | null;
  activeRole: UserRole | null;
  accessibleCompanies: Company[];
  setActiveCompanyId: (companyId: string) => void;
  setActiveRolePreview: (role: UserRole) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  createNewCompany: (name: string, code: string) => Promise<{ success: boolean; error?: string }>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to sandbox demo view until user signs in
  const [accessibleCompanies, setAccessibleCompanies] = useState<Company[]>(SANDBOX_DEMO_COMPANIES);
  const [activeCompany, setActiveCompany] = useState<Company | null>(SANDBOX_DEMO_COMPANIES[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('company_admin');
  const [authError, setAuthError] = useState<string | null>(null);

  // Load real user memberships from Firestore when authenticated
  const loadUserMemberships = useCallback(async (firebaseUser: User) => {
    if (!db) return;

    try {
      // 1. Ensure user profile exists in /users/{uid}
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Unnamed User',
          photoURL: firebaseUser.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      // Check if user has real company memberships
      // In production, user companies are queried or read from a user companies subcollection
      // If user has no companies yet, allow them to onboard a new company
      setIsDemoMode(false);
    } catch (err: unknown) {
      console.warn('Firestore user profile sync warning (rules may require initial setup):', err);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAuthError(null);
        await loadUserMemberships(currentUser);
      } else {
        // Return to sandbox demo mode on logout
        setIsDemoMode(true);
        setAccessibleCompanies(SANDBOX_DEMO_COMPANIES);
        setActiveCompany(SANDBOX_DEMO_COMPANIES[0]);
        setActiveRole('company_admin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserMemberships]);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setAuthError('Firebase Authentication is not configured. Please supply NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_APP_ID.');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (auth) {
      await fbSignOut(auth);
    }
    setUser(null);
    setIsDemoMode(true);
    setAccessibleCompanies(SANDBOX_DEMO_COMPANIES);
    setActiveCompany(SANDBOX_DEMO_COMPANIES[0]);
    setActiveRole('company_admin');
  };

  const setActiveCompanyId = (companyId: string) => {
    const found = accessibleCompanies.find((c) => c.id === companyId);
    if (found) {
      setActiveCompany(found);
    }
  };

  const setActiveRolePreview = (role: UserRole) => {
    setActiveRole(role);
  };

  // Safe initial company onboarding flow without circular authorization locks
  const createNewCompany = async (name: string, code: string): Promise<{ success: boolean; error?: string }> => {
    if (!user || !db) {
      return { success: false, error: 'Must be authenticated to create a company.' };
    }

    try {
      const companyId = `comp_${Date.now()}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const companyData: Company = {
        id: companyId,
        name,
        slug,
        code: code.toUpperCase(),
        currency: 'INR',
        countryCode: 'IN',
        timezone: 'Asia/Kolkata',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.uid,
        status: 'active',
        settings: {
          statutoryPFEnabled: true,
          statutoryESIEnabled: true,
          statutoryPTEnabled: true,
          statutoryTDSEnabled: true,
          workingDaysPerWeek: 5,
          defaultShiftHours: 8.5,
          fiscalYearStartMonth: 4,
        },
      };

      // 1. Create company record
      await setDoc(doc(db, 'companies', companyId), companyData);

      // 2. Create initial company_admin membership for the creator (permitted by bootstrap rule)
      const membershipData: CompanyMembership = {
        id: `mem_${user.uid}`,
        companyId,
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Admin',
        role: 'company_admin',
        status: 'active',
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'companies', companyId, 'members', user.uid), membershipData);

      // Add to local state
      const updated = [companyData, ...accessibleCompanies.filter((c) => !c.id.startsWith('demo_'))];
      setAccessibleCompanies(updated);
      setActiveCompany(companyData);
      setActiveRole('company_admin');
      setIsDemoMode(false);

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured: IS_FIREBASE_CONFIGURED,
        isDemoMode,
        setDemoMode: setIsDemoMode,
        activeCompany,
        activeRole,
        accessibleCompanies,
        setActiveCompanyId,
        setActiveRolePreview,
        signInWithGoogle,
        signOut,
        createNewCompany,
        authError,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
