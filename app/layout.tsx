
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "./providers" // ✅ import
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "AI Notes - Smart Note Taking",
  description: "AI-powered note-taking app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {/* ✅ Wrap all client-side context here */}
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
