"use client";

import { Layout } from "@/components/Layouts";
import { OrderSection } from "@/components/Sections";
import { useAuth } from "@/context/AuthProvider";
import { orderInterface } from "@/interfaces";
import { getOrder } from "@/services/ordersApi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderDetailPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<orderInterface>();
  const { isLoggedIn } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    if (router.isReady && router.query.orderId) {
      getInitData(router.query.orderId as string);
    }
  }, [router.isReady, router.query.orderId]);

  const getInitData = async (id: string): Promise<void> => {
    setOrderId(id);
    setIsLoading(true);
    try {
      const res = await getOrder(id);
      setOrder(res);
    } catch (err) {
      console.log("Error fetching the initial data", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {isLoggedIn && <OrderSection order={order} isLoading={isLoading} />}
    </Layout>
  );
};

export default OrderDetailPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
