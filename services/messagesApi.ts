import { ENDPOINT_URLS } from "@/constants";
import {
  chatInterface,
  chatTypeInterface,
  messageInterface,
  offsetMetaInterface,
  pageMetaInterface,
} from "@/interfaces";
import axios from "axios";

/**
 * Fetches the chat types
 * @returns {Promise<chatTypeInterface[]>} - An array of chat types
 */
export const getChatTypes = async (): Promise<chatTypeInterface[]> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data }: any = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CHAT_TYPES}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new chat
 * @param { any } values - chat payload
 * @returns {Promise<chatInterface>} - An object of new chat
 */
export const createChat = async (values: any): Promise<chatInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data }: any = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CHAT}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get chat messages
 * @param { string } chatId - chat id
 * @param { number } limit - limit
 * @param { number } offset - offset
 * @returns {Promise<{data: messageInterface[], meta: offsetMetaInterface}>} - An object of new chat
 */
export const getMessages = async (
  chatId: string,
  limit: number = 100,
  offset: number = 0
): Promise<{ data: messageInterface[]; meta: offsetMetaInterface }> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.MESSAGES.replace(
        "{chat_id}",
        chatId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          limit,
          offset,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get chat info
 * @param { string } chatId - chat id
 * @returns {Promise<chatInterface>} - An object of chat
 */
export const getChatInfo = async (chatId: string): Promise<chatInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CAHT_INFO.replace(
        "{chat_id}",
        chatId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the chats
 * @param { number } limit - limit number
 * @param { number } page - page number
 * @returns {Promise<{data: chatInterface[], meta: pageMetaInterface}>} - An array of chat types
 */
export const getChats = async (
  limit: number = 100,
  page: number = 1
): Promise<{
  data: chatInterface[];
  meta: pageMetaInterface;
}> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CHAT}`,
      {
        params: {
          limit,
          page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the chats
 * @param { string } chatId - chatId
 * @param { string } message - message
 * @returns {Promise<messageInterface>} - An object of message
 */
export const sendMessage = async (
  chatId: string,
  message: string
): Promise<messageInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data }: any = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.MESSAGES.replace(
        "{chat_id}",
        chatId
      )}`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check chats
 * @returns {Promise<{messages: number}>} - An object of message
 */
export const checkChats = async (): Promise<{ messages: number }> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data }: any = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CAHT_CHECK}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          timestamp: Date.now(),
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
