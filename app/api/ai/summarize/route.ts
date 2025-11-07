import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Please summarize the following text in 2-3 sentences:\n\n${content}`,
      temperature: 0.7,
      maxTokens: 200,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Summarize error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
