import { ENDPOINT_URLS, STATUS_CODES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  buyerInterface,
  buyerWithIdInterface,
  buyersResultInterface,
  pageMetaInterface,
  productInterface,
  reviewInterface,
} from "@/interfaces";
import axios from "axios";
import { UrlParser, apiClient } from "./apiClient";

/**
 * Fetches the buyers with id based on the name.
 * @param {string} name - Search keyword
 * @returns {Promise<buyerWithIdInterface[]>} - An array of buyers with id by the name.
 */
const fetchBuyersWithIdByName = async (
  name: string
): Promise<buyerWithIdInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.BUYERS_WITH_ID_BY_NAME);
    const urlWithQuery = urlParser.createUrlWithQuery({ term: name });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching buyers with id by name:", error);
    return [];
  }
};

/**
 * Fetches the buyer based on the id.
 * @param {string} id - Buyer's id
 * @returns {Promise<buyerInterface | null>} - An object of the buyer.
 */
export const fetchBuyerById = async (
  id: string
): Promise<buyerInterface | null> => {
  try {
    const urlParser = new UrlParser(
      ENDPOINT_URLS.BUYER_BY_ID.replace("{shop_id}", id)
    );
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching buyer by id:", error);
    return null;
  }
};

/**
 * Fetches the buyer based on the id with auth.
 * @param {string} id - Buyer's id
 * @returns {Promise<buyerInterface>} - An object of the buyer.
 */
export const fetchBuyerByIdWithAuth = async (
  id: string
): Promise<buyerInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.BUYER_BY_ID_WITH_AUTH.replace(
        "{shop_id}",
        id
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the buyers info based on the name.
 * @param {string} name - Search keyword
 * @returns {Promise<buyerInterface[]>} - An array of the buyers.
 */
export const fetchBuyersByName = async (
  name: string
): Promise<buyerInterface[]> => {
  try {
    const res = [];
    const buyersWithId = await fetchBuyersWithIdByName(name);
    for (let i = 0; i < buyersWithId.length; i++) {
      const r = await fetchBuyerById(buyersWithId[i].id);
      if (r) res.push(r);
    }
    return res;
  } catch (error) {
    console.error("Error fetching buyers by name:", error);
    return [];
  }
};
/**
 * Fetches the similar buyers
 * @param {string} buyer_ids - Search keyword
 * @returns {Promise<buyerInterface[]>} - An array of the buyers.
 */
export const fetchSimilarBuyers = async (
  buyer_ids: string
): Promise<buyerInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.BUYERS_SIMILAR);
    const urlWithQuery = urlParser.createUrlWithQuery({
      shops: buyer_ids,
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching similar buyers:", error);
    return [];
  }
};

/**
 * Fetches the buyers based on the type id.
 * @param {string} type - id of the type
 * @param {string} categories - id of the categories
 * @param {number} limit - page limit, default = 24
 * @param {number} page - page number, default = 1
 * @returns {Promise<buyersResultInterface | null>} - An object of search result
 */
export const fetchBuyersByTypeId = async (
  type: string,
  categories: string,
  limit: number = MAGIC_NUMBERS.BUYERS_PER_PAGE_DESKTOP,
  page: number = 1
): Promise<buyersResultInterface | null> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.BUYERS_BY_TYPE);
    const urlWithQuery = urlParser.createUrlWithQuery({
      type_size_id: type,
      categories_id: categories,
      limit: limit.toString(),
      page: page.toString(),
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return { data: response.data.data, meta: response.data.meta };
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching buyers by the type id:", error);
    return null;
  }
};

/**
 * Fetches the products based on the buyer id.
 * @param {string} id - Buyer's id
 * @param {string} type_id - Type's id
 * @param {string} size_ids - Size ids
 * @param {number} limit - count per page
 * @param {number} page - page number
 * @param {string} sort - sort field
 * @returns {Promise<{data: productInterface[]; meta: pageMetaInterface} | null>} - An array of products.
 */
export const fetchProductsByBuyerId = async (
  id: string,
  type_id: string,
  size_ids: string,
  limit: number = MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
  page: number = 1,
  sort?: string
): Promise<{ data: productInterface[]; meta: pageMetaInterface } | null> => {
  try {
    const urlParser = new UrlParser(
      ENDPOINT_URLS.PRODUCTS_BY_BUYER_ID.replace("{shop_id}", id)
    );
    const urlWithQuery = urlParser.createUrlWithQuery({
      type_size_id: type_id,
      locations_id: size_ids,
      limit: limit.toString(),
      page: page.toString(),
      sort: sort ? sort.toString() : "",
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return { data: response.data.data, meta: response.data.meta };
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching products by the buyer id:", error);
    return null;
  }
};

/**
 * Fetches the reviews based on the buyer id.
 * @param {string} id - Buyer's id
 * @param {string} sort - sort field
 * @param {number} limit - count per page
 * @param {number} page - page number
 * @returns {Promise<{data:reviewInterface[]; meta:pageMetaInterface} | null>} - An array of reviews.
 */
export const fetchReviewsByBuyerId = async (
  id: string,
  sort?: string,
  limit: number = MAGIC_NUMBERS.REVEIWS_PER_PAGE,
  page: number = 1
): Promise<{ data: reviewInterface[]; meta: pageMetaInterface } | null> => {
  try {
    const urlParser = new UrlParser(
      ENDPOINT_URLS.REVIEWS_BY_BUYER_ID.replace("{shop_id}", id)
    );
    const urlWithQuery = urlParser.createUrlWithQuery({
      sort: sort ? sort.toString() : "",
      limit: limit.toString(),
      page: page.toString(),
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return { data: response.data.data, meta: response.data.meta };
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching reviews by the buyer id:", error);
    return null;
  }
};

/**
 * Fetches the favorites buyers
 * @returns {Promise<buyerInterface[]>} - An array of the buyers.
 */
export const fetchFavoritesBuyers = async (): Promise<buyerInterface[]> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.BUYERS_FAVORITES}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Favorite buyer
 * @param {string} id - buyer id
 * @returns {Promise<{}>} - An object of buyer
 */
export const favoriteBuyer = async (id: string): Promise<{}> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.BUYER_FAVORITE.replace(
        "{shop_id}",
        id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Unfavorite buyer
 * @param {string} id - buyer id
 * @returns {Promise<{}>} - An object of buyer
 */
export const unFavoriteBuyer = async (id: string): Promise<{}> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.BUYER_UNFAVORITE.replace(
        "{shop_id}",
        id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (err) {
    throw err;
  }
};
