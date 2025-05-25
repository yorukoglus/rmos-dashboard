import { useRouter } from "next/navigation";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Token geçersiz veya süresi dolmuş
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchApi(endpoint: string, options: RequestOptions = {}) {
  const { requiresAuth = true, ...fetchOptions } = options;

  let headers = new Headers(fetchOptions.headers as Record<string, string>);

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      throw new Error("Oturum bulunamadı. Lütfen giriş yapın.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = (fetchOptions.method || "GET").toUpperCase();
  if (["POST", "PUT", "DELETE"].includes(method)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  });

  return handleResponse(response);
}

// HTTP metodları için yardımcı fonksiyonlar
export const api = {
  get: (endpoint: string, options?: RequestOptions) =>
    fetchApi(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data: any, options?: RequestOptions) =>
    fetchApi(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: any, options?: RequestOptions) =>
    fetchApi(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string, options?: RequestOptions) =>
    fetchApi(endpoint, { ...options, method: "DELETE" }),
};
