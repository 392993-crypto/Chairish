import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

router.post("/similar-chairs", async (req, res) => {
  const { currentChair, otherChairs } = req.body as {
    currentChair: Record<string, unknown>;
    otherChairs: Record<string, unknown>[];
  };

  if (!currentChair || !otherChairs || otherChairs.length === 0) {
    res.json({ recommendations: [] });
    return;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const chairList = otherChairs.map((c, i) =>
    `[${i}] id="${c.id}" name="${c.name}" brand="${c.brand}" category="${c.categoryId}" tags="${(c.tags as string[] || []).join(", ")}" description="${c.description || ""}"`
  ).join("\n");

  const prompt = `You are a chair recommendation engine. Given the chair a user is currently viewing and a list of other available chairs, pick the best matches (up to 4) and explain each in one short sentence.

CURRENT CHAIR:
- Name: ${currentChair.name}
- Brand: ${currentChair.brand}
- Category: ${currentChair.categoryId}
- Tags: ${(currentChair.tags as string[] || []).join(", ")}
- Description: ${currentChair.description || "None"}

OTHER AVAILABLE CHAIRS:
${chairList}

Respond ONLY with a valid JSON array. No markdown, no explanation outside the JSON. Format:
[{ "chairId": "<id>", "reason": "<one sentence why>" }, ...]

If fewer than 4 chairs are a good match, return only the good ones. If none are a good match, return [].`;

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_completion_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? "[]";
    // Extract JSON array even if the model wraps it in backticks
    const match = raw.match(/\[[\s\S]*\]/);
    const recommendations = match ? JSON.parse(match[0]) : [];
    res.json({ recommendations });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message, recommendations: [] });
  }
});

export default router;
