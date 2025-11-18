import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getUserAccent, setUserAccent } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) return NextResponse.json({ accent: null }, { status: 200 })

    const accent = await getUserAccent(userId)
    return NextResponse.json({ accent: accent || null })
  } catch (error) {
    console.error("GET /api/user/accent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { accent } = body
    if (!accent || typeof accent !== "string") {
      return NextResponse.json({ error: "Invalid accent" }, { status: 400 })
    }

    const updated = await setUserAccent(userId, accent)
    return NextResponse.json({ accent: updated?.accent || accent })
  } catch (error) {
    console.error("POST /api/user/accent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
