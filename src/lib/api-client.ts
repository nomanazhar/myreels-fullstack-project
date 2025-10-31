import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IVideo } from "../models/video";

export type VideoFormData = Omit<IVideo, "_id">;

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
      withCredentials: true,
      timeout: 10_000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Optional: simple response interceptor to unwrap data or handle auth globally
    this.api.interceptors.response.use(
      (res) => res,
      (error) => {
        // Normalize error
        const message =
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "An unknown error occurred";
        return Promise.reject(new Error(message));
      }
    );
  }

  // Explanation:
  // <T = any> declares a generic type parameter named T with a default of `any`.
  // - T represents the shape/type of the response payload (the data inside the resolved Promise).
  // - Methods return Promise<T>, so T is NOT a Promise itself — it's the inner type.
  // - `any` is permissive (disables type checks). Prefer `unknown` or a concrete interface for safer typing.
  // Example: request<User[]> will produce Promise<User[]>
  private async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.request(config);
    return response.data;
  }

  // convenience wrappers
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "GET", url, ...config });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ method: "POST", url, data, ...config });
  }

  async put<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ method: "PUT", url, data, ...config });
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: "DELETE", url, ...config });
  }

  // domain-specific methods
  async getVideos() {
    return this.get("/videos");
  }

  async createVideo(videoData: VideoFormData) {
    return this.post("/videos", videoData);
  }
}

export const apiClient = new ApiClient();
export default apiClient;