import { auth } from "@/config/config.firebase";

const API_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default async function apiFetch(path, options = {}) {
  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    throw new Error("You must be logged in to make this request.");
  }

  const token = await firebaseUser.getIdToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body &&
      !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
}