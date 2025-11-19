"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { NoteCard } from "@/components/note-card"
import { NoteEditor } from "@/components/note-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface Note {
  _id: string
  title: string
  content: string
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes()
    }
  }, [status])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
        setFilteredNotes(data)
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
    setFilteredNotes(filtered)
  }, [searchQuery, notes])

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setNotes(notes.filter((n) => n._id !== noteId))
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  const handlePinNote = async (noteId: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !isPinned }),
      })
      if (response.ok) {
        await fetchNotes()
      }
    } catch (error) {
      console.error("Failed to pin note:", error)
    }
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n._id === noteId)
    if (note) {
      setEditingNote(note)
      setEditingNoteId(noteId)
      setIsEditorOpen(true)
    }
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setEditingNoteId(null)
    setIsEditorOpen(true)
  }

  const handleSaveNote = async (title: string, content: string, tags: string[]) => {
    try {
      if (editingNoteId) {
        await fetch(`/api/notes/${editingNoteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags }),
        })
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags }),
        })
      }
      await fetchNotes()
    } catch (error) {
      console.error("Failed to save note:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="app-container py-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-full sm:max-w-md">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0"
            />
          </div>
          <Button onClick={handleCreateNote} size="lg" className="gap-2 w-full sm:w-auto">
            <Plus size={20} />
            New Note
          </Button>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No notes found" : "No notes yet. Create your first note!"}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateNote} variant="outline">
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                id={note._id}
                title={note.title}
                content={note.content}
                isPinned={note.isPinned}
                tags={note.tags}
                updatedAt={note.updatedAt}
                onDelete={handleDeleteNote}
                onPin={handlePinNote}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        )}

        {isEditorOpen && (
          <NoteEditor
            initialTitle={editingNote?.title}
            initialContent={editingNote?.content}
            initialTags={editingNote?.tags}
            onSave={handleSaveNote}
            onClose={() => setIsEditorOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
