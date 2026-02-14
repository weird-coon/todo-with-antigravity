import { useTranslation } from "react-i18next";
import { ClipboardList } from "lucide-react";

import { useFilteredTodos } from "@/store/todo-store";
import { TodoItem } from "@/components/todo-item";

export function TodoList() {
  const { t } = useTranslation();
  const todos = useFilteredTodos();

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <ClipboardList className="h-12 w-12 opacity-40" />
        <div className="text-center">
          <p className="text-sm font-medium">{t("empty_state.title")}</p>
          <p className="text-xs">{t("empty_state.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
