import { ENDPOINT_URLS } from "@/constants";
import {
  accountInterface,
  accountStatsInterface,
  changePasswordInterface,
  changePasswordQueryInterface,
  fileInterface,
  fileQueryInterface,
  qrInterface,
  typeInterface,
} from "@/interfaces";
import axios from "axios";

export const check = async (login: string) => {
  try {
    const res = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_LOGIN_CHECK}`,
      {
        params: { login },
      }
    );
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Change default type
 * @param {string} type_id - type id
 * @returns {Promise<typeInterface>} - An object of type
 */
export const changeAccountDefaultTypeSize = async (
  type_id: string
): Promise<typeInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_DEFAULT_TYPE_SIZE}`,
      { type_size_id: type_id },
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

export const getAccountDefaultTypeSize = async () => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_DEFAULT_TYPE_SIZE}`,
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
 * Get account information
 * @returns {Promise<accountInterface>} - An object of account
 */
export const getAccount = async (): Promise<accountInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error get account:", error);
    throw error;
  }
};

/**
 * Upload avatar image
 * @param {fileQueryInterface} query - file data
 * @returns {Promise<fileInterface>} - An object of image
 */
export const uploadImage = async (
  query: fileQueryInterface
): Promise<fileInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_IMAGE}`,
      { ...query },
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

export const updateImage = async (id: string, binaryData: any) => {
  try {
    const token = sessionStorage.getItem("access");
    const response = await fetch(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_IMAGE}/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
        },
        body: binaryData,
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 * @param {changePasswordQueryInterface} query - password info
 * @returns {Promise<changePasswordInterface>} - An object of result
 */
export const changePassword = async (
  query: changePasswordQueryInterface
): Promise<changePasswordInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.patch(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_PASSWORD}`,
      { ...query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    sessionStorage.setItem("access", data?.access);
    sessionStorage.setItem("refresh", data?.refresh);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Terminate all sessions
 */
export const terminateSessions = async () => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.FRESH}`,
      null,
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
 * Get user's stats
 * @returns {Promise<accountStatsInterface>} - An object of stats
 */
export const getStats = async (): Promise<accountStatsInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.STATS}`,
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
 * Get user's qr information
 * @returns {Promise<qrInterface>} - An object of qr
 */
export const getQR = async (): Promise<qrInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_TWO_FACTOR}`,
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
 * Enable user's two factor
 * @param {string} secret - secret code
 * @param {string} code - google code
 * @returns {Promise<accountInterface>} - An account
 */
export const twoFactorEnable = async (
  secret: string,
  code: string
): Promise<accountInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_TWO_FACTOR_ENABLE}`,
      { secret, code },
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
 * Disable user's two factor
 * @param {string} code - code
 * @returns {Promise<accountInterface>} - An account
 */
export const twoFactorDisable = async (
  code: string
): Promise<accountInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ACCOUNT_TWO_FACTOR_DISABLE}`,
      { code },
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
