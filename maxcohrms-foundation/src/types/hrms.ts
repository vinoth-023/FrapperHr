export type TenantRole =
  | "tenant_owner"
  | "hr_admin"
  | "hr_manager"
  | "manager"
  | "employee"
  | "payroll_admin"
  | "recruiter";

export type MembershipStatus = "invited" | "active" | "suspended";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: "trial" | "active" | "suspended" | "cancelled";
  timezone: string;
  countryCode: "IN";
  createdAt: string;
}

export interface TenantMembership {
  tenantId: string;
  uid: string;
  role: TenantRole;
  status: MembershipStatus;
  employeeId?: string;
  createdAt: string;
}
