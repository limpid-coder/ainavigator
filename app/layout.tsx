import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Navigator | AI Adoption Readiness Platform",
  description: "Assess and accelerate your organization's AI adoption readiness with data-driven insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
