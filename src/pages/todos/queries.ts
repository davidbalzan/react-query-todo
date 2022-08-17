import { useQuery } from "@tanstack/react-query";
import { Todo, Todos } from "../../global/types";

// Key Levels
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

/**
 * Get all todos
 * @returns {Promise<Todos>}
 */
const getTodos = async (): Promise<Todos> => {
  return fetch("/api/todos", {
    method: "GET",
  }).then((res) => res.json());
};

/**
 * Get Specific todo
 * @param id
 * @returns
 */
const getTodo = (id: number | undefined): Promise<Todo> => {
  return typeof id === "undefined"
    ? Promise.reject(new Error("Invalid id"))
    : fetch(`/api/todos/${id}`, {
        method: "GET",
      }).then((res) => res.json());
};

/**
 * Post new todo
 *
 * @param todo
 * @returns
 */
export const postTodo = (todo: Todo): Promise<Todo> => {
  return fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  }).then((res) => res.json());
};

/**
 * Update todo
 * @param partialTodo Update
 * @returns
 */
export const mutateTodo = (partialTodo: Todo): Promise<Todo> => {
  
  if (partialTodo.id !== undefined) {
    return fetch(`/api/todo/${partialTodo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partialTodo),
    }).then((res) => res.json());
  } else {
    return Promise.reject("Id not specified");
  }
};

export const useTodos = () => {
  return useQuery<Todos, Error>(todoKeys.all, getTodos);
};

/**
 * Get Todos Count
 * @returns {Promise<Todo>}
 */
export const useTodosCount = () => {
  return useQuery<Todos, Error, number>(todoKeys.all, getTodos, {
    select: (ts) => ts.length,
  });
};

export const useTodo = (id: number) => {
  return useQuery(todoKeys.detail(id), () => getTodo(id), {
    enabled: Boolean(id),
  });
};
