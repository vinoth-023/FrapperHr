/**
 * FrapperHR / MaxcoHRMS Core Data Models & Type Definitions
 * Designed for Multi-Company Isolation and Strict Role-Based Access Control
 */

export type UserRole =
  | 'super_admin'
  | 'company_admin'
  | 'hr'
  | 'manager'
  | 'employee'
  | 'payroll';

export type MembershipStatus = 'invited' | 'active' | 'suspended';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  isSuperAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  code: string; // e.g., MXC-01
  logoURL?: string;
  domain?: string;
  currency: string; // e.g., INR
  countryCode: 'IN' | string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'active' | 'trial' | 'suspended';
  settings: {
    statutoryPFEnabled: boolean;
    statutoryESIEnabled: boolean;
    statutoryPTEnabled: boolean;
    statutoryTDSEnabled: boolean;
    workingDaysPerWeek: number;
    defaultShiftHours: number;
    fiscalYearStartMonth: number; // 4 for April in India
  };
}

export interface CompanyMembership {
  id: string;
  companyId: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: MembershipStatus;
  employeeId?: string;
  departmentId?: string;
  designationId?: string;
  joinedAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  code: string;
  managerEmployeeId?: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface Designation {
  id: string;
  companyId: string;
  title: string;
  code: string;
  departmentId?: string;
  level: number;
  active: boolean;
  createdAt: string;
}

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type EmploymentStatus = 'probation' | 'active' | 'on_notice' | 'relieved' | 'terminated';

export interface Employee {
  id: string;
  companyId: string;
  uid?: string; // Linked Firebase Auth UID when invited/active
  employeeCode: string; // e.g., EMP001
  firstName: string;
  lastName: string;
  workEmail: string;
  personalEmail?: string;
  phone?: string;
  dateOfBirth?: string;
  dateOfJoining: string;
  departmentId: string;
  departmentName?: string;
  designationId: string;
  designationTitle?: string;
  managerId?: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  profilePhotoURL?: string;
  panNumber?: string; // Masked in client responses unless HR/Admin
  uanNumber?: string;
  esiNumber?: string;
  bankDetails?: {
    accountNumberMasked: string;
    ifscCode: string;
    bankName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'on_leave' | 'holiday' | 'weekend';

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string;
  checkOutTime?: string;
  totalHours: number;
  status: AttendanceStatus;
  source: 'web' | 'mobile_pwa' | 'biometric' | 'manual_override';
  ipAddress?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveType {
  id: string;
  companyId: string;
  name: string; // e.g., Casual Leave, Sick Leave, Earned Leave
  code: string;
  daysAllowedPerYear: number;
  carryForwardAllowed: boolean;
  maxCarryForwardDays: number;
  encashable: boolean;
  requiresApproval: boolean;
}

export interface LeaveBalance {
  id: string;
  companyId: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  year: number;
  allocated: number;
  used: number;
  pending: number;
  available: number;
}

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  createdAt: string;
}

// Indian Statutory Payroll Architecture
export interface SalaryStructure {
  id: string;
  companyId: string;
  name: string;
  basicPercentageOfGross: number; // typically 40% - 50%
  hraPercentageOfBasic: number; // typically 40% non-metro, 50% metro
  pfEmployeePercentage: number; // 12%
  pfEmployerPercentage: number; // 12% (3.67% PF + 8.33% EPS)
  esiEmployeePercentage: number; // 0.75% for gross <= 21,000
  esiEmployerPercentage: number; // 3.25%
  professionalTaxMonthly: number; // typically ₹200 (state specific slab)
  active: boolean;
}

export interface PayrollRun {
  id: string;
  companyId: string;
  month: number; // 1-12
  year: number;
  periodLabel: string; // e.g., "October 2026"
  totalEmployees: number;
  totalGrossPayPaise: number;
  totalDeductionsPaise: number;
  totalNetPayPaise: number;
  status: 'draft' | 'under_review' | 'approved' | 'disbursed';
  processedBy: string;
  processedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  action: string;
  actorUid: string;
  actorEmail: string;
  targetCollection: string;
  targetDocId: string;
  details: Record<string, unknown>;
  timestamp: string;
}
