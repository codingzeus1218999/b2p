"use client";

import { InfoCircleIcon, LeftIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { CouponCard, NavigatorBack, ProductItem } from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  couponInterface,
  dropdownItemInterface,
  productInterface,
  reviewCardInterface,
  tipStocksInterface,
} from "@/interfaces";
import {
  fetchProductById,
  fetchProductReviewsByProductId,
  getCoupon,
} from "@/services/catalogsApi";
import { fetchDeliveryTypes } from "@/services/directoriesApi";
import { fetchTipsStocks, getCouponText } from "@/services/instructionsApi";
import {
  mapDeliveryTypesToDropdownData,
  mapReviewsesToCardData,
} from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CouponProductPage = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [textCouponTitle, setTextCouponTitle] = useState<string>("");
  const [textCouponContent, setTextCouponContent] = useState<string[]>([]);
  const [stocksTips, setStocksTips] = useState<tipStocksInterface>([]);
  const [variants, setVariants] = useState<dropdownItemInterface[]>([]);
  const [reviews, setReviews] = useState<reviewCardInterface[]>([]);
  const [reviewTotalCount, setReviewTotalCount] = useState<number>(0);
  const [couponId, setCouponId] = useState<string>("");
  const [coupon, setCoupon] = useState<couponInterface>();
  const [productId, setProductId] = useState<string>("");
  const [product, setProduct] = useState<productInterface>();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.couponId && router.query.productId) {
      getInitData(
        router.query.couponId as string,
        router.query.productId as string
      );
    }
  }, [router.isReady, router.query.couponId, router.query.productId]);

  const getInitData = async (cid: string, pid: string) => {
    setCouponId(cid);
    setProductId(pid);
    setIsLoading(true);
    try {
      const res = await getCouponText();
      setTextCouponContent(res.content);
      setTextCouponTitle(res.title);
      const tips = await fetchTipsStocks();
      const vd = await fetchDeliveryTypes();
      const variantData = mapDeliveryTypesToDropdownData(vd);
      const rss = await fetchProductReviewsByProductId(pid);
      setStocksTips(tips);
      setVariants(variantData);
      if (rss) {
        setReviews(await mapReviewsesToCardData(rss.data));
        setReviewTotalCount(rss.meta.total);
      }
      const pd = await fetchProductById(pid);
      if (pd) setProduct(pd);
      const co = await getCoupon(cid);
      setCoupon(co);
    } catch (err) {
      console.log("Error getting init data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoadMoreReviews = async () => {
    const moreRs = await fetchProductReviewsByProductId(
      product?.id ?? "",
      reviews.length,
      MAGIC_NUMBERS.REVIEWS_IN_PRODUCT_CARD
    );
    if (!moreRs) return;
    const m = await mapReviewsesToCardData(moreRs.data);
    setReviews([...reviews, ...m]);
  };

  return (
    <Layout>
      <div className="lg:mt-8 pb-10 lg:pb-0">
        <div className="flex">
          <div className="hidden lg:block py-6 px-4 rounded-lg shadow-custom-1 w-336px h-fit mr-8">
            <InfoCircleIcon size={52} className="mx-auto" />
            <p className="my-10px uppercase font-semibold text-center">
              {textCouponTitle}
            </p>
            <div className="flex flex-col am-gapY-20px">
              {textCouponContent.map((c, _idx) => (
                <div dangerouslySetInnerHTML={{ __html: c }} key={_idx} />
              ))}
            </div>
          </div>
          <div className="flex-1 lg:max-w-calc1 max-w-full">
            <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
              <LeftIcon
                className="absolute cursor-pointer left-4 top-5"
                onClick={() => {
                  router.back();
                }}
              />
              <p>{t("product.information_p")}</p>
            </div>
            <div className="lg:flex hidden pr-4 items-center justify-between">
              <NavigatorBack />
              <p className="text-2xl font-semibold">
                {t("product.information_p")}
              </p>
            </div>
            <div className="px-4 lg:px-0">
              <CouponCard isLoading={isLoading} data={coupon} />
            </div>
            <div className="lg:mt-4">
              <ProductItem
                stocksTips={stocksTips}
                variants={variants}
                product={product}
                reviewTotalCount={reviewTotalCount}
                reviews={reviews}
                isLoading={isLoading}
                onLoadMoreReviews={onLoadMoreReviews}
                couponId={couponId}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CouponProductPage;

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
