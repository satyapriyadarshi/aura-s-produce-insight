import { cn } from "@/lib/utils";

export type Grade = "A+" | "A" | "B" | "C";

const STYLES: Record<Grade, string> = {
  "A+": "bg-leaf text-leaf-foreground",
  A: "bg-primary text-primary-foreground",
  B: "bg-warn text-warn-foreground",
  C: "bg-destructive text-destructive-foreground",
};

export const GRADE_MEANING: Record<Grade, string> = {
  "A+": "Premium quality",
  A: "Very good quality",
  B: "Fair quality",
  C: "Poor quality",
};

export function GradeBadge({
  grade,
  className,
  size = "md",
}: {
  grade: Grade;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl font-display font-extrabold shadow-soft",
        STYLES[grade] ?? STYLES.B,
        size === "lg" ? "h-16 w-16 text-2xl" : size === "sm" ? "h-9 w-9 text-sm" : "h-12 w-12 text-lg",
        className,
      )}
      aria-label={`Grade ${grade}`}
    >
      {grade}
    </span>
  );
}
