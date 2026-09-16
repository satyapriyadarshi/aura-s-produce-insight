import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — AURAF" },
      {
        name: "description",
        content: "See your produce quality analyses and start a new AI quality check.",
      },
      { property: "og:title", content: "Farmer Dashboard — AURAF" },
      {
        property: "og:description",
        content: "Track your produce grades and run a new AI quality assessment.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="surface-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, Farmer 👋</h1>
        <p className="mt-2 text-muted-foreground">
          Check the visual quality of your produce using AI.
        </p>
      </div>
    </div>
  );
}
