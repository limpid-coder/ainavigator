import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: "AI Navigator | Enterprise AI Readiness Platform",
  description: "Enterprise-grade platform for assessing and accelerating AI adoption readiness with data-driven insights",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-black text-white min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
