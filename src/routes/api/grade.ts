import { createFileRoute } from "@tanstack/react-router";

const GRADE_WEBHOOK_URL = "https://satyapriya3456.app.n8n.cloud/webhook/grade-image";
const VALID_GRADES = new Set(["A+", "A", "B", "C"]);
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function findOutputText(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = findOutputText(item);
      if (text) return text;
    }
    return undefined;
  }

  if (typeof value !== "object" || value === null) return undefined;

  const record = value as Record<string, unknown>;
  if (record["type"] === "output_text" && typeof record["text"] === "string") {
    return record["text"];
  }

  for (const nestedValue of Object.values(record)) {
    const text = findOutputText(nestedValue);
    if (text) return text;
  }

  return undefined;
}

function findGrade(value: unknown): string | undefined {
  if (typeof value === "string") {
    const candidate = value
      .trim()
      .toUpperCase()
      .replace(/^["']|["']$/g, "");
    if (VALID_GRADES.has(candidate)) return candidate;

    const match = candidate.match(/(?:^|[\s:{[])(A\+|A|B|C)(?=$|[\s,}\]])/);
    return match?.[1];
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const grade = findGrade(item);
      if (grade) return grade;
    }
    return undefined;
  }

  if (typeof value !== "object" || value === null) return undefined;

  const record = value as Record<string, unknown>;
  for (const key of ["grade", "result", "output", "text"]) {
    const grade = findGrade(record[key]);
    if (grade) return grade;
  }

  return findGrade(findOutputText(value));
}

export const Route = createFileRoute("/api/grade")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const incoming = await request.formData();
        const file = incoming.get("file");

        if (!(file instanceof File)) {
          return Response.json({ error: "An image file is required." }, { status: 400 });
        }
        if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
          return Response.json(
            { error: "Only JPG and PNG images are supported." },
            { status: 400 },
          );
        }
        if (file.size === 0 || file.size > MAX_FILE_SIZE) {
          return Response.json(
            { error: "The image must be between 1 byte and 10 MB." },
            { status: 400 },
          );
        }

        const imageBytes = new Uint8Array(await file.arrayBuffer());

        const response = await fetch(GRADE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": file.type,
            "Content-Length": String(imageBytes.byteLength),
            "X-File-Name": file.name || "produce-image",
          },
          body: imageBytes,
        });

        if (!response.ok) {
          console.error("Grade webhook returned an error:", response.status);
          return Response.json(
            {
              error:
                response.status === 404
                  ? "The grading webhook was not found. Activate the n8n workflow and check its production webhook URL."
                  : `The grading webhook returned HTTP ${response.status}.`,
            },
            { status: 502 },
          );
        }

        const responseText = await response.text();
        let payload: unknown = responseText.trim();
        if (responseText.trim()) {
          try {
            payload = JSON.parse(responseText) as unknown;
          } catch {
            // The webhook may return a plain-text grade.
          }
        }
        const gradeText = findGrade(payload);

        if (!gradeText || !VALID_GRADES.has(gradeText)) {
          console.error("Grade webhook returned an invalid response:", payload);
          return Response.json(
            { error: "The grading service returned an invalid grade." },
            { status: 502 },
          );
        }

        return Response.json({ ok: true, grade: gradeText });
      },
    },
  },
});
