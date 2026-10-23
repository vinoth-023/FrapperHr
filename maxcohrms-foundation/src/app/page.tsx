import { Activity, ArrowUpRight, CalendarDays, Clock3, Users, WalletCards } from "lucide-react";

const stats = [
  { label: "Total employees", value: "—", note: "Connect your first company", icon: Users },
  { label: "Present today", value: "—", note: "Attendance data will appear here", icon: Clock3 },
  { label: "Pending leave requests", value: "—", note: "Approval queue", icon: CalendarDays },
  { label: "Payroll status", value: "Not configured", note: "Set up payroll policies first", icon: WalletCards }
];

const modules = [
  ["People", "Employee directory, departments and designations"],
  ["Attendance", "Daily check-in, shifts, late arrivals and overtime"],
  ["Leave", "Leave policies, balances and approval workflows"],
  ["Payroll", "Salary structures, payroll runs and payslips"],
  ["Recruitment", "Open positions, candidates and interviews"],
  ["Performance", "Goals, reviews and appraisal cycles"],
  ["Expenses", "Claims, receipts and reimbursements"],
  ["Self-service", "Employee profile, requests and documents"]
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px 56px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#5145cd", color: "white", borderRadius: 13, width: 44, height: 44, display: "grid", placeItems: "center", fontWeight: 800 }}>M</div>
          <div><div style={{ fontSize: 20, fontWeight: 800 }}>MaxcoHR</div><div style={{ color: "var(--muted)", fontSize: 12 }}>PEOPLE OPERATIONS</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13 }}><Activity size={17}/> Foundation preview</div>
      </header>

      <section style={{ marginBottom: 28 }}>
        <div style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>WORKSPACE OVERVIEW</div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", letterSpacing: "-1px", margin: "0 0 10px" }}>Your people, in one place.</h1>
        <p style={{ color: "var(--muted)", margin: 0, maxWidth: 680, lineHeight: 1.6 }}>A multi-company HRMS foundation for employee management, attendance, leave, India payroll and employee self-service.</p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 34 }}>
        {stats.map(({ label, value, note, icon: Icon }) => (
          <article key={label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 18, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>{label}</span><Icon size={19} color="#5145cd"/>
            </div>
            <div style={{ fontSize: 25, fontWeight: 800, marginBottom: 7 }}>{value}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>{note}</div>
          </article>
        ))}
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 15 }}>
          <h2 style={{ fontSize: 20, margin: 0 }}>HR modules</h2><span style={{ color: "var(--muted)", fontSize: 12 }}>Implementation roadmap</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
          {modules.map(([name, description], i) => (
            <article key={name} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 16, padding: 18, display: "flex", alignItems: "flex-start", gap: 13 }}>
              <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 12, background: "#f0efff", color: "#5145cd", display: "grid", placeItems: "center", fontWeight: 800 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 750, marginBottom: 6 }}>{name}</div><div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{description}</div></div>
              <ArrowUpRight size={16} color="#9aa1b2"/>
            </article>
          ))}
        </div>
      </section>
      <footer style={{ borderTop: "1px solid var(--border)", marginTop: 34, paddingTop: 18, color: "var(--muted)", fontSize: 12 }}>Foundation scaffold · No real employee or payroll data connected yet.</footer>
    </main>
  );
}
