import { useMemo } from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Todo, Priority, Category } from "@/types";

export type FilterStatus = "all" | "active" | "completed";

interface TodoState {
  todos: Todo[];
  searchQuery: string;
  filterPriority: Priority | "all";
  filterCategory: Category | "all";
  filterStatus: FilterStatus;

  // Actions
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "completed">) => void;
  updateTodo: (
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt">>,
  ) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: Priority | "all") => void;
  setFilterCategory: (category: Category | "all") => void;
  setFilterStatus: (status: FilterStatus) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  searchQuery: "",
  filterPriority: "all",
  filterCategory: "all",
  filterStatus: "all",

  addTodo: (todo) =>
    set((state) => ({
      todos: [
        {
          ...todo,
          id: uuidv4(),
          completed: false,
          createdAt: new Date(),
        },
        ...state.todos,
      ],
    })),

  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo,
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterPriority: (filterPriority) => set({ filterPriority }),
  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
}));

/**
 * Derived hook – returns the filtered & searched todo list.
 * Uses useMemo to avoid creating a new array reference unless
 * the underlying state actually changes.
 */
export function useFilteredTodos(): Todo[] {
  const todos = useTodoStore((s) => s.todos);
  const searchQuery = useTodoStore((s) => s.searchQuery);
  const filterPriority = useTodoStore((s) => s.filterPriority);
  const filterCategory = useTodoStore((s) => s.filterCategory);
  const filterStatus = useTodoStore((s) => s.filterStatus);

  return useMemo(() => {
    let filtered = todos;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    // Status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((t) => t.completed);
    }

    return filtered;
  }, [todos, searchQuery, filterPriority, filterCategory, filterStatus]);
}
