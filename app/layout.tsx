
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
          <div className="min-h-screen flex flex-col bg-background">
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
