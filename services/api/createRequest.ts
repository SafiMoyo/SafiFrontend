/**
 * External imports
 */
import type { AxiosResponse, ResponseType } from "axios";

/**
 * Local imports
 */
import Axios from "./instance";
// import { toast } from "@/utils/toast";

interface createRequest {
  url: string;
  queryParams?: string;
  data?: Record<string, unknown> | FormData;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  apiOptions?: {
    responseType?: ResponseType;
    headers?: Record<string, string>;
  };
}

/**
 * Api request generator
 */
export const createApiRequest = async <TData>(
  options: createRequest
): Promise<TData> => {
  const { url, queryParams, method, data, apiOptions = {} } = options;
  const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;

  const response = await Axios({
    url: fullUrl,
    method,
    ...(data ? { data: data } : {}),
    ...apiOptions
  })
    .then((response: AxiosResponse<TData>) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

  return response;
};
