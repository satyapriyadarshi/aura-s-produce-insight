import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — AURAF" },
      { name: "description", content: "Find buyers for your graded fruits and vegetables." },
      { property: "og:title", content: "Marketplace — AURAF" },
      { property: "og:description", content: "Connect your graded produce with buyers." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  return (
    <div className="surface-card p-6 sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Marketplace</h1>
      <p className="mt-2 text-muted-foreground">
        Buyer listings for your graded produce are coming soon.
      </p>
    </div>
  );
}
