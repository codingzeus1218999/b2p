"use client";

import { LeftIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { NavigatorBack, ProductItem } from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  dropdownItemInterface,
  productInterface,
  reviewCardInterface,
  tipStocksInterface,
} from "@/interfaces";
import {
  fetchProductById,
  fetchProductReviewsByProductId,
} from "@/services/catalogsApi";
import { fetchDeliveryTypes } from "@/services/directoriesApi";
import { fetchTipsStocks } from "@/services/instructionsApi";
import {
  mapDeliveryTypesToDropdownData,
  mapReviewsesToCardData,
} from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Buyer = () => {
  const t = useTranslations();
  const [isLoadingInit, setIsLoadingInit] = useState<boolean>(true);
  const [productId, setProductId] = useState<string>("");
  const [product, setProduct] = useState<productInterface>();
  const [stocksTips, setStocksTips] = useState<tipStocksInterface>([]);
  const [variants, setVariants] = useState<dropdownItemInterface[]>([]);
  const [reviews, setReviews] = useState<reviewCardInterface[]>([]);
  const [reviewTotalCount, setReviewTotalCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (router.isReady && router.query.productId) {
      getInitData(router.query.productId as string);
    }
  }, [router.isReady, router.query.productId]);

  const getInitData = async (pid: string): Promise<void> => {
    setProductId(pid);
    setIsLoadingInit(true);
    try {
      const p = await fetchProductById(pid);
      const tips = await fetchTipsStocks();
      const vd = await fetchDeliveryTypes();
      const variantData = mapDeliveryTypesToDropdownData(vd);
      const rss = await fetchProductReviewsByProductId(pid);
      if (p) setProduct(p);
      setStocksTips(tips);
      setVariants(variantData);
      if (rss) {
        setReviews(await mapReviewsesToCardData(rss.data));
        setReviewTotalCount(rss.meta.total);
      }
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoadingInit(false);
    }
  };

  const onLoadMoreReviews = async () => {
    if (!product) return;
    const moreRs = await fetchProductReviewsByProductId(
      product.id,
      reviews.length,
      MAGIC_NUMBERS.REVIEWS_IN_PRODUCT_CARD
    );
    if (!moreRs) return;
    const m = await mapReviewsesToCardData(moreRs.data);
    setReviews([...reviews, ...m]);
  };

  return (
    <Layout>
      <div className="hidden mt-8 lg:flex items-center justify-between">
        <NavigatorBack />
        <p className="text-2xl font-semibold mr-4">
          {t("product.information_p")}
        </p>
      </div>
      <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
        <LeftIcon
          className="absolute cursor-pointer left-4 top-5"
          onClick={() => router.back()}
        />
        {t("product.information_p")}
      </div>
      {!isLoadingInit && !product ? (
        <></>
      ) : (
        <ProductItem
          stocksTips={stocksTips}
          variants={variants}
          isLoading={isLoadingInit}
          product={product}
          reviewTotalCount={reviewTotalCount}
          reviews={reviews}
          onLoadMoreReviews={onLoadMoreReviews}
        />
      )}
    </Layout>
  );
};

export default Buyer;

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
