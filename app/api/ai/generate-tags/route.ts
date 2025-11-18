import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
        body: JSON.stringify({
          inputs: `Extract 5 short, relevant tags or keywords from the following note. Return them as a comma-separated list:\n\n${content}`,
        }),
      }
    );

    const result = await response.json();

    if (result.error) throw new Error(result.error);

    // The model returns [{ summary_text: "keyword1, keyword2, ..." }]
    const text = result[0]?.summary_text || "";
    const tags = text
      .split(/[,\n]/)
      .map((t: string) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);

    return NextResponse.json({ tags });
  } catch (error: any) {
    console.error("Auto Tags error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate tags" },
      { status: 500 }
    );
  }
}
