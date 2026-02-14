import { useMemo } from "react";
import { create } from "zustand";
import type { Todo, Priority, Category } from "@/types";
import { apiClient } from "@/lib/api-client";

export type FilterStatus = "all" | "active" | "completed";

interface TodoState {
  todos: Todo[];
  searchQuery: string;
  filterPriority: Priority | "all";
  filterCategory: Category | "all";
  filterStatus: FilterStatus;
  isLoading: boolean;
  error: string | null;
  todosPromise: Promise<Todo[]>;

  // Actions
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "completed">) => Promise<void>;
  updateTodo: (
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt">>,
  ) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: Priority | "all") => void;
  setFilterCategory: (category: Category | "all") => void;
  setFilterStatus: (status: FilterStatus) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  searchQuery: "",
  filterPriority: "all",
  filterCategory: "all",
  filterStatus: "all",
  isLoading: false,
  error: null,
  todosPromise: null as any,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const promise = apiClient.get<Todo[]>("/api/todos");
      set({ todosPromise: promise });
      const todos = await promise;
      set({ todos, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addTodo: async (todo) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await apiClient.post<Todo>("/api/todos", todo);
      set((state) => ({ todos: [newTodo, ...state.todos], isLoading: false }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateTodo: async (id, updates) => {
    try {
      const updatedTodo = await apiClient.patch<Todo>(`/api/todos/${id}`, updates);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? updatedTodo : todo,
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteTodo: async (id) => {
    try {
      await apiClient.delete(`/api/todos/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await apiClient.patch<Todo>(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

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
