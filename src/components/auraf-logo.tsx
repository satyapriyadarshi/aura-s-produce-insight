import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

export function AurafLogo({
  className,
  size = "md",
  showWordmark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const box = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "bg-gradient-primary grid shrink-0 place-items-center rounded-xl text-primary-foreground shadow-soft",
          box,
        )}
      >
        <Leaf className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} strokeWidth={2.4} />
      </span>
      {showWordmark ? (
        <span className="min-w-0">
          <span className={cn("block font-display font-extrabold tracking-tight", text)}>
            AURAF
          </span>
          <span className="block text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            AI Quality Grading
          </span>
        </span>
      ) : null}
    </span>
  );
}
