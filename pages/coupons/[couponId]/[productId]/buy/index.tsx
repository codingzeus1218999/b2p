"use client";

import { Layout } from "@/components/Layouts";
import { BuyFlowSection } from "@/components/Sections";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductBuyPage = () => {
  const [productId, setProductId] = useState<string>("");
  const [couponId, setCouponId] = useState<string>("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (router.isReady && router.query.productId && router.query.couponId) {
      if (!isLoggedIn) router.push("/");
      else {
        setCouponId(router.query.couponId as string);
        setProductId(router.query.productId as string);
      }
    }
  }, [router.isReady, router.query.productId, router.query.couponId]);

  return (
    <Layout>
      {isLoggedIn && productId && couponId && (
        <BuyFlowSection productId={productId} couponId={couponId} />
      )}
    </Layout>
  );
};

export default ProductBuyPage;

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
