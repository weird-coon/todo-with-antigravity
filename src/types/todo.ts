export type Priority = "low" | "medium" | "high";

export type Category = "work" | "personal" | "shopping" | "health" | "other";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}
