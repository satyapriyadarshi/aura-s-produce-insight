import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AurafLogo } from "@/components/auraf-logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES, useSession } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to AURAF — Farmer Account" },
      {
        name: "description",
        content: "Log in to AURAF to analyse your produce quality and view your past reports.",
      },
      { property: "og:title", content: "Log in to AURAF" },
      { property: "og:description", content: "Access your AURAF farmer dashboard." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState("en");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      identifier: String(form.get("identifier") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});

    const isEmail = parsed.data.identifier.includes("@");
    if (!isEmail) {
      setErrors({
        identifier: "Please log in with the email address you registered with.",
      });
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.identifier.toLowerCase(),
      password: parsed.data.password,
    });
    setBusy(false);

    if (error) {
      toast.error("We could not log you in. Please check your email and password.");
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in did not work. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleForgotPassword() {
    const email = window.prompt("Enter your registered email address");
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error("We could not send the reset link. Please try again.");
    else toast.success("Password reset link sent. Please check your email.");
  }

  return (
    <div className="bg-hero-wash flex min-h-screen flex-col">
      <div className="mx-auto grid w-full max-w-md flex-1 place-items-center px-4 py-8">
        <div className="animate-rise w-full">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link to="/">
              <AurafLogo />
            </Link>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px]" aria-label="Choose language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="surface-card p-6 sm:p-8">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Log in to check the quality of your produce.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or mobile number</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  autoComplete="username"
                  placeholder="farmer@example.com"
                  className="h-12"
                />
                {errors["identifier"] ? (
                  <p className="text-sm text-destructive">{errors["identifier"]}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors["password"] ? (
                  <p className="text-sm text-destructive">{errors["password"]}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox name="remember" defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" size="lg" className="h-13 w-full rounded-full" disabled={busy}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Log in"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-full"
              onClick={handleGoogle}
            >
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
