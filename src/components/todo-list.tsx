import { useTranslation } from "react-i18next";
import { ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem todo={todo} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
