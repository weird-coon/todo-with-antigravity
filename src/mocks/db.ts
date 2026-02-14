import type { Todo } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Seed data
const initialTodos: Todo[] = [
  {
    id: uuidv4(),
    title: "Complete MSW integration",
    description: "Migrate the app to use MSW for local API mocks.",
    priority: "high",
    category: "work",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Verify fetch wrapper",
    description: "Ensure the request/response headers and bodies are correctly wrapped/unwrapped.",
    priority: "medium",
    category: "work",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// In-memory DB
export const db = {
  todos: [...initialTodos],
};
