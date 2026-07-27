// Base URL of the backend API. Change this if your backend runs elsewhere.
const API_BASE_URL = "http://localhost:5000/api";

const TOKEN_KEY = "rlf_token";
const USER_KEY = "rlf_user";

const Auth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isLoggedIn() {
    return !!this.getToken();
  },
};

// Generic request helper. Throws an Error with a readable message on failure.
async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = Auth.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      "Could not reach the server. Is the backend running on " +
        API_BASE_URL +
        "?"
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

const Api = {
  // Auth
  register: (payload) =>
    apiRequest("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) =>
    apiRequest("/auth/login", { method: "POST", body: payload, auth: false }),
  getMe: () => apiRequest("/auth/me"),
  updateMe: (payload) => apiRequest("/auth/me", { method: "PUT", body: payload }),
  getAllUsers: (role) =>
    apiRequest(`/auth/users${role ? `?role=${role}` : ""}`),
  setUserStatus: (id, isActive) =>
    apiRequest(`/auth/users/${id}/status`, {
      method: "PUT",
      body: { isActive },
    }),
  deleteUser: (id) => apiRequest(`/auth/users/${id}`, { method: "DELETE" }),

  // Food
  createFood: (payload) =>
    apiRequest("/food", { method: "POST", body: payload }),
  getAllFood: (query = "") => apiRequest(`/food${query}`),
  getFoodById: (id) => apiRequest(`/food/${id}`),
  updateFood: (id, payload) =>
    apiRequest(`/food/${id}`, { method: "PUT", body: payload }),
  deleteFood: (id) => apiRequest(`/food/${id}`, { method: "DELETE" }),

  // Requests
  createRequest: (payload) =>
    apiRequest("/requests", { method: "POST", body: payload }),
  getMyRequests: () => apiRequest("/requests/my"),
  getReceivedRequests: () => apiRequest("/requests/received"),
  updateRequestStatus: (id, status) =>
    apiRequest(`/requests/${id}/status`, { method: "PUT", body: { status } }),
  getAllRequests: () => apiRequest("/requests"),
};
