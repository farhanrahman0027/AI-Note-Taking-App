"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"

interface Enhancement {
  summary: string
  tags: string[]
  takeaways: string[]
  suggestions: string[]
}

interface NoteEnhancementsProps {
  title: string
  content: string
  onApplyTags: (tags: string[]) => void
  onClose: () => void
}

export function NoteEnhancements({ title, content, onApplyTags, onClose }: NoteEnhancementsProps) {
  const [enhancement, setEnhancement] = useState<Enhancement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEnhance = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/ai/enhance-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      if (!response.ok) throw new Error("Failed to enhance note")

      const data = await response.json()
      setEnhancement(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles size={20} />
          AI Note Enhancement
        </h3>
        <Button onClick={onClose} variant="ghost" size="sm">
          Close
        </Button>
      </div>

      {!enhancement ? (
        <div className="text-center py-4">
          {error ? (
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          ) : null}
          <Button onClick={handleEnhance} disabled={isLoading || !content} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Enhance This Note
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {enhancement.summary && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Summary</p>
              <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded">{enhancement.summary}</p>
            </div>
          )}

          {enhancement.tags.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Suggested Tags</p>
              <div className="flex flex-wrap gap-2">
                {enhancement.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <Button onClick={() => onApplyTags(enhancement.tags)} size="sm" variant="outline" className="mt-2">
                Apply Tags
              </Button>
            </div>
          )}

          {enhancement.takeaways.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Key Takeaways</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {enhancement.takeaways.map((takeaway, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {enhancement.suggestions.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Suggestions</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {enhancement.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-2">
                    <span>→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleEnhance} variant="outline" className="w-full bg-transparent">
            Enhance Again
          </Button>
        </div>
      )}
    </Card>
  )
}
