import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/ergo-match", async (req, res) => {
  const { chair, userProfile } = req.body as {
    chair: Record<string, unknown>;
    userProfile: Record<string, unknown>;
  };

  if (!chair || !userProfile) {
    res.status(400).json({ error: "Missing chair or userProfile in request body." });
    return;
  }

  const prompt = `You are an expert ergonomics analyst. Given a specific chair and a user's personal ergo profile, produce a warm, insightful, and honest compatibility analysis.

CHAIR DETAILS:
- Name: ${chair.name ?? "Unknown"}
- Brand: ${chair.brand ?? "Unknown"}
- Category: ${chair.categoryId ?? "Unknown"}
- Tags: ${Array.isArray(chair.tags) ? (chair.tags as string[]).join(", ") : "None"}
- Description: ${chair.description ?? "No description provided"}

USER ERGO PROFILE:
1. Height: ${userProfile.height ?? "Not set"} cm
2. Daily Sitting Time: ${userProfile.sittingHours ?? "Not set"} hours
3. Sitting Posture: ${userProfile.posture ?? "Not set"}
4. Primary Desk Setup: ${userProfile.deskType ?? "Not set"}
5. Main Chair Usage: ${userProfile.chairUse ?? "Not set"}
6. Preferred Support: ${userProfile.lumbarPref ?? "Not set"}
7. Material Focus: ${userProfile.material ?? "Not set"}
8. Aesthetic Taste: ${userProfile.aesthetic ?? "Not set"}
9. Evaluation Priority: ${userProfile.priority ?? "Not set"}

Write a 3–4 paragraph Ergo-Match analysis. Cover:
- Overall compatibility score out of 10 and a one-line verdict
- How well the chair's physical traits match the user's body and habits
- How well it aligns with their style preferences and priorities
- Any honest caveats or trade-offs they should know about

Keep the tone confident and personable — like a knowledgeable friend, not a product manual.`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 1024,
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
