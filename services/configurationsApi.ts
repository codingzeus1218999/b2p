import { ENDPOINT_URLS, STATUS_CODES } from "@/constants";
import {
  homeSliderInterface,
  notificationInterface,
  timeIntervalInterface,
} from "@/interfaces";
import axios from "axios";
import { UrlParser, apiClient } from "./apiClient";

/**
 * Fetch configurations
 * @returns {Promise<{notifications: notificationInterface[], configuration: timeIntervalInterface}>} - An array of notifications
 */
export const fetchConfigurations = async (): Promise<{
  notifications: notificationInterface[];
  configuration: timeIntervalInterface;
}> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.CONFIG);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    return response.data;
  } catch (error) {
    throw error;
  }
};
/**
 * Check network state
 */
export const checkNetworkState = async () => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.CHECK_HEALTH);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch home sliders
 * @returns {Promise<homeSliderInterface[]>} - An array of home sliders
 */
export const fetchHomeSliders = async (): Promise<homeSliderInterface[]> => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.HOME_SLIDERS);
    const urlWithQuery = urlParser.createUrlWithQuery();
    const response = await apiClient.get(urlWithQuery);

    if (response && response.status === STATUS_CODES.OK && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching home sliders:", error);
    return [];
  }
};

export const fetchMenu = async () => {
  try {
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.MENU}`
    );
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
