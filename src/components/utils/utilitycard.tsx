"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type UtilityStatus = "stable" | "indev" | "onplan";

type StatusToken = {
  label: string;
  badgeClass: string;
  dotClass: string;
};

const STATUS_TOKENS = {
  stable: {
    label: "Stable",
    badgeClass:
      "border-emerald-400/40 bg-emerald-500/10 text-emerald-500 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
    dotClass: "bg-emerald-500 dark:bg-emerald-300",
  },
  indev: {
    label: "In Development",
    badgeClass:
      "border-amber-400/40 bg-amber-500/10 text-amber-500 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
    dotClass: "bg-amber-500 dark:bg-amber-300",
  },
  onplan: {
    label: "Planned",
    badgeClass:
      "border-sky-400/40 bg-sky-500/10 text-sky-500 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300",
    dotClass: "bg-sky-500 dark:bg-sky-300",
  },
} satisfies Record<UtilityStatus, StatusToken>;

type UtilityCardProps = {
  name: string;
  slug?: string;
  status: UtilityStatus;
  icon: LucideIcon;
  description?: string;
  className?: string;
};

export function UtilityCard({
  name,
  slug,
  status,
  icon: Icon,
  description,
  className,
}: UtilityCardProps) {
  const targetSlug = (slug ?? name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const statusToken = STATUS_TOKENS[status];

  return (
    <Link
      href={`/utils/${encodeURIComponent(targetSlug)}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur transition",
        "hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-xl bg-secondary text-secondary-foreground transition",
            "group-hover:bg-primary/15 group-hover:text-primary",
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            statusToken.badgeClass,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", statusToken.dotClass)} />
          {statusToken.label}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {name}
        </span>
        <span className="text-xs font-medium tracking-wide text-muted-foreground">
          utils/{targetSlug}
        </span>
        {description ? (
          <p className="text-sm text-foreground/80 transition group-hover:text-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
