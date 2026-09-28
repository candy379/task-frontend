const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  register: (user) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getTasks: () =>
    apiRequest("/tasks"),

  getTask: (id) =>
    apiRequest(`/tasks/${id}`),

  createTask: (task) =>
    apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id, task) =>
    apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    }),

  deleteTask: (id) =>
    apiRequest(`/tasks/${id}`, {
      method: "DELETE",
    }),
};