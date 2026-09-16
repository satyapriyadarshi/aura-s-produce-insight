import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

import { AurafLogo } from "@/components/auraf-logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analyze", label: "Analyze Produce" },
] as const;

export function AppNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="min-w-0">
          <AurafLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" className="ml-1 gap-1.5" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </nav>

        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {open ? (
        <nav className="animate-rise border-t border-border bg-card px-4 pb-4 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-primary" }}
              className="block rounded-xl px-3 py-3 text-base font-medium text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" className="mt-1 w-full justify-start gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
