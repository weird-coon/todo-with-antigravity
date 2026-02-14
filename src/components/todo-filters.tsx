import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

import { useTodoStore, type FilterStatus } from "@/store/todo-store";
import { PRIORITIES, CATEGORIES } from "@/lib/constants";
import type { Priority, Category } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TodoFilters() {
  const { t } = useTranslation();
  const {
    searchQuery,
    filterPriority,
    filterCategory,
    filterStatus,
    setSearchQuery,
    setFilterPriority,
    setFilterCategory,
    setFilterStatus,
  } = useTodoStore();

  const hasActiveFilters =
    searchQuery ||
    filterPriority !== "all" ||
    filterCategory !== "all" ||
    filterStatus !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPriority("all");
    setFilterCategory("all");
    setFilterStatus("all");
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("filter.search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filterPriority}
          onValueChange={(v) => setFilterPriority(v as Priority | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("form.priority_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.priority_all")}</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {t(`priority.${p.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterCategory}
          onValueChange={(v) => setFilterCategory(v as Category | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("form.category_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.category_all")}</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {t(`category.${c.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as FilterStatus)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.status_all")}</SelectItem>
            <SelectItem value="active">{t("filter.status_active")}</SelectItem>
            <SelectItem value="completed">
              {t("filter.status_completed")}
            </SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs text-muted-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            {t("button.clear_filters")}
          </Button>
        )}
      </div>
    </div>
  );
}
