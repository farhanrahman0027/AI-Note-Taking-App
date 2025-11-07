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

    const { title, content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Given the following note, generate 3-5 relevant tags. Return only the tags as a comma-separated list, nothing else.\n\nTitle: ${title}\n\nContent: ${content}`,
      temperature: 0.5,
      maxTokens: 100,
    })

    const tags = text
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    return NextResponse.json({ tags })
  } catch (error) {
    console.error("Generate tags error:", error)
    return NextResponse.json({ error: "Failed to generate tags" }, { status: 500 })
  }
}
