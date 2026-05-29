import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

router.post("/ergo-match", async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
  const { chair, userProfile } = req.body as {
    chair: Record<string, unknown>;
    userProfile: Record<string, unknown>;
  };

  if (!chair || !userProfile) {
    res.status(400).json({ error: "Missing chair or userProfile in request body." });
    return;
  }

  const prompt = `You are a sharp ergonomics analyst. Be concise — no filler, no padding.

CHAIR: ${chair.name ?? "Unknown"} by ${chair.brand ?? "Unknown"} | Category: ${chair.categoryId ?? "?"} | Tags: ${Array.isArray(chair.tags) ? (chair.tags as string[]).join(", ") : "none"} | "${chair.description ?? ""}"

USER PROFILE: Height ${userProfile.height ?? "?"}cm, sits ${userProfile.sittingHours ?? "?"}h/day, posture: ${userProfile.posture ?? "?"}, desk: ${userProfile.deskType ?? "?"}, use: ${userProfile.chairUse ?? "?"}, support: ${userProfile.lumbarPref ?? "?"}, material: ${userProfile.material ?? "?"}, aesthetic: ${userProfile.aesthetic ?? "?"}, priority: ${userProfile.priority ?? "?"}

Give an Ergo-Match in exactly 3 short paragraphs:
1. Score (X/10) + one-sentence verdict.
2. Body & habit fit — 2-3 sentences max.
3. Style & priority fit + one honest caveat — 2-3 sentences max.

No intro, no sign-off. Start directly with the score.`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_completion_tokens: 350,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
