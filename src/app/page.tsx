'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Clock,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Briefcase,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  Bell,
  Menu,
  X,
  Plus,
  LogIn
} from 'lucide-react';
import { PWAInstallButton } from '../components/pwa-install';
import { firebaseConfig } from '../lib/firebase/config';
import type { UserRole, Company } from '../types/hrms';

// Demo tenants for previewing multi-company data isolation
const DEMO_COMPANIES: Company[] = [
  {
    id: 'comp_maxco_01',
    name: 'Maxco Technologies Pvt Ltd',
    slug: 'maxco-tech',
    code: 'MAX-TECH',
    currency: 'INR',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-10-23T00:00:00Z',
    createdBy: 'admin_sys',
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
  },
  {
    id: 'comp_apex_02',
    name: 'Apex Digital Solutions LLP',
    slug: 'apex-digital',
    code: 'APX-SOL',
    currency: 'INR',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-10-23T00:00:00Z',
    createdBy: 'admin_sys',
    status: 'active',
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

export default function HRMSHomePage() {
  const [activeCompany, setActiveCompany] = useState<Company>(DEMO_COMPANIES[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('company_admin');
  const [activeNav, setActiveNav] = useState<'dashboard' | 'employees' | 'attendance' | 'leaves' | 'payroll' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleToggleAttendance = () => {
    if (!checkedIn) {
      setCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setCheckedIn(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg shadow-sm">
              F
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-white">FrapperHR</span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-400">Maxco HRMS</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-400 hover:text-zinc-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Switcher in Sidebar */}
        <div className="p-3 border-b border-zinc-800/60 bg-zinc-950/40">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 px-1">
            Current Company Tenant
          </label>
          <div className="relative">
            <select
              value={activeCompany.id}
              onChange={(e) => {
                const found = DEMO_COMPANIES.find((c) => c.id === e.target.value);
                if (found) setActiveCompany(found);
              }}
              className="w-full appearance-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
            >
              {DEMO_COMPANIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 text-xs font-medium">
          <button
            onClick={() => { setActiveNav('dashboard'); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition ${
              activeNav === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setActiveNav('employees'); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition ${
              activeNav === 'employees'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Employees & Teams</span>
          </button>

          <button
            onClick={() => { setActiveNav('attendance'); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition ${
              activeNav === 'attendance'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Attendance & Shifts</span>
          </button>

          <button
            onClick={() => { setActiveNav('leaves'); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition ${
              activeNav === 'leaves'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Leave Management</span>
          </button>

          <button
            onClick={() => { setActiveNav('payroll'); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition ${
              activeNav === 'payroll'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Indian Payroll & Taxes</span>
          </button>

          <button
            onClick={() => { setActiveNav('settings'); setSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition ${
              activeNav === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Company Settings</span>
          </button>
        </nav>

        {/* Database & Named Region Badge */}
        <div className="border-t border-zinc-800 p-3 bg-zinc-950/60">
          <div className="rounded-md border border-zinc-800/80 bg-zinc-900/80 p-2.5 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Firestore Named DB</span>
            </div>
            <div className="font-mono text-[10px] text-indigo-300 truncate">
              {firebaseConfig.databaseId}
            </div>
            <div className="text-[10px] text-zinc-500 truncate">
              Project: {firebaseConfig.projectId}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 sm:px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-400 hover:text-zinc-100 lg:hidden p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Tenant:</span>
              <span className="font-medium text-xs text-white bg-zinc-800 px-2 py-0.5 rounded-sm">
                {activeCompany.name}
              </span>
            </div>
          </div>

          {/* Right Header: Role selector preview, PWA Install, Notifications */}
          <div className="flex items-center gap-3">
            {/* Role switch preview for demonstrating RBAC */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] text-zinc-400">View as:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-medium text-zinc-200 outline-hidden cursor-pointer"
              >
                <option value="super_admin" className="bg-zinc-900">Super Admin</option>
                <option value="company_admin" className="bg-zinc-900">Company Admin</option>
                <option value="hr" className="bg-zinc-900">HR Manager</option>
                <option value="manager" className="bg-zinc-900">Team Manager</option>
                <option value="employee" className="bg-zinc-900">Employee</option>
                <option value="payroll" className="bg-zinc-900">Payroll Admin</option>
              </select>
            </div>

            <PWAInstallButton />

            <button
              className="relative p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-800"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-semibold text-white">
                VA
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Status Alert Banner */}
          <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    FrapperHR Core Foundation Active & Isolated
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Configured for Cloud Firestore named database <code className="text-indigo-300 font-mono">maxco-hr</code> in project <code className="text-indigo-300 font-mono">maxco-certificate-generator</code>. Storage prefix restricted to <code className="text-indigo-300 font-mono">maxco-hr/</code>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tenant Scope: {activeCompany.code}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Total Workforce</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">48</span>
                <span className="text-xs text-emerald-400 font-medium">+3 this month</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">Across 6 departments</div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Today&apos;s Attendance</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">94%</span>
                <span className="text-xs text-zinc-400">45 present</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">3 on approved leave</div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Pending Leave Requests</span>
                <CalendarDays className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">4</span>
                <span className="text-xs text-amber-400 font-medium">Needs review</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">Manager approval required</div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Next Payroll Run</span>
                <IndianRupee className="w-4 h-4 text-sky-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">₹ 28.4L</span>
                <span className="text-xs text-zinc-400">Estimated Gross</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">PF & ESI statutory auto-calc</div>
            </div>
          </div>

          {/* Action Center & Attendance Punch Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employee Quick Punch Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    Quick Attendance Punch
                  </h3>
                  <span className="text-[11px] text-zinc-400">Shift: 09:30 - 18:00</span>
                </div>
                <div className="my-4 text-center">
                  <div className="text-3xl font-mono font-bold text-white">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  {checkedIn && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Checked in at {checkInTime}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleToggleAttendance}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition shadow-sm ${
                  checkedIn
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {checkedIn ? 'Check Out / End Shift' : 'Check In / Start Shift'}
              </button>
            </div>

            {/* Indian Statutory Compliance Overview */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 lg:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Indian Statutory Compliance Radar
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Automated payroll contribution calculations</p>
                </div>
                <span className="text-xs font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-1 rounded-sm">
                  FY 2026–27
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <div className="text-xs text-zinc-400 font-medium">EPF (12%)</div>
                  <div className="text-sm font-bold text-white mt-1">Active</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Employee 12% + Employer 12% (3.67% PF + 8.33% EPS)</div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <div className="text-xs text-zinc-400 font-medium">ESIC (4%)</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {activeCompany.settings.statutoryESIEnabled ? 'Active' : 'Exempt'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Gross &le; ₹21,000 (0.75% Emp + 3.25% Empr)</div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <div className="text-xs text-zinc-400 font-medium">Prof. Tax (PT)</div>
                  <div className="text-sm font-bold text-white mt-1">Active</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">State slab monthly deduction</div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <div className="text-xs text-zinc-400 font-medium">TDS / Form 16</div>
                  <div className="text-sm font-bold text-white mt-1">Active</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Section 192 Tax Withholding</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>Multi-company isolation guarantees zero cross-tenant contamination.</span>
                <span className="text-indigo-400 font-medium">Audit logs enabled</span>
              </div>
            </div>
          </div>

          {/* Recent Employees Table Preview */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Workforce Directory Preview</h3>
                <p className="text-xs text-zinc-400">Tenant-isolated employee records</p>
              </div>
              <button
                onClick={() => alert(`Add employee flow for company: ${activeCompany.name}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Employee
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr className="hover:bg-zinc-800/30">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">Ananya Sharma</div>
                      <div className="text-[11px] text-zinc-500">ananya.s@{activeCompany.slug}.com</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">EMP-001</td>
                    <td className="py-3 px-4">Engineering</td>
                    <td className="py-3 px-4">Lead Software Engineer</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium">View Profile</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">Rahul Verma</div>
                      <div className="text-[11px] text-zinc-500">rahul.v@{activeCompany.slug}.com</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">EMP-002</td>
                    <td className="py-3 px-4">Human Resources</td>
                    <td className="py-3 px-4">HR Operations Specialist</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium">View Profile</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">Vikramaditya Roy</div>
                      <div className="text-[11px] text-zinc-500">vikram.r@{activeCompany.slug}.com</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">EMP-003</td>
                    <td className="py-3 px-4">Finance & Accounts</td>
                    <td className="py-3 px-4">Payroll Specialist</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium">View Profile</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
