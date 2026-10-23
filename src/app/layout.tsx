import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'FrapperHR / MaxcoHRMS',
  description: 'Production-oriented multi-company HRMS SaaS inspired by Frappe HR, featuring role-based access, attendance, leave management, and Indian statutory payroll compliance.',
  openGraph: {
    title: 'FrapperHR / MaxcoHRMS',
    description: 'Production-oriented multi-company HRMS SaaS inspired by Frappe HR, featuring role-based access, attendance, leave management, and Indian statutory payroll compliance.',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FrapperHR',
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
