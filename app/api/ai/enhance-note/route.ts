import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // 1️⃣ Get summary
    const summaryRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: `Summarize this note:\n\n${content}` }),
      }
    );
    const summaryData = await summaryRes.json();
    const summary = summaryData[0]?.summary_text || "No summary generated.";

    // 2️⃣ Get tags
    const tagsRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Extract 5 relevant keywords or tags from this note:\n\n${content}`,
        }),
      }
    );
    const tagsData = await tagsRes.json();
    const tagsText = tagsData[0]?.summary_text || "";
    const tags = tagsText
      .split(/[,\n]/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);

    // 3️⃣ Get takeaways
    const takeawaysRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `List 3 key takeaways from this note:\n\n${content}`,
        }),
      }
    );
    const takeawaysData = await takeawaysRes.json();
    const takeawaysText = takeawaysData[0]?.summary_text || "";
    const takeaways = takeawaysText
      .split(/[\.\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    // 4️⃣ Suggested improvements
    const suggestionsRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Suggest 2-3 improvements to make this note more clear or engaging:\n\n${content}`,
        }),
      }
    );
    const suggestionsData = await suggestionsRes.json();
    const suggestionsText = suggestionsData[0]?.summary_text || "";
    const suggestions = suggestionsText
      .split(/[\.\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({
      summary,
      tags,
      takeaways,
      suggestions,
    });
  } catch (error) {
    console.error("Enhance note error:", error);
    return NextResponse.json({ error: "Failed to enhance note" }, { status: 500 });
  }
}
