"use client";

import { Layout } from "@/components/Layouts";
import { BuyFlowSection } from "@/components/Sections";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProductBuyPage = () => {
  const [productId, setProductId] = useState<string>("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (router.isReady && router.query.productId) {
      if (!isLoggedIn) router.push("/");
      else setProductId(router.query.productId as string);
    }
  }, [router.isReady, router.query.productId]);

  return (
    <Layout>
      {isLoggedIn && productId && <BuyFlowSection productId={productId} />}
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
