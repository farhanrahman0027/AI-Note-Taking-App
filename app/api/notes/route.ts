import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { createNote, getNotesByUser } from "@/lib/db-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notes = await getNotesByUser(userId)

    return NextResponse.json(notes)
  } catch (error) {
    console.error("GET /api/notes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tags = [] } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const noteId = await createNote(userId, {
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      isPinned: false,
    })

    return NextResponse.json({ id: noteId, message: "Note created successfully" }, { status: 201 })
  } catch (error) {
    console.error("POST /api/notes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
