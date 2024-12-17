"use client";

import { Paginator } from "@/components/Forms";
import { LeftIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { SearchOptionLeft } from "@/components/Sections";
import { OrderCard } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import { orderInterface } from "@/interfaces";
import { getOrders } from "@/services/ordersApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<orderInterface[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    getInitData();
  }, []);

  const getInitData = async () => {
    setIsLoading(true);
    try {
      const res = await getOrders(null, MAGIC_NUMBERS.ORDER_PER_PAGE, 1);
      setOrders(res.data);
      setPageCount(res.meta.total);
    } catch (err) {
      console.log("Error getting orders", err);
    } finally {
      setIsLoading(false);
    }
  };
  const onClickSearch = () => {
    localStorage.removeItem(LOCALSTORAGES.SEARCH_LEAVE_PRODUCT_ID);
    router.push("/search");
  };
  const onClickPage = async (num: number) => {
    setPageNumber(num);
    setIsLoading(true);
    try {
      const res = await getOrders(null, MAGIC_NUMBERS.ORDER_PER_PAGE, num);
      setOrders(res.data);
    } catch (err) {
      console.log("Error getting orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {isLoggedIn && (
        <div className="lg:mt-8 flex pb-10 lg:pb-0">
          <div className="hidden lg:block lg:w-336px lg:min-w-336px lg:max-w-336px mr-8">
            <SearchOptionLeft onSearch={onClickSearch} />
          </div>
          <div className="flex-1">
            <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
              <LeftIcon
                className="absolute cursor-pointer left-4 top-5"
                onClick={() => {
                  router.back();
                }}
              />
              <div className="flex items-center justify-center">
                <span className="mr-2">🛍️</span>
                <p>{t("common.orders")}</p>
              </div>
            </div>
            <div className="hidden lg:flex p-4 items-center justify-end">
              <div className="text-2xl font-semibold">{t("common.orders")}</div>
            </div>
            {!isLoading && orders.length === 0 && (
              <p className="leading-5 text-neutral-400 text-center">
                {t("common.no_data")}
              </p>
            )}
            <div className="px-2 lg:px-0 flex flex-col am-gapY-8px am-lg-gapY-16px">
              {isLoading &&
                Array(MAGIC_NUMBERS.ORDER_PER_PAGE)
                  .fill(0)
                  .map((_, _idx) => <OrderCard key={_idx} isLoading={true} />)}
              {!isLoading &&
                orders.map((o, _idx) => <OrderCard key={_idx} order={o} />)}
            </div>
            {pageCount > 1 && (
              <div className="px-4 pt-6 pb-4 lg:px-0 lg:pt-8">
                <Paginator
                  pageNumber={pageNumber}
                  pageCount={pageCount}
                  onClickPage={onClickPage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrdersPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
