import { ENDPOINT_URLS } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  PAYMENTSTATUS,
  pageMetaInterface,
  paymentCancelInterface,
  paymentExpiredInterface,
  paymentHistoryInterface,
  paymentInterface,
  paymentPayedInterface,
  paymentSystemInterface,
  paymentTopupInterface,
  paymentTopupQueryInterface,
} from "@/interfaces";
import axios from "axios";

/**
 * Get payments
 * @param {PAYMENTSTATUS | null} status - payment status
 * @returns {Promise<paymentInterface[]>} - An array of payments
 */
export const getPayments = async (
  status: PAYMENTSTATUS | null = null
): Promise<paymentInterface[]> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.GET_PAYMENTS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status,
        },
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Get the payment
 * @param {string} id - the payment id
 * @returns {Promise<paymentInterface>} - An object of payment
 */
export const fetchPayment = async (id: string): Promise<paymentInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.GET_PAYMENT.replace(
        "{payment_id}",
        id
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching payment systems:", error);
    throw error;
  }
};
/**
 * Get the payment systems
 * @returns {Promise<paymentSystemInterface[]>} - An array of payment system
 */
export const fetchPaymentSystems = async (): Promise<
  paymentSystemInterface[]
> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PAYMENT_SYSTEMS}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching payment systems:", error);
    return [];
  }
};

/**
 * Payment topup
 * @param {paymentTopupQueryInterface} query - the query
 * @returns {Promise<paymentTopupInterface>} - An object of topup result
 */
export const paymentTopup = async ({
  amount,
  order_id,
  payment_system_id,
}: paymentTopupQueryInterface): Promise<paymentTopupInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.post(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PAYMENT_TOPUP.replace(
        "{payment_system_id}",
        payment_system_id
      )}`,
      { amount, order_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error payment topup:", error);
    throw error;
  }
};

/**
 * Payment payed
 * @param {string} payment_id - the payment id
 * @returns {Promise<paymentPayedInterface>} - An object of result
 */
export const paymentPayed = async (
  payment_id: string
): Promise<paymentPayedInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PAYMENT_PAYED.replace(
        "{payment_id}",
        payment_id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error payment payed:", error);
    throw error;
  }
};

/**
 * Payment calcel
 * @param {string} payment_id - the payment id
 * @returns {Promise<paymentCancelInterface>} - An object of result
 */
export const paymentCancel = async (
  payment_id: string
): Promise<paymentCancelInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PAYMENT_CANCEL.replace(
        "{payment_id}",
        payment_id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error payment cancel:", error);
    throw error;
  }
};

/**
 * Payment expired
 * @param {string} payment_id - the payment id
 * @returns {Promise<paymentExpiredInterface>} - An object of result
 */
export const paymentExpired = async (
  payment_id: string
): Promise<paymentExpiredInterface> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.put(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.PAYMENT_EXPIRED.replace(
        "{payment_id}",
        payment_id
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    console.error("Error payment expired:", error);
    throw error;
  }
};

/**
 * Get payment history
 * @param {string} operation - category
 * @param {number} from - start date
 * @param {number} to - end date
 * @param {number} limit - count per page
 * @param {number} page - page number
 * @returns {Promise<{ data: paymentHistoryInterface[]; meta: pageMetaInterface; operations: any }>} - An array of payments
 */
export const fetchPaymentHistory = async (
  operation: string = "all",
  from: number,
  to: number,
  limit: number = MAGIC_NUMBERS.PAYMENTS_PER_PAGE,
  page: number = 1
): Promise<{
  data: paymentHistoryInterface[];
  meta: pageMetaInterface;
  operations: any;
}> => {
  try {
    const token = sessionStorage.getItem("access");
    const { data } = await axios.get(
      `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.WALLET}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit,
          page,
          from,
          to,
          operation: operation === "all" ? "" : operation,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error payment history:", error);
    throw error;
  }
};
