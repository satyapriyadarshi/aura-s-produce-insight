import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Analysis History — AURAF" },
      { name: "description", content: "Review every produce quality report you have run." },
      { property: "og:title", content: "Analysis History — AURAF" },
      { property: "og:description", content: "All your past produce quality grades in one place." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="surface-card p-6 sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Analysis history</h1>
      <p className="mt-2 text-muted-foreground">Your past produce quality reports appear here.</p>
    </div>
  );
}
