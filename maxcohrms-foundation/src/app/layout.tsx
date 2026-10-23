import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MaxcoHR | HRMS",
  description: "People operations, attendance, leave and payroll in one workspace.",
  applicationName: "MaxcoHR",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#5145cd",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
