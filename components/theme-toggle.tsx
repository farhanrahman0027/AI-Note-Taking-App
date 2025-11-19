"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

const ACCENTS = [
  { id: "blue", label: "Blue", className: "accent-blue" },
  { id: "purple", label: "Purple", className: "accent-purple" },
  { id: "teal", label: "Teal", className: "accent-teal" },
]

export function ThemeToggle({ showAccents = true }: { showAccents?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [accent, setAccent] = useState<string>("blue")
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("accent-theme")
    if (stored) {
      applyAccent(stored)
      setAccent(stored)
    }

    // If user is signed in, fetch server-side preference and prefer it over localStorage
    ;(async () => {
      try {
        if (session?.user) {
          const resp = await fetch("/api/user/accent")
          if (resp.ok) {
            const json = await resp.json()
            if (json?.accent) {
              applyAccent(json.accent)
              setAccent(json.accent)
              localStorage.setItem("accent-theme", json.accent)
            }
          }
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  function applyAccent(id: string) {
    const root = document.documentElement
    ACCENTS.forEach((a) => root.classList.remove(a.className))
    const acc = ACCENTS.find((a) => a.id === id)
    if (acc) root.classList.add(acc.className)
    localStorage.setItem("accent-theme", id)
  }

  // Helper to add a temporary class that enables CSS transitions
  function withTransition(cb: () => void) {
    const root = document.documentElement
    root.classList.add("theme-transition")
    try {
      cb()
    } finally {
      window.setTimeout(() => root.classList.remove("theme-transition"), 300)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex items-center gap-3">
      <button
        aria-label="Toggle theme"
        className={cn("p-2 rounded hover:bg-secondary/10")}
        onClick={() => {
          const newTheme = resolvedTheme === "dark" ? "light" : "dark"
          withTransition(() => {
            setTheme(newTheme)
            try {
              const root = document.documentElement
              if (newTheme === "dark") {
                root.classList.add("dark")
              } else {
                root.classList.remove("dark")
              }
              localStorage.setItem("theme", newTheme)
            } catch (e) {
              // ignore
            }
          })
        }}
      >
        {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {showAccents && (
        <div className="flex items-center gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              aria-label={`Accent ${a.label}`}
              onClick={() => {
                setAccent(a.id)
                withTransition(() => applyAccent(a.id))
                // persist to server if logged in
                if (session?.user) {
                  fetch("/api/user/accent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accent: a.id }),
                  }).catch(() => {})
                }
              }}
              className={cn(
                "w-6 h-6 rounded-full border border-border",
                accent === a.id ? "ring-2 ring-offset-1 ring-primary" : ""
              )}
              style={{
                background:
                  a.id === "blue" ? "#2563eb" : a.id === "purple" ? "#7c3aed" : "#0d9488",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
