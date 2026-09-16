import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AnalyzeInput = z.object({
  imageDataUrl: z
    .string()
    .regex(/^data:image\/(jpeg|jpg|png);base64,[A-Za-z0-9+/=]+$/, "Only JPG, JPEG or PNG images"),
});

const GRADES = ["A+", "A", "B", "C"] as const;

export type ProduceAssessment = {
  produce_name: string;
  grade: (typeof GRADES)[number];
  score: number;
  summary: string;
  defects: string[];
  recommendation: string;
};

const SYSTEM_PROMPT = `You are AURAF, an agricultural visual quality grader.
Look at the photo of a fruit or vegetable and assess only what is visually observable:
colour uniformity, ripeness, shape, size consistency, surface blemishes, bruising, rot, mould, pest damage, freshness of stems/leaves.

Grade scale:
A+ = premium, export/showroom quality, no visible defects
A  = very good, minor cosmetic variation
B  = fair, visible blemishes or uneven ripeness, local market quality
C  = poor, significant damage, rot or spoilage

Write in short, simple sentences a farmer can understand. Never invent lab data, chemicals, or pesticide residue claims.
If the image does not clearly show produce, set produce_name to "Not identified", grade to "C" and explain that a clearer photo is needed.

Reply with ONLY a JSON object:
{"produce_name":string,"grade":"A+"|"A"|"B"|"C","score":number 0-100,"summary":string,"defects":string[],"recommendation":string}`;

export const analyzeProduceImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => AnalyzeInput.parse(data))
  .handler(async ({ data }): Promise<ProduceAssessment> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this app yet.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Assess the visual quality of this produce." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      if (response.status === 429) {
        throw new Error("Too many analyses right now. Please wait a moment and try again.");
      }
      if (response.status === 402 || response.status === 403) {
        throw new Error(
          "AI analysis is temporarily unavailable for this app. The app owner needs to check their AI credits.",
        );
      }
      console.error("AI gateway error", response.status, detail);
      throw new Error("The AI could not analyse this image. Please try again.");
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    const jsonText = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText) as Record<string, unknown>;
    } catch {
      throw new Error("The AI reply could not be read. Please try again.");
    }

    const grade = String(parsed["grade"] ?? "B").toUpperCase();
    const score = Number(parsed["score"]);

    return {
      produce_name: String(parsed["produce_name"] ?? "Not identified").slice(0, 80),
      grade: (GRADES as readonly string[]).includes(grade)
        ? (grade as ProduceAssessment["grade"])
        : "B",
      score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
      summary: String(parsed["summary"] ?? "").slice(0, 600),
      defects: Array.isArray(parsed["defects"])
        ? (parsed["defects"] as unknown[]).map((d) => String(d).slice(0, 120)).slice(0, 8)
        : [],
      recommendation: String(parsed["recommendation"] ?? "").slice(0, 600),
    };
  });
