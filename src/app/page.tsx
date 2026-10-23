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
  TrendingUp,
  Settings,
  Bell,
  Menu,
  X,
  Plus,
  LogIn,
  LogOut,
  ShieldAlert,
  Lock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { PWAInstallButton } from '../components/pwa-install';
import { ConnectionDiagnostics } from '../components/connection-diagnostics';
import { useAuth } from '../context/auth-context';
import { firebaseConfig } from '../lib/firebase/config';
import type { UserRole, Company } from '../types/hrms';

export default function HRMSHomePage() {
  const {
    user,
    loading,
    isDemoMode,
    activeCompany,
    activeRole,
    accessibleCompanies,
    setActiveCompanyId,
    setActiveRolePreview,
    signInWithGoogle,
    signOut,
    createNewCompany,
    authError,
    clearAuthError,
  } = useAuth();

  const [activeNav, setActiveNav] = useState<'dashboard' | 'employees' | 'attendance' | 'leaves' | 'payroll' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Hydration-safe clock state
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  React.useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // New Company Onboarding Modal State
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [createCompanyLoading, setCreateCompanyLoading] = useState(false);
  const [createCompanyError, setCreateCompanyError] = useState<string | null>(null);

  const handleToggleAttendance = () => {
    if (!checkedIn) {
      setCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setCheckedIn(false);
    }
  };

  const handleCreateCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newCompanyCode.trim()) {
      setCreateCompanyError('Please provide both company name and business code.');
      return;
    }
    setCreateCompanyLoading(true);
    setCreateCompanyError(null);
    const res = await createNewCompany(newCompanyName.trim(), newCompanyCode.trim());
    setCreateCompanyLoading(false);
    if (res.success) {
      setShowCreateCompanyModal(false);
      setNewCompanyName('');
      setNewCompanyCode('');
    } else {
      setCreateCompanyError(res.error || 'Failed to onboard company.');
    }
  };

  // Permission Evaluation Helper
  const isAuthorizedFor = (section: 'payroll' | 'settings' | 'audit') => {
    if (section === 'payroll') {
      return activeRole === 'super_admin' || activeRole === 'company_admin' || activeRole === 'payroll';
    }
    if (section === 'settings') {
      return activeRole === 'super_admin' || activeRole === 'company_admin';
    }
    return true;
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
          <div className="flex items-center justify-between mb-1 px-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Company Tenant
            </label>
            {user && (
              <button
                onClick={() => setShowCreateCompanyModal(true)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-0.5"
                title="Create New Company"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={activeCompany?.id || ''}
              onChange={(e) => setActiveCompanyId(e.target.value)}
              className="w-full appearance-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
            >
              {accessibleCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          {isDemoMode && (
            <div className="mt-1 px-1 flex items-center gap-1 text-[10px] text-amber-400">
              <Info className="w-3 h-3 shrink-0" />
              <span>Previewing Sandbox Seed Data</span>
            </div>
          )}
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
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition ${
              activeNav === 'payroll'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <IndianRupee className="w-4 h-4" />
              <span>Indian Payroll & Taxes</span>
            </div>
            {!isAuthorizedFor('payroll') && <Lock className="w-3 h-3 text-zinc-500" />}
          </button>

          <button
            onClick={() => { setActiveNav('settings'); setSidebarOpen(false); }}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 transition ${
              activeNav === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Company Settings</span>
            </div>
            {!isAuthorizedFor('settings') && <Lock className="w-3 h-3 text-zinc-500" />}
          </button>
        </nav>

        {/* Database & Named Region Badge */}
        <div className="border-t border-zinc-800 p-3 bg-zinc-950/60">
          <div className="rounded-md border border-zinc-800/80 bg-zinc-900/80 p-2.5 text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Named DB</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                maxco-hr
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 truncate">
              {firebaseConfig.projectId}
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
                {activeCompany?.name || 'No Company Selected'}
              </span>
            </div>
          </div>

          {/* Right Header: Role Selector, Diagnostics, PWA Install, User Session */}
          <div className="flex items-center gap-2.5">
            {/* View Role Switcher */}
            <div className="hidden md:flex items-center gap-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] text-zinc-400">Role View:</span>
              <select
                value={activeRole || 'employee'}
                onChange={(e) => setActiveRolePreview(e.target.value as UserRole)}
                className="bg-transparent text-xs font-medium text-zinc-200 outline-hidden cursor-pointer"
              >
                <option value="super_admin" className="bg-zinc-900">Super Admin</option>
                <option value="company_admin" className="bg-zinc-900">Company Admin</option>
                <option value="hr" className="bg-zinc-900">HR Manager</option>
                <option value="manager" className="bg-zinc-900">Manager</option>
                <option value="employee" className="bg-zinc-900">Employee</option>
                <option value="payroll" className="bg-zinc-900">Payroll Admin</option>
              </select>
            </div>

            <ConnectionDiagnostics />
            <PWAInstallButton />

            {/* Authentication Action */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                <div
                  className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white uppercase"
                  title={user.email || 'Authenticated User'}
                >
                  {user.displayName ? user.displayName.slice(0, 2) : (user.email ? user.email.slice(0, 2) : 'US')}
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-800"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {authError && (
            <div className="rounded-lg border border-rose-900/50 bg-rose-950/30 p-3 flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
              <button onClick={clearAuthError} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sandbox Demo Notice Banner */}
          {isDemoMode && (
            <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Sandbox Simulation Mode Active
                    </h2>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      The records below are local demo previews for exploring multi-company workflows. They are NOT live production records and have not altered your database. To create or manage real company data in <code className="text-amber-300 font-mono">maxco-hr</code>, sign in with your Firebase account.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={signInWithGoogle}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500 text-zinc-950 hover:bg-amber-400 transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Connect Firebase Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section: Restricted Access Gate for Unauthorized Roles */}
          {!isAuthorizedFor(activeNav === 'payroll' ? 'payroll' : activeNav === 'settings' ? 'settings' : 'audit') ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 text-center max-w-lg mx-auto my-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800/60 flex items-center justify-center mx-auto text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Access Denied &mdash; Restricted Module</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Your current active role (<span className="text-indigo-400 font-medium capitalize">{activeRole}</span>) does not hold authorization to access <strong>{activeNav.toUpperCase()}</strong> for {activeCompany?.name}.
                </p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-md text-left text-xs space-y-1 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Security Rule Enforced:</span>
                <p className="font-mono text-[11px] text-zinc-300">
                  {activeNav === 'payroll'
                    ? 'hasCompanyRole(companyId, [\'super_admin\', \'company_admin\', \'payroll\'])'
                    : 'hasCompanyRole(companyId, [\'super_admin\', \'company_admin\'])'}
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                To test this view, change the Role View selector in the top bar to <strong>Company Admin</strong> or <strong>Payroll Admin</strong>.
              </p>
            </div>
          ) : (
            <>
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
                  <div className="mt-1 text-[11px] text-zinc-500">Across 6 departments {isDemoMode && '(demo)'}</div>
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
                  <div className="mt-1 text-[11px] text-zinc-500">3 on approved leave {isDemoMode && '(demo)'}</div>
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
                        {mounted && currentTime ? currentTime : '--:--:--'}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        {mounted && currentDate ? currentDate : 'Loading shift time...'}
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

                {/* Indian Statutory Compliance Radar */}
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
                        {activeCompany?.settings.statutoryESIEnabled ? 'Active' : 'Exempt'}
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
                    <span>Company-level data isolation strictly enforced by Firestore rules.</span>
                    <span className="text-indigo-400 font-medium">Audit logs enabled</span>
                  </div>
                </div>
              </div>

              {/* Workforce Directory Preview */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">Workforce Directory</h3>
                      {isDemoMode && (
                        <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded-xs">
                          Demo Preview
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Tenant-isolated employee records for {activeCompany?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!user) {
                        signInWithGoogle();
                      } else {
                        alert(`Add Employee workflow for ${activeCompany?.name}`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Employee</span>
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
                          <div className="text-[11px] text-zinc-500">ananya.s@{activeCompany?.slug || 'company'}.com</div>
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
                          <div className="text-[11px] text-zinc-500">rahul.v@{activeCompany?.slug || 'company'}.com</div>
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
                          <div className="text-[11px] text-zinc-500">vikram.r@{activeCompany?.slug || 'company'}.com</div>
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
            </>
          )}
        </main>
      </div>

      {/* Onboard New Company Modal */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Onboard New Company Tenant</h3>
              </div>
              <button
                onClick={() => setShowCreateCompanyModal(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="mt-4 space-y-3">
              {createCompanyError && (
                <div className="p-2.5 rounded-md bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                  {createCompanyError}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Enterprises Pvt Ltd"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Short Code</label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="e.g. ACM"
                  value={newCompanyCode}
                  onChange={(e) => setNewCompanyCode(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs uppercase font-mono text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Used as employee code prefix and tenant identifier.</span>
              </div>

              <div className="pt-2 text-[11px] text-zinc-400 bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80">
                You will be granted initial <strong>Company Admin</strong> privileges under the bootstrap onboarding security rules.
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateCompanyModal(false)}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCompanyLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition disabled:opacity-50"
                >
                  {createCompanyLoading ? 'Onboarding...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
