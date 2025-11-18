"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Pin, PinOff, Edit2 } from "lucide-react"

interface NoteCardProps {
  id: string
  title: string
  content: string
  isPinned: boolean
  tags: string[]
  updatedAt: string
  onDelete: (id: string) => Promise<void>
  onPin: (id: string, isPinned: boolean) => Promise<void>
  onEdit: (id: string) => void
}

export function NoteCard({ id, title, content, isPinned, tags, updatedAt, onDelete, onPin, onEdit }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer w-full h-full" onClick={() => onEdit(id)}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground truncate flex-1 text-sm sm:text-base">{title || "Untitled"}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPin(id, !isPinned)
            }}
            className="text-muted-foreground hover:text-foreground p-1 rounded"
            aria-label={isPinned ? "Unpin" : "Pin"}
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 sm:line-clamp-2">{content || "No content"}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-block px-2 py-1 text-xs sm:text-sm bg-secondary text-secondary-foreground rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">{new Date(updatedAt).toLocaleDateString()}</span>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
              <Edit2 size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
