import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";

import type { Todo } from "@/types";
import type { TodoFormValues } from "@/lib/schemas";
import { PRIORITY_COLORS, CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/todo-store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TodoForm } from "@/components/todo-form";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(false);
  const { toggleTodo, updateTodo, deleteTodo } = useTodoStore();

  const handleUpdate = (values: TodoFormValues) => {
    updateTodo(todo.id, {
      title: values.title,
      description: values.description || undefined,
      priority: values.priority,
      category: values.category,
      dueDate: values.dueDate,
    });
    setEditOpen(false);
  };

  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <>
      <Card
        className={cn(
          "group relative flex items-start gap-3 p-4 transition-all hover:shadow-md",
          todo.completed && "opacity-60",
        )}
      >
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
          className="mt-1 shrink-0"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
        />

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium leading-tight",
                todo.completed && "line-through text-muted-foreground",
              )}
            >
              {todo.title}
            </span>
          </div>

          {todo.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="secondary"
              className={cn(
                "text-[11px] px-1.5 py-0",
                PRIORITY_COLORS[todo.priority],
              )}
            >
              {t(`priority.${todo.priority}`)}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "text-[11px] px-1.5 py-0",
                CATEGORY_COLORS[todo.category],
              )}
            >
              {t(`category.${todo.category}`)}
            </Badge>
            {todo.dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] text-muted-foreground",
                  isOverdue && "text-destructive font-medium",
                )}
              >
                <CalendarIcon className="h-3 w-3" />
                {format(new Date(todo.dueDate), "MMM d")}
              </span>
            )}
          </div>
        </div>

        {/* Actions – visible on hover */}
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setEditOpen(true)}
            aria-label={t("button.edit")}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => deleteTodo(todo.id)}
            aria-label={t("button.delete")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("form.header_edit")}</DialogTitle>
          </DialogHeader>
          <TodoForm
            defaultValues={todo}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            submitLabel={t("button.save_changes")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
