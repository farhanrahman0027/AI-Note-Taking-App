"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AIToolbar } from "./ai-toolbar"
import { NoteEnhancements } from "./note-enhancements"
import { X, ChevronRight } from "lucide-react"

interface NoteEditorProps {
  noteId?: string
  initialTitle?: string
  initialContent?: string
  initialTags?: string[]
  onSave: (title: string, content: string, tags: string[]) => Promise<void>
  onClose: () => void
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSave,
  onClose,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState(initialTags)
  const [isSaving, setIsSaving] = useState(false)
  const [summary, setSummary] = useState("")
  const [showEnhancements, setShowEnhancements] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(title, content, tags)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <Card className="w-full max-w-full sm:max-w-2xl md:max-w-4xl max-h-[95vh] sm:rounded-lg flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Edit Note</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
            {/* Editor Section */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content">Content</Label>
                  <AIToolbar
                    content={content}
                    title={title}
                    onSummarize={setSummary}
                    onTagsGenerated={(newTags) => {
                      setTags((prev) => {
                        const combined = [...prev, ...newTags]
                        return Array.from(new Set(combined))
                      })
                    }}
                  />
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here..."
                  className="mt-2 min-h-[18rem] sm:min-h-[20rem]"
                />
              </div>

              {summary && (
                <div className="p-4 bg-secondary/50 rounded border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground">{summary}</p>
                </div>
              )}

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Add a tag..."
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                      >
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-foreground">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhancements Sidebar */}
            <div className="md:col-span-1">
              {showEnhancements ? (
                <NoteEnhancements
                  title={title}
                  content={content}
                  onApplyTags={(newTags) => {
                    setTags((prev) => {
                      const combined = [...prev, ...newTags]
                      return Array.from(new Set(combined))
                    })
                  }}
                  onClose={() => setShowEnhancements(false)}
                />
              ) : (
                <Button
                  onClick={() => setShowEnhancements(true)}
                  className="w-full gap-2"
                  variant="outline"
                  disabled={!content}
                >
                  <ChevronRight size={16} />
                  View Enhancements
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t border-border">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
