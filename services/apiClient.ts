import { ENDPOINT_URLS } from "@/constants";
import { UrlParameter } from "@/interfaces";
import axios from "axios";

const apiClient = axios.create({
  baseURL: ENDPOINT_URLS.BASE_URL, // Настройте на базовый URL вашего API
  headers: {
    "Content-Type": "application/json",
  },
});

class UrlParser {
  private url: string;
  private baseUrl: string;
  private parsedPath?: string;
  private parsedParameters?: UrlParameter;

  constructor(url: string, baseUrl = "https://localhost") {
    this.url = url;
    this.baseUrl = baseUrl;
    this.parse();
  }

  private parse(): void {
    const fullUrl = new URL(this.url, this.baseUrl);

    if (!fullUrl.searchParams.toString().length) {
      this.parsedPath = fullUrl.pathname;
      this.parsedParameters = {};
    } else {
      this.parsedParameters = this.extractParameters(fullUrl.searchParams);
    }
  }

  private extractParameters(searchParams: URLSearchParams): UrlParameter {
    const parameters: UrlParameter = {};

    searchParams.forEach((value, key) => {
      parameters[key] = value;
    });

    return parameters;
  }

  createUrlWithQuery(queryParams: Partial<UrlParameter> = {}): string {
    if (this.parsedPath) {
      return this.parsedPath;
    }

    const urlParts = new URL(this.url, this.baseUrl);
    const existingParams = this.parsedParameters || {};
    const searchParams = new URLSearchParams(existingParams);

    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        // Проверяем, что значение определено
        searchParams.set(key, value);
      }
    }

    return `${urlParts.pathname}${
      searchParams.toString().length ? "?" : ""
    }${searchParams.toString()}`;
  }
}

export { UrlParser, apiClient };
