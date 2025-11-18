import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getNoteById, updateNote, deleteNote } from "@/lib/db-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const note = await getNoteById(id, userId)

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("GET /api/notes/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    const updatedNote = await updateNote(id, userId, updates)

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("PATCH /api/notes/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const deletedCount = await deleteNote(id, userId)

    if (deletedCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
