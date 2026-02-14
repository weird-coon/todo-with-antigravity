import { http, HttpResponse } from "msw";
import { db } from "./db";
import type { Todo } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Utility to wrap response in the requested structure:
 * { "responseHeader": {}, "responseBody": {} }
 */
const wrapResponse = (data: any) => {
  return HttpResponse.json({
    responseHeader: {
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
    },
    responseBody: data,
  });
};

export const handlers = [
  // GET /api/todos
  http.get("/api/todos", async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return wrapResponse(db.todos);
  }),

  // POST /api/todos
  http.post("/api/todos", async ({ request }) => {
    const body = (await request.json()) as any;
    const requestBody = body.requestBody;

    const newTodo: Todo = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...requestBody,
    };

    db.todos.unshift(newTodo);
    return wrapResponse(newTodo);
  }),

  // PATCH /api/todos/:id
  http.patch("/api/todos/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as any;
    const requestBody = body.requestBody;

    const index = db.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return HttpResponse.json(
        {
          responseHeader: { status: "ERROR", message: "Todo not found" },
          responseBody: null,
        },
        { status: 404 }
      );
    }

    db.todos[index] = { ...db.todos[index], ...requestBody };
    return wrapResponse(db.todos[index]);
  }),

  // DELETE /api/todos/:id
  http.delete("/api/todos/:id", ({ params }) => {
    const { id } = params;
    const index = db.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return HttpResponse.json(
        {
          responseHeader: { status: "ERROR", message: "Todo not found" },
          responseBody: null,
        },
        { status: 404 }
      );
    }

    const [deletedTodo] = db.todos.splice(index, 1);
    return wrapResponse(deletedTodo);
  }),
];
