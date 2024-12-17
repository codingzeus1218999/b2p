import { ENDPOINT_URLS } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  ORDERSTATUS,
  orderCancelInterface,
  orderDoneInterface,
  orderFeedbackInterface,
  orderFeedbackQueryInterface,
  orderInterface,
  orderMadeInterface,
  orderPayedInterface,
  pageMetaInterface,
} from "@/interfaces";
import axios from "axios";

/**
 * Get orders
 * @param {ORDERSTATUS | null} status - order status
 * @param {number} limit - count per page
 * @param {number} page - page number
 * @returns {Promise<{ data: orderInterface[]; meta: pageMetaInterface }>} - An array of orders
 */
export const getOrders = async (
  status: ORDERSTATUS | null = null,
  limit: number = MAGIC_NUMBERS.ORDER_PER_PAGE,
  page: number = 1
): Promise<{ data: orderInterface[]; meta: pageMetaInterface }> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.GET_ORDERS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status,
          limit,
          page,
        },
      }
    );
    return { data: data.data, meta: data.meta };
  } catch (err) {
    throw err;
  }
};

/**
 * Get order
 * @param {string} id - order id
 * @returns {Promise<orderInterface>} - An object of order
 */
export const getOrder = async (id: string): Promise<orderInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.GET_ORDER.replace(
        "{order_id}",
        id
      )}`,
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
 * Made new order
 * @param {string} stock_id - Stock Id
 * @returns {Promise<orderMadeInterface>} - An object of order
 */
export const madeNewOrder = async (
  stock_id: string
): Promise<orderMadeInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.CREATE_ORDER}`,
      { stock_id },
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
 * Order payed
 * @param {string} order_id - the order id
 * @returns {Promise<orderPayedInterface>} - An object of result
 */
export const orderPayed = async (
  order_id: string
): Promise<orderPayedInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ORDER_PAYED.replace(
        "{order_id}",
        order_id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error order payed:", error);
    throw error;
  }
};
/**
 * Order done
 * @param {string} order_id - the order id
 * @returns {Promise<orderDoneInterface>} - An object of result
 */
export const orderDone = async (
  order_id: string
): Promise<orderDoneInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ORDER_DONE.replace(
        "{order_id}",
        order_id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error order done:", error);
    throw error;
  }
};
/**
 * Order cancel
 * @param {string} order_id - the order id
 * @returns {Promise<orderCancelInterface>} - An object of result
 */
export const orderCancel = async (
  order_id: string
): Promise<orderCancelInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ORDER_CANCEL.replace(
        "{order_id}",
        order_id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error order done:", error);
    throw error;
  }
};

/**
 * Order feedback
 * @param {orderFeedbackQueryInterface} query - the query
 * @returns {Promise<orderFeedbackInterface>} - An object of feedback result
 */
export const orderFeedback = async ({
  marketplace,
  shipment,
  product,
  feedback,
  order_id,
}: orderFeedbackQueryInterface): Promise<orderFeedbackInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.ORDER_FEEDBACK.replace(
        "{order_id}",
        order_id
      )}`,
      { marketplace, shipment, product, feedback },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error order feedback:", error);
    throw error;
  }
};
