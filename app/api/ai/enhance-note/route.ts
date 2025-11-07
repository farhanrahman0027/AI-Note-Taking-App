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

    const { text: enhancement } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `You are a note enhancement assistant. Analyze this note and provide:
1. A brief summary (2-3 sentences)
2. 3-5 relevant tags
3. Key takeaways (if applicable)
4. Suggested improvements to the content

Format your response as JSON with fields: summary, tags (array), takeaways (array), suggestions

Title: ${title}
Content: ${content}`,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse the response
    let parsed = { summary: "", tags: [], takeaways: [], suggestions: [] }
    try {
      parsed = JSON.parse(enhancement)
    } catch {
      parsed = { summary: enhancement, tags: [], takeaways: [], suggestions: [] }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Enhance note error:", error)
    return NextResponse.json({ error: "Failed to enhance note" }, { status: 500 })
  }
}
