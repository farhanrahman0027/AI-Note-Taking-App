"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-bold text-lg text-foreground">
            AI Notes
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          
          <span className="text-sm text-muted-foreground truncate max-w-40">{session?.user?.name}</span>
          <Button onClick={() => signOut()} variant="outline" size="sm">
            Sign Out
          </Button>
          <ThemeToggle showAccents={false} />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded hover:bg-secondary/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3">
          <div className="flex flex-col gap-2">
            <ThemeToggle showAccents={false} />
            <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
            <Button onClick={() => signOut()} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
