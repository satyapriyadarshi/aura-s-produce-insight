import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AurafLogo } from "@/components/auraf-logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your AURAF farmer account" },
      {
        name: "description",
        content:
          "Register for a free AURAF account to check the visual quality of your fruits and vegetables with AI.",
      },
      { property: "og:title", content: "Create your AURAF farmer account" },
      {
        property: "og:description",
        content: "Free registration for farmers — AI produce quality grading in seconds.",
      },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    full_name: z.string().trim().min(2, "Please enter your full name"),
    mobile: z.string().trim().regex(/^[0-9]{10}$/, "Enter a 10 digit mobile number"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
    state: z.string().trim().min(2, "Enter your state"),
    district: z.string().trim().min(2, "Enter your district"),
    village: z.string().trim().min(2, "Enter your village"),
    farmer_id: z.string().trim().optional(),
    terms: z.literal("on", { message: "Please accept the Terms & Conditions" }),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

const FIELDS = [
  { name: "full_name", label: "Full name", type: "text", placeholder: "Ramesh Kumar" },
  { name: "mobile", label: "Mobile number", type: "tel", placeholder: "9876543210" },
  { name: "email", label: "Email", type: "email", placeholder: "farmer@example.com" },
  { name: "state", label: "State", type: "text", placeholder: "Maharashtra" },
  { name: "district", label: "District", type: "text", placeholder: "Nashik" },
  { name: "village", label: "Village", type: "text", placeholder: "Ozar" },
  { name: "farmer_id", label: "Farmer ID (optional)", type: "text", placeholder: "Optional" },
] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = Object.fromEntries(form.entries()) as Record<string, string>;

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const v = parsed.data;

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: v.email.toLowerCase(),
      password: v.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: v.full_name,
          mobile: v.mobile,
          state: v.state,
          district: v.district,
          village: v.village,
          farmer_id: v.farmer_id ?? "",
        },
      },
    });
    setBusy(false);

    if (error) {
      toast.error(
        error.message.toLowerCase().includes("already")
          ? "This email is already registered. Please log in instead."
          : "We could not create your account. Please try again.",
      );
      return;
    }

    toast.success("Account created. Welcome to AURAF!");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="bg-hero-wash flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <div className="animate-rise">
          <Link to="/" className="mb-6 inline-block">
            <AurafLogo />
          </Link>

          <div className="surface-card p-6 sm:p-8">
            <h1 className="text-2xl font-bold">Create your farmer account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              It takes a minute. Then you can start checking your produce.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="h-12"
                    />
                    {errors[field.name] ? (
                      <p className="text-sm text-destructive">{errors[field.name]}</p>
                    ) : null}
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
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

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    name="confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-12"
                  />
                  {errors["confirm"] ? (
                    <p className="text-sm text-destructive">{errors["confirm"]}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Checkbox name="terms" className="mt-0.5" /> I accept the Terms &amp; Conditions
                </label>
                {errors["terms"] ? (
                  <p className="text-sm text-destructive">{errors["terms"]}</p>
                ) : null}
              </div>

              <Button type="submit" size="lg" className="h-13 w-full rounded-full" disabled={busy}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
