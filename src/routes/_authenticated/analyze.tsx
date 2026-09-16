import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze Your Produce — AURAF" },
      {
        name: "description",
        content: "Upload one or multiple images of your fruits or vegetables for AI grading.",
      },
      { property: "og:title", content: "Analyze Your Produce — AURAF" },
      {
        property: "og:description",
        content: "Upload produce photos and get an A+/A/B/C visual quality grade.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  return (
    <div className="surface-card p-6 sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Analyze Your Produce</h1>
      <p className="mt-2 text-muted-foreground">
        Upload one or multiple images of your fruits or vegetables.
      </p>
    </div>
  );
}
