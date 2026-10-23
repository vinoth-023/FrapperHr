# MaxcoHR foundation

A Next.js + Firebase starter for a multi-tenant HRMS/PWA.

## Requirements
- Node.js 20.9+ (use a supported current LTS)
- npm
- A Firebase project with Authentication, Firestore, and Storage enabled

## Run locally
1. Copy `.env.example` to `.env.local`.
2. Fill in the Firebase Web app configuration.
3. Configure server-only Firebase Admin credentials. For local development, a service account key can be used; keep it out of source control. In production, prefer workload identity/platform secrets.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open `http://localhost:3000` and check `http://localhost:3000/api/health`.

## Firebase setup
- Enable desired Firebase Authentication providers.
- Create the Firestore database.
- Create the Storage bucket.
- Deploy `firestore.rules` and `storage.rules` before connecting real data.
- Keep rules default-deny until each client access path has been security-reviewed.

## Important
This is a foundation scaffold, not a complete HR/payroll product. Authentication UI, tenant provisioning, role enforcement, payroll calculations, and production FCM/PWA service-worker setup are next implementation steps. Do not use real employee/payroll data until security review and tenant-isolation tests pass.
