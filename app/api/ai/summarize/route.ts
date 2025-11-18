import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: content }),
      }
    );

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    const summary = result[0]?.summary_text || "No summary generated.";
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summarize error:", error);
    return NextResponse.json(
      { error: "Failed to summarize text" },
      { status: 500 }
    );
  }
}
