"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Tag } from "lucide-react"

interface AIToolbarProps {
  content: string
  title: string
  onSummarize: (summary: string) => void
  onTagsGenerated: (tags: string[]) => void
}

export function AIToolbar({ content, title, onSummarize, onTagsGenerated }: AIToolbarProps) {
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)

  const handleSummarize = async () => {
    if (!content) return

    setIsSummarizing(true)
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const data = await response.json()
        onSummarize(data.summary)
      }
    } catch (error) {
      console.error("Failed to summarize:", error)
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleGenerateTags = async () => {
    if (!content) return

    setIsGeneratingTags(true)
    try {
      const response = await fetch("/api/ai/generate-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const data = await response.json()
        onTagsGenerated(data.tags)
      }
    } catch (error) {
      console.error("Failed to generate tags:", error)
    } finally {
      setIsGeneratingTags(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleSummarize}
        disabled={isSummarizing || !content}
        variant="outline"
        size="sm"
        className="gap-2 bg-transparent"
      >
        {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        Summarize
      </Button>
      <Button
        onClick={handleGenerateTags}
        disabled={isGeneratingTags || !content}
        variant="outline"
        size="sm"
        className="gap-2 bg-transparent"
      >
        {isGeneratingTags ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
        Auto Tags
      </Button>
    </div>
  )
}
