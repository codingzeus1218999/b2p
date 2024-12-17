import { ENDPOINT_URLS, STATUS_CODES } from "@/constants";
import {
  brandInterface,
  categoryInterface,
  deliveryTypeInterface,
  sizeInterface,
  typeInterface,
} from "@/interfaces";
import { UrlParser, apiClient } from "./apiClient";

/**
 * Fetches the sizes by the type id
 * @param {string} type - the id of type
 * @param {string} keyword - Search keyword
 * @param {number} limit - limit
 * @param {number} offset - offset
 * @returns {Promise<sizeInterface[]>} - An array of sizes by the type id.
 */
export const fetchSizesByTypeId = async (
  type: string,
  keyword: string = "",
  limit: number = 10,
  offset: number = 0
): Promise<sizeInterface[]> => {
  try {
    const urlParser = new UrlParser(
      ENDPOINT_URLS.SIZES_BY_TYPE_ID.replace("{type_id}", type)
    );
    const urlWithQuery = urlParser.createUrlWithQuery({
      limit: limit.toString(),
      offset: offset.toString(),
      term: keyword,
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching sizes by the type id:", error);
    return [];
  }
};

/**
 * Get default type
 * @returns {Promise<typeInterface | null>} - default type or null if no exists
 */
export const fetchDefaultType = async (): Promise<typeInterface | null> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.DEFAULT_TYPE);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    if (
      response &&
      response.status === STATUS_CODES.OK &&
      response.data &&
      response.data.id
    ) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching default type:", error);
    return null;
  }
};

/**
 * Fetches the type list
 * @param {string} keyword - Search keyword, default = ""
 * @param {number} limit - limit, default = 10
 * @param {number} offset - offset, default = 0
 * @returns {Promise<typeInterface[]>} - An array of types.
 */
export const fetchTypes = async (
  keyword: string = "",
  limit: number = 10,
  offset: number = 0
): Promise<typeInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.TYPES);
    const urlWithQuery = urlParser.createUrlWithQuery({
      limit: limit.toString(),
      offset: offset.toString(),
      term: keyword,
    });
    const response = await apiClient.get(urlWithQuery);

    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching types:", error);
    return [];
  }
};

/**
 * Fetches the categories
 * @returns {Promise<categoryInterface[]>} - An array of categories
 */
export const fetchCategories = async (): Promise<categoryInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.CATEGORIES);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);

    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Fetches the brands
 * @returns {Promise<brandInterface[]>} - An array of brands.
 */
export const fetchBrands = async (): Promise<brandInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.BRANDS);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);

    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

/**
 * Fetches the delivery types
 * @returns {Promise<deliveryTypeInterface[]>} - An array of delivery type.
 */
export const fetchDeliveryTypes = async (): Promise<
  deliveryTypeInterface[]
> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.DELIVERY_TYPES);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);

    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching delivery types:", error);
    return [];
  }
};
