"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-bold text-lg text-foreground">
          AI Notes
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
          <Button onClick={() => signOut()} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
