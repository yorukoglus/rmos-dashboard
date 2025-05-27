import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
} from "axios";

interface RequestOptions extends Omit<AxiosRequestConfig, "method"> {
  requiresAuth?: boolean;
  method?: Method;
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
    }
    throw error;
  }
);

export async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...axiosOptions } = options;

  if (!requiresAuth && axiosOptions.headers) {
    delete axiosOptions.headers.Authorization;
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance(
      endpoint,
      axiosOptions
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Bir hata oluştu");
    }
    throw error;
  }
}

export const api = {
  post: <T>(
    endpoint: string,
    data: unknown,
    options?: Omit<RequestOptions, "method" | "data">
  ) => fetchApi<T>(endpoint, { ...options, method: "POST", data }),
};
