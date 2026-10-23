# Firestore data model (initial proposal)

Use tenant-scoped collections for tenant-owned records. Every tenant-owned document must include `tenantId` even when nested under a tenant path, so server-side checks and exports can validate ownership consistently.

```text
users/{uid}
  displayName, email, photoURL, createdAt, lastLoginAt

tenants/{tenantId}
  name, slug, status, countryCode, timezone, planId, createdAt, settings

tenants/{tenantId}/members/{uid}
  uid, tenantId, role, status, employeeId, joinedAt

tenants/{tenantId}/departments/{departmentId}
tenants/{tenantId}/designations/{designationId}
tenants/{tenantId}/locations/{locationId}
tenants/{tenantId}/employees/{employeeId}
tenants/{tenantId}/attendanceRecords/{recordId}
tenants/{tenantId}/shiftAssignments/{assignmentId}
tenants/{tenantId}/leaveTypes/{leaveTypeId}
tenants/{tenantId}/leaveBalances/{balanceId}
tenants/{tenantId}/leaveRequests/{requestId}
tenants/{tenantId}/holidays/{holidayId}
tenants/{tenantId}/salaryStructures/{structureId}
tenants/{tenantId}/payrollRuns/{runId}
tenants/{tenantId}/payrollEntries/{entryId}
tenants/{tenantId}/payslips/{payslipId}
tenants/{tenantId}/recruitmentJobs/{jobId}
tenants/{tenantId}/candidates/{candidateId}
tenants/{tenantId}/interviews/{interviewId}
tenants/{tenantId}/performanceCycles/{cycleId}
tenants/{tenantId}/performanceReviews/{reviewId}
tenants/{tenantId}/expenseClaims/{claimId}
tenants/{tenantId}/notifications/{notificationId}
tenants/{tenantId}/auditLogs/{logId}
tenants/{tenantId}/files/{fileId}
```

## Key design constraints

- `users/{uid}` contains identity/profile basics only, not tenant-specific roles.
- A user may belong to multiple tenants; each tenant membership has its own role.
- Do not accept `tenantId`, role, salary, approval status, or payroll totals from the client as trusted values. Derive and validate them server-side.
- Use immutable audit events for approvals, payroll finalization, and permission changes.
- Store timestamps as Firestore `Timestamp`; store money as integer minor units (paise) or a documented decimal strategy. Avoid floating-point money calculations.
- Payroll runs should snapshot the employee salary inputs and rule versions used for the run. Finalized payroll should not silently recalculate.
- Avoid storing Aadhaar/PAN or bank details unless required. Encrypt/restrict sensitive data, limit access, define retention and deletion policies.
- Use deterministic IDs or idempotency keys for scheduled jobs to prevent duplicate payroll or leave-accrual processing.
- Add Firestore composite indexes based on real queries; do not create broad unbounded list reads.
