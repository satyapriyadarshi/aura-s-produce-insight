import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — AURAF" },
      { name: "description", content: "View and update your AURAF farmer profile details." },
      { property: "og:title", content: "My Profile — AURAF" },
      { property: "og:description", content: "Your farm location and account details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="surface-card p-6 sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">My profile</h1>
      <p className="mt-2 text-muted-foreground">Your farmer details and farm location.</p>
    </div>
  );
}
