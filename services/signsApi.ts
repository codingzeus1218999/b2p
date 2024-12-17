import { ENDPOINT_URLS, STATUS_CODES } from "@/constants";
import axios from "axios";
import { UrlParser, apiClient } from "./apiClient";

export const login = async (username: string, password: string) => {
  try {
    const { data }: any = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.SIGNIN}`,
      { login: username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data?.access) {
      sessionStorage.setItem("access", data?.access);
      sessionStorage.setItem("refresh", data?.refresh);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const signup = async (
  login: string,
  username: string,
  password: string,
  password_confirmation: string
) => {
  try {
    const { data }: any = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.SIGNUP}`,
      { login, username, password, password_confirmation },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    sessionStorage.setItem("access", data?.access);
    sessionStorage.setItem("refresh", data?.refresh);
    return data;
  } catch (err) {
    throw err;
  }
};

export const recoveryToken = async () => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.RECOVERY_TOKEN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data?.secret_token;
  } catch (e) {
    console.error(e);
  }
};

export const checkf2a = async (code: string, authToken: string) => {
  try {
    const urlParser = new UrlParser(ENDPOINT_URLS.CHECK_TWO_FACTOR);
    const urlWithQuery = urlParser.createUrlWithQuery({
      code,
      token: authToken,
    });
    const response = await apiClient.get(urlWithQuery);
    if (response && response.status === STATUS_CODES.OK && response.data) {
      sessionStorage.setItem("access", response.data?.access);
      sessionStorage.setItem("refresh", response.data?.refresh);
      return response.data;
    }
  } catch (err) {
    throw err;
  }
};

export const resetPassword = async (
  login: string,
  secretToken: string,
  password: string,
  passwordConfirm: string
) => {
  try {
    const { data }: any = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PASSWORD_RESET}`,
      {
        login,
        password,
        secret_token: secretToken,
        password_confirmation: passwordConfirm,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data?.access) {
      sessionStorage.setItem("access", data?.access);
      sessionStorage.setItem("refresh", data?.refresh);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
