import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

import { useTodoStore } from "@/store/todo-store";
import type { TodoFormValues } from "@/lib/schemas";

import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { TodoForm } from "@/components/todo-form";
import { TodoFilters } from "@/components/todo-filters";
import { TodoList } from "@/components/todo-list";
import { TodoSkeleton } from "@/components/todo-skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function App() {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);

  const addTodo = useTodoStore((s) => s.addTodo);
  const todoCount = useTodoStore((s) => s.todos.length);
  const completedCount = useTodoStore(
    (s) => s.todos.filter((t) => t.completed).length,
  );

  const handleAdd = (values: TodoFormValues) => {
    addTodo({
      title: values.title,
      description: values.description || undefined,
      priority: values.priority,
      category: values.category,
      dueDate: values.dueDate,
    });
    setAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="Todo App Logo" className="h-6 w-6" />
            <h1 className="text-lg font-semibold tracking-tight">
              {t("app.title")}
            </h1>
            {todoCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {t("app.done_count", {
                  completed: completedCount,
                  total: todoCount,
                })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button variant="success" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("button.add_todo")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("form.header_add")}</DialogTitle>
                  <DialogDescription>
                    {t("form.description_add")}
                  </DialogDescription>
                </DialogHeader>
                <TodoForm
                  onSubmit={handleAdd}
                  onCancel={() => setAddOpen(false)}
                  submitLabel={t("button.add")}
                />
              </DialogContent>
            </Dialog>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <TodoFilters />
        <Separator className="my-4" />
        <Suspense fallback={<TodoSkeleton />}>
          <TodoList />
        </Suspense>
      </main>
    </div>
  );
}
