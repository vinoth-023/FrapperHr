import { NextResponse } from 'next/server';
import { firebaseConfig } from '../../../lib/firebase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FrapperHR / MaxcoHRMS Core API',
    version: '0.1.0',
    firebase: {
      projectId: firebaseConfig.projectId,
      namedDatabase: firebaseConfig.databaseId,
      storageBucket: firebaseConfig.storageBucket,
      storagePrefix: firebaseConfig.storagePrefix,
      clientConfigured: Boolean(firebaseConfig.apiKey && firebaseConfig.appId),
    },
    multiTenant: {
      isolationStrategy: 'tenant_scoped_subcollections',
      statutoryCompliance: ['EPF', 'ESIC', 'PT', 'TDS'],
    },
  });
}
