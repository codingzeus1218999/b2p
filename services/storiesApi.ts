import { ENDPOINT_URLS } from "@/constants";
import { pageMetaInterface, storyInterface } from "@/interfaces";
import { UrlParser, apiClient } from "./apiClient";

/**
 * Fetches the stories.
 * @param {number} limit - page limit, default = 0
 * @param {number} page - page number, default = 1
 * @returns {Promise<{data: storyInterface[], meta: pageMetaInterface}>} - An array of stories data.
 */
export const fetchStories = async (
  limit: number = 10,
  page: number = 1
): Promise<{ data: storyInterface[]; meta: pageMetaInterface }> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.STORIES);
    const urlWithQuery = urlParser.createUrlWithQuery({
      limit: limit.toString(),
      page: page.toString(),
    });
    const response = await apiClient.get(urlWithQuery);
    return { data: response.data.data, meta: response.data.meta };
  } catch (error) {
    throw error;
  }
};
