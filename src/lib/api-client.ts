import "whatwg-fetch";

/**
 * Standard packet structure for requests.
 */
interface RequestPacket<T = any> {
  requestHeader: {
    origin: string;
    timestamp: string;
    [key: string]: any;
  };
  requestBody: T;
}

/**
 * Standard packet structure for responses.
 */
interface ResponsePacket<T = any> {
  responseHeader: {
    timestamp: string;
    status: "SUCCESS" | "ERROR";
    message?: string;
    [key: string]: any;
  };
  responseBody: T;
}

/**
 * Custom fetch client that wraps and unwraps the requested packet structure.
 */
export const apiClient = {
  async request<TResponse = any, TRequest = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<TResponse> {
    const method = options.method || "GET";
    const body = options.body ? JSON.parse(options.body as string) : null;

    // Wrap the request body
    const packet: RequestPacket<TRequest> = {
      requestHeader: {
        origin: "todo-app",
        timestamp: new Date().toISOString(),
      },
      requestBody: body,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: method !== "GET" && method !== "HEAD" ? JSON.stringify(packet) : undefined,
    });

    const data: ResponsePacket<TResponse> = await response.json();

    if (data.responseHeader.status === "ERROR") {
      throw new Error(data.responseHeader.message || "API Request Failed");
    }

    // Unwrap the response body
    return data.responseBody;
  },

  get<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, { ...options, method: "GET" });
  },

  post<T>(url: string, body: any, options?: RequestInit) {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: any, options?: RequestInit) {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, { ...options, method: "DELETE" });
  },
};
