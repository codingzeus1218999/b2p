import { ENDPOINT_URLS, STATUS_CODES } from "@/constants";
import {
  instructionInterface,
  textCouponInterface,
  tipPayedInterface,
  tipPaymentInterface,
  tipStocksInterface,
} from "@/interfaces";
import axios from "axios";
import { UrlParser, apiClient } from "./apiClient";

/**
 * Fetches the instructions.
 * @returns {Promise<instructionInterface | null>} - Instructions data or null.
 */
export const fetchInstructions =
  async (): Promise<instructionInterface | null> => {
    try {
      const urlParser = new UrlParser(ENDPOINT_URLS.INSTRUCTIONS);
      const urlWithQuery = urlParser.createUrlWithQuery();
      const response = await apiClient.get(urlWithQuery);

      if (response && response.status === STATUS_CODES.OK && response.data) {
        return response.data;
      } else {
        console.warn("Unexpected response structure:", response);
        return null;
      }
    } catch (error) {
      console.error("Error fetching instructions:", error);
      return null;
    }
  };

/**
 * Fetches the tips of stocks
 * @returns {Promise<tipStocksInterface>} - An array of the stocks tips
 */
export const fetchTipsStocks = async (): Promise<tipStocksInterface> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.TIP_STOCKS);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching stocks tips:", error);
    return [];
  }
};
/**
 * Fetches the tips of payment
 * @returns {Promise<tipPaymentInterface>} - An array of the payment tips
 */
export const fetchTipsPayment = async (): Promise<tipPaymentInterface> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.TIP_PAYMENT);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching payment tips:", error);
    return [];
  }
};
/**
 * Fetches the tips of payed
 * @returns {Promise<tipPayedInterface>} - An array of the payed tips
 */
export const fetchTipsPayed = async (): Promise<tipPayedInterface> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.TIP_PAYED);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching payed tips:", error);
    return [];
  }
};

export const getRules = async () => {
  try {
    const { data }: { data: string } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.TEXT_RULES}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAboutService = async () => {
  try {
    const { data }: { data: string } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.TEXT_ABOUT}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPayedRules = async () => {
  try {
    const { data }: { data: string } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.TEXT_PAYED_RULES}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches the text for coupon
 * @returns {Promise<textCouponInterface>} - get text for coupon
 */
export const getCouponText = async (): Promise<textCouponInterface> => {
  try {
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.TEXT_COUPON}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches the text for lost network
 * @returns {Promise<string[]>} - get text for lost connection
 */
export const getLostNetworkText = async (): Promise<string[]> => {
  try {
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.TIP_NETWORK_PROBLEM}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};
