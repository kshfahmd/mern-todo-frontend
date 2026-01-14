import api from "./axios";

// GET all todos
export const getTodos = () => api.get("/api/todos");

// POST create todo
export const createTodo = (data) => api.post("/api/todos", data);

// PATCH toggle todo
export const toggleTodo = (id) => api.patch(`/api/todos/${id}/toggle`);

// DELETE todo
export const deleteTodo = (id) => api.delete(`/api/todos/${id}`);
