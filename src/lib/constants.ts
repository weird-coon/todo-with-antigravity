import type { Priority, Category } from "@/types";

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health" },
  { value: "other", label: "Other" },
];

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  high: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  work: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  personal: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  shopping: "bg-pink-500/15 text-pink-700 dark:text-pink-400",
  health: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  other: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400",
};
