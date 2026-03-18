/**
 * External imports
 */
// @ts-nocheck

import { type UseBaseQueryOptions, useQuery } from "@tanstack/react-query";
import qs from "query-string";

/**
 * Internal Imports
 */
import { createApiRequest } from "./createRequest";

const keysToRemoveFromQueryKey = ["sort_ascending"];

export interface DefinitionOptions {
  key: ((arg: string) => string[]) | string[];
  url: string;
  options?: Partial<UseBaseQueryOptions>;
}

export interface UsageOptions<TData> {
  queryParams?: Record<string, string>;
  pathParams?: Record<string, string | number>;
  enabled?: boolean;
  onSuccess?: (data: TData, ...args: Record<string, unknown>[]) => void;
}

/**
 * Replaces path params in the URL.
 */
const buildUrlWithParams = (
  url: string,
  pathParams?: Record<string, string | number>
) => {
  if (!pathParams) return url;
  return Object.keys(pathParams).reduce(
    (updatedUrl, key) => updatedUrl.replace(`:${key}`, String(pathParams[key])),
    url
  );
};

/**
 * Create API request on the fly and return a useQuery instance
 * @returns
 */
export const createQuery = <TData>(definitionOptions: DefinitionOptions) => {
  const useQueryFn = (usageOptions?: UsageOptions<TData>) => {
    if (!usageOptions) {
      usageOptions = {};
    }

    const { url, key } = definitionOptions;
    const { queryParams = {}, pathParams, ...rest } = usageOptions;

    const mergeOptions = {
      ...definitionOptions.options,
      ...rest // usage options
    };

    const transformedFilters = transformFiltersToKey(queryParams);

    const params = queryParams ? qs.stringify(queryParams) : "";
    const keyParams = transformedFilters
      ? qs.stringify(transformedFilters)
      : "";

    const queryKey = typeof key === "function" ? key(keyParams) : key;

    const finalUrl = buildUrlWithParams(url, pathParams);

    return useQuery<unknown, TError, TData, any>({
      queryKey: [...queryKey, pathParams], // Ensure refetching when path params change
      queryFn: () =>
        createApiRequest<TData>({
          url: finalUrl,
          queryParams: params,
          method: "GET"
        }),

      ...mergeOptions
    });
  };

  return useQueryFn;
};

const transformFiltersToKey = (filters: Record<string, string>) => {
  keysToRemoveFromQueryKey.forEach((key) => {
    delete filters[key];
  });
  return filters;
};
