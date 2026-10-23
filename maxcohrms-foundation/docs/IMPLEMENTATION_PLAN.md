# MaxcoHR implementation plan

## Phase 0 — Foundation
- Next.js + TypeScript scaffold, Firebase client/Admin initialization, environment configuration.
- Deny-by-default Firestore and Storage rules.
- Health endpoint, PWA manifest, initial responsive dashboard.
- CI checks: typecheck, lint, build.

## Phase 1 — Identity and multi-tenancy
- Sign-in, sign-out, password reset, optional Google sign-in.
- Tenant creation/onboarding, invitations, membership management.
- Roles and permissions enforced in server APIs.
- Tenant switcher and company settings.
- Audit log for sensitive changes.

## Phase 2 — Organization and employee directory
- Departments, designations, locations, reporting hierarchy.
- Employee create/edit/archive, employee IDs, document uploads.
- CSV/XLSX import with validation and duplicate handling.
- Search, filters, pagination, export permissions.

## Phase 3 — Attendance and shifts
- Shift policies, check-in/out, daily attendance, corrections, holidays.
- Time zone handling, late/early/absence rules, manager approvals.
- Import/device integration only after the base rules are tested.

## Phase 4 — Leave management
- Leave types, accruals, opening balances, holiday calendars.
- Requests, cancellation, manager/HR approvals, notifications.
- Concurrency-safe balance updates and audit history.

## Phase 5 — India payroll
- Effective-dated salary structures and employee declarations.
- Attendance/leave inputs, earnings, deductions, payroll preview.
- PF, ESI, TDS and other applicable rules as configurable, versioned rules.
- Payslip generation, approval/finalization, payment export and reconciliations.
- Validate calculations with a qualified Indian payroll/tax professional before production.

## Phase 6 — Recruitment, performance and expenses
- Job requisitions, candidates, interview workflow and offers.
- Goals, review cycles, feedback and appraisals.
- Expense claims, receipt uploads, approvals and reimbursement exports.

## Phase 7 — Self-service, FCM and PWA
- Employee profile, attendance, leave, payslips and document access.
- FCM token registration, token revocation, notification preferences.
- Service worker, install prompt UX, offline-safe app shell.
- Never cache payroll or sensitive personal records in public/offline caches.

## Phase 8 — Production hardening
- Automated unit/integration/e2e tests, security review and tenant-isolation tests.
- Rate limits, monitoring, backups, retention policies, disaster recovery.
- Scheduled job retries, idempotency, dead-letter handling and operational alerts.
- Load testing, accessibility review, deployment runbook and incident response.

## Release gate
Do not launch payroll as legally compliant until applicable rules and rates are reviewed for the employee's location, salary, eligibility, tax regime and relevant financial year.
