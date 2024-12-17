import { ENDPOINT_URLS, STATUS_CODES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  couponInterface,
  offsetMetaInterface,
  pageMetaInterface,
  productInterface,
  productStocksInterface,
  reviewResultInterface,
  searchProductsQueryInterface,
  searchResultInterface,
} from "@/interfaces";
import axios from "axios";
import { UrlParser, apiClient } from "./apiClient";

/**
 * Fetches the product based on the id.
 * @param {string} id - product id
 * @returns {Promise<productInterface | null>} - An object of the product by id
 */
export const fetchProductById = async (
  id: string
): Promise<productInterface | null> => {
  try {
    const urlParser = new UrlParser(
      ENDPOINT_URLS.PRODUCT_BY_ID.replace("{product_id}", id)
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
    console.error("Error fetching product id by the id:", error);
    return null;
  }
};

/**
 * Fetches the product based on the id with auth.
 * @param {string} id - product id
 * @returns {Promise<productInterface>} - An object of the product by id
 */
export const fetchProductByIdWithAuth = async (
  id: string
): Promise<productInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PRODUCT_BY_ID_WITH_AUTH.replace(
        "{product_id}",
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
 * Fetches the recommend products based on the type id.
 * @param {string} id - the type id
 * @returns {Promise<productInterface[]>} - An array of the products by the type id
 */
export const fetchRecommendProductsByTypeId = async (
  id: string
): Promise<productInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.RECOMMEND_PRODUCTS);
    const urlWithQuery = urlParser.createUrlWithQuery({ type_size_id: id });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching recommend products by the type id:", error);
    return [];
  }
};

/**
 * Search the products
 * @param {searchProductsQueryInterface} query - the query
 * @returns {Promise<searchResultInterface | null>} - An array of the products by the search query
 */
export const searchProducts = async ({
  type_id,
  size_ids,
  category_ids,
  brand_ids,
  variant_ids,
  from_price,
  to_price,
  from_step,
  to_step,
  limit = MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
  offset = 0,
  sort,
}: searchProductsQueryInterface): Promise<searchResultInterface | null> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.SEARCH);
    const urlWithQuery = urlParser.createUrlWithQuery({
      type_size_id: type_id,
      locations_id: size_ids,
      category_id: category_ids,
      stores_id: brand_ids,
      delivery_type_id: variant_ids,
      price_from: from_price ? from_price.toString() : "",
      price_to: to_price ? to_price.toString() : "",
      weight_from: from_step ? from_step.toString() : "",
      weight_to: to_step ? to_step.toString() : "",
      limit: limit.toString(),
      offset: offset.toString(),
      sort: sort ? sort.toString() : "",
    });
    const response = await apiClient.get(urlWithQuery);
    if (
      response &&
      response.status === STATUS_CODES.OK &&
      response.data &&
      response.data.data &&
      response.data.meta
    ) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error searching products:", error);
    return null;
  }
};

/**
 * Fetches the reviews based on the product id.
 * @param {string} id - product id
 * @param {number} offset - offset, default is 0
 * @param {number} limit - limit, default is 2
 * @returns {Promise<reviewResultInterface | null>} - An array of the reviews by product id
 */
export const fetchProductReviewsByProductId = async (
  id: string,
  offset: number = 0,
  limit: number = MAGIC_NUMBERS.REVIEWS_IN_PRODUCT_CARD
): Promise<reviewResultInterface | null> => {
  try {
    const urlParser = new UrlParser(
      ENDPOINT_URLS.REVIEWS_BY_PRODUCT_ID.replace("{product_id}", id)
    );
    const urlWithQuery = urlParser.createUrlWithQuery({
      offset: offset.toString(),
      limit: limit.toString(),
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product reviews by the product id:", error);
    return null;
  }
};

export const getProductStocks = async (
  product_id: string,
  size_ids?: string
): Promise<productStocksInterface[]> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PRODUCT_STOCKS}`.replace(
        "{product_id}",
        product_id
      ),
      {
        params: {
          size_id: size_ids,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching product stocks by the product id:", error);
    throw error;
  }
};

/**
 * Favorite the product
 * @param {string} id - product id
 * @returns {Promise<productInterface>} - An object of the product by id
 */
export const favoriteProduct = async (
  id: string
): Promise<productInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PRODUCT_FAVORITE.replace(
        "{product_id}",
        id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Unfavorite the product
 * @param {string} id - product id
 * @returns {Promise<productInterface>} - An object of the product by id
 */
export const unFavoriteProduct = async (
  id: string
): Promise<productInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.delete(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PRODUCT_FAVORITE.replace(
        "{product_id}",
        id
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch favorite products
 * @returns {Promise<productInterface[]>} - An array of the favorite products
 */
export const fetchFavoriteProducts = async (): Promise<productInterface[]> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PRODUCTS_FAVORITED}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get coupons
 * @param {number} limit - count per page
 * @param {number} page - page number
 * @returns {Promise<{data: couponInterface[], meta: pageMetaInterface}>} - An array of the coupons
 */
export const getCoupons = async (
  limit: number = MAGIC_NUMBERS.COUPONS_PER_PAGE,
  page: number = 1
): Promise<{
  data: couponInterface[];
  meta: pageMetaInterface;
}> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.COUPON}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get coupon
 * @param {string} id - coupon id
 * @returns {Promise<couponInterface>} - An object of coupon
 */
export const getCoupon = async (id: string): Promise<couponInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.GET_COUPON.replace(
        "{coupon_id}",
        id
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get products according to coupon id
 * @param {string} id - coupon id
 * @param {string} typeId - type id
 * @param {string} locationIds - size ids
 * @param {string} categoryIds - category ids
 * @param {number} limit - limit
 * @param {number} offset - offset
 * @param {string} sort - sort category
 * @returns {Promise<{data: productInterface[], meta: offsetMetaInterface}>} - An object of coupon
 */
export const getProductsByCouponId = async (
  id: string,
  typeId: string,
  locationIds: string = "",
  categoryIds: string = "",
  limit: number = MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
  offset: number = 0,
  sort: string | null = null
): Promise<{ data: productInterface[]; meta: offsetMetaInterface }> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PRODUCTS_COUPON.replace(
        "{coupon_id}",
        id
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          type_size_id: typeId,
          locations_id: locationIds,
          category_id: categoryIds,
          limit: limit,
          offset: offset,
          sort: sort,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check product's stock
 * @param {string} id - stock id
 * @returns {Promise<productStocksInterface>} - An array of the stock
 */
export const checkStock = async (
  id: string
): Promise<productStocksInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CHECK_STOCK.replace(
        "{stock_id}",
        id
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
