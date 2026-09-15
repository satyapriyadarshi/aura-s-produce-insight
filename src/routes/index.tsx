import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  CheckCircle2,
  IndianRupee,
  Languages,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import heroImage from "@/assets/hero-farmer.jpg";
import { AurafLogo } from "@/components/auraf-logo";
import { GRADE_MEANING, GradeBadge, type Grade } from "@/components/grade-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURAF — AI-Powered Produce Quality Grading for Farmers" },
      {
        name: "description",
        content:
          "Upload photos of your fruits and vegetables and get an AI visual quality assessment with A+/A/B/C grading in seconds.",
      },
      { property: "og:title", content: "AURAF — AI-Powered Produce Quality Grading" },
      {
        property: "og:description",
        content:
          "Simple, farmer-friendly AI quality grading for fruits and vegetables. Better prices through better decisions.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    icon: Camera,
    title: "1. Take a photo",
    text: "Photograph your fruit or vegetable in daylight, using your phone or camera.",
  },
  {
    icon: Upload,
    title: "2. Upload the images",
    text: "Add one or many photos together. Drag and drop or pick them from your device.",
  },
  {
    icon: Sparkles,
    title: "3. Get your grade",
    text: "AURAF checks colour, ripeness, shape and blemishes, then gives an A+ to C grade.",
  },
];

const BENEFITS = [
  { icon: Zap, title: "Results in seconds", text: "No waiting, no laboratory, no paperwork." },
  {
    icon: IndianRupee,
    title: "Negotiate with confidence",
    text: "Know the visual quality of your lot before you reach the mandi or buyer.",
  },
  {
    icon: Languages,
    title: "Made for farmers",
    text: "Large buttons, simple words and a layout that works on any phone.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    text: "Your photos and reports are private to your own account.",
  },
];

function Landing() {
  return (
    <div className="bg-hero-wash min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <AurafLogo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-6 pb-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pt-14">
        <div className="animate-rise min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI visual quality assessment
          </span>
          <h1 className="mt-5 text-3xl leading-tight font-extrabold text-foreground sm:text-4xl lg:text-5xl">
            AI-Powered Quality Grading for Better Agricultural Decisions.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Upload your fruit or vegetable images and get an AI-powered visual quality assessment in
            seconds.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 rounded-full px-7 text-base">
              <Link to="/register">Analyze Your Produce</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-full bg-card px-7 text-base"
            >
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {["Works on any phone", "Multiple photos at once", "Free to start"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-leaf" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-rise relative min-w-0">
          <img
            src={heroImage}
            width={1280}
            height={960}
            alt="Farmer using the AURAF app to check the quality of tomatoes and vegetables in a field"
            className="w-full rounded-3xl border border-border shadow-lift"
          />
          <div className="surface-card absolute -bottom-6 left-4 hidden items-center gap-3 p-4 sm:flex">
            <GradeBadge grade="A+" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Tomato — Premium</span>
              <span className="block text-xs text-muted-foreground">
                Colour, shape and surface all excellent
              </span>
            </span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">How AURAF works</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Three simple steps. No technical knowledge needed.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.title} className="surface-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold sm:text-3xl">What the grades mean</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(GRADE_MEANING) as Grade[]).map((grade) => (
              <div
                key={grade}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
              >
                <GradeBadge grade={grade} />
                <span className="min-w-0">
                  <span className="block font-semibold">{GRADE_MEANING[grade]}</span>
                  <span className="block text-xs text-muted-foreground">
                    {grade === "A+"
                      ? "Ready for premium buyers"
                      : grade === "A"
                        ? "Strong market quality"
                        : grade === "B"
                          ? "Best for local sale"
                          : "Sell fast or use for processing"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <article key={benefit.title} className="surface-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-soft text-leaf">
                <benefit.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{benefit.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="bg-gradient-primary rounded-3xl p-8 text-primary-foreground shadow-lift sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to check your produce?</h2>
          <p className="mt-2 max-w-xl text-primary-foreground/85">
            Create your free farmer account and run your first quality analysis today.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6 h-13 rounded-full px-7">
            <Link to="/register">Create free account</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <AurafLogo size="sm" />
          <p className="text-xs text-muted-foreground">
            AURAF gives a visual quality assessment only. It does not replace laboratory testing or
            official certification.
          </p>
        </div>
      </footer>
    </div>
  );
}
