// src/services/api-client.ts
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
