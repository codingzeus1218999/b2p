"use client";

import {
  ButtonUnderlined,
  DropdownBoxMultiWithSearch,
  DropdownBoxMultiWithSearchMobile,
  DropdownBoxWithSearch,
  DropdownBoxWithSearchMobile,
  Paginator,
  Sorter,
  ToggleTab,
} from "@/components/Forms";
import { LeftIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import {
  BuyerDetailCard,
  NavigatorBack,
  ProductSimpleCard,
  ReviewCard,
} from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  buyerInterface,
  dropdownItemInterface,
  productInterface,
  reviewCardInterface,
  toggleItemInterface,
} from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import {
  fetchDefaultType,
  fetchSizesByTypeId,
  fetchTypes,
} from "@/services/directoriesApi";
import {
  fetchBuyerById,
  fetchProductsByBuyerId,
  fetchReviewsByBuyerId,
} from "@/services/shopsApi";
import {
  mapReviewsesToCardData,
  mapSizesToDropdownData,
  mapTypesToDropdownData,
} from "@/utils/mapUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Buyer = () => {
  const t = useTranslations();
  const [page, setPage] = useState<string>("product");
  const [isLoadingInit, setIsLoadingInit] = useState<boolean>(true);
  const [isLoadingInPage, setIsLoadingInPage] = useState<boolean>(false);
  const [buyerId, setBuyerId] = useState<string>("");
  const [buyerDetail, setBuyerDetail] = useState<buyerInterface>();
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const [sizeList, setSizeList] = useState<dropdownItemInterface[]>([]);
  const [selectedSize, setSelectedSize] = useState<dropdownItemInterface[]>([]);
  const [products, setProducts] = useState<productInterface[]>([]);
  const [reviews, setReviews] = useState<reviewCardInterface[]>([]);
  const [productSort, setProductSort] = useState<dropdownItemInterface>();
  const [reviewSort, setReviewSort] = useState<dropdownItemInterface>();
  const [productPageNumber, setProductPageNumber] = useState<number>(1);
  const [productPageCount, setProductPageCount] = useState<number>(0);
  const [reviewPageNumber, setReviewPageNumber] = useState<number>(1);
  const [reviewPageCount, setReviewPageCount] = useState<number>(0);
  const [toggleActiveItem, setToggleActiveItem] = useState<toggleItemInterface>(
    { label: t("product.products"), value: "product" }
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.buyerId) {
      getInitData(router.query.buyerId as string);
    }
  }, [router.isReady, router.query.buyerId]);

  const getInitData = async (bid: string): Promise<void> => {
    setBuyerId(bid);
    setIsLoadingInit(true);
    try {
      const dt = sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const b = await fetchBuyerById(bid);
      const tl = mapTypesToDropdownData(await fetchTypes());
      const pc = await fetchProductsByBuyerId(
        bid,
        dt?.id ?? "",
        "",
        MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
        1
      );
      const rc = await fetchReviewsByBuyerId(
        bid,
        "",
        MAGIC_NUMBERS.REVEIWS_PER_PAGE,
        1
      );
      if (dt) {
        setSelectedType({ value: dt.id, label: dt.title });
        const szs = mapSizesToDropdownData(await fetchSizesByTypeId(dt.id));
        setSizeList(szs);
      }
      if (b) setBuyerDetail(b);
      setTypeList(tl);
      if (pc) {
        setProducts(pc.data);
        setProductPageCount(pc.meta.total);
      }
      if (rc) {
        setReviews(await mapReviewsesToCardData(rc.data));
        setReviewPageCount(Math.ceil(rc.meta.total / rc.meta.limit));
      }
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoadingInit(false);
    }
  };

  const onClickProductCard = (id: string) => {
    if (!isAuthModalOpen) {
      router.push(`/products/${id}`);
    }
  };

  const toggleAuthModal = (isOpen: boolean) => {
    setIsAuthModalOpen(isOpen);
  };

  const onChangeProductSort = async (val: dropdownItemInterface) => {
    setProductSort(val);
    setIsLoadingInPage(true);
    setProductPageNumber(1);
    try {
      const pc = await fetchProductsByBuyerId(
        buyerId,
        selectedType?.value ?? "",
        selectedSize.map((v) => v.value).join(","),
        MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
        1,
        val.value
      );
      if (pc) {
        setProducts(pc.data);
        setProductPageCount(pc.meta.total);
      }
    } catch (err) {
      console.log("Error sorting the products data");
    } finally {
      setIsLoadingInPage(false);
    }
  };
  const onChangeProductType = async (val: dropdownItemInterface) => {
    setSelectedType(val);
    setIsLoadingInPage(true);
    try {
      const szs = mapSizesToDropdownData(await fetchSizesByTypeId(val.value));
      setSelectedSize([]);
      setSizeList(szs);
      setProductPageNumber(1);
      const pc = await fetchProductsByBuyerId(
        buyerId,
        val?.value ?? "",
        "",
        MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
        1,
        productSort?.value
      );
      if (pc) {
        setProducts(pc.data);
        setProductPageCount(pc.meta.total);
      }
    } catch (err) {
      console.log("Error fetching the products data");
    } finally {
      setIsLoadingInPage(false);
    }
  };
  const onChangeProductSize = async (val: dropdownItemInterface[]) => {
    setSelectedSize(val);
    setIsLoadingInPage(true);
    try {
      setProductPageNumber(1);
      const pc = await fetchProductsByBuyerId(
        buyerId,
        selectedType?.value ?? "",
        val.map((v) => v.value).join(","),
        MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
        1,
        productSort?.value
      );
      if (pc) {
        setProducts(pc.data);
        setProductPageCount(pc.meta.total);
      }
    } catch (err) {
      console.log("Error fetching the products data");
    } finally {
      setIsLoadingInPage(false);
    }
  };
  const onClickPagenator = async (num: number) => {
    setProductPageNumber(num);
    setIsLoadingInPage(true);
    try {
      const pc = await fetchProductsByBuyerId(
        buyerId,
        selectedType?.value ?? "",
        selectedSize.map((s) => s.value).join(","),
        MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
        num,
        productSort?.value
      );
      if (pc) {
        setProducts(pc.data);
      }
    } catch (err) {
      console.log("Error fetching the products data");
    } finally {
      setIsLoadingInPage(false);
    }
  };

  const onChangeReviewSort = async (val: dropdownItemInterface) => {
    setReviewSort(val);
    setIsLoadingInPage(true);
    setReviewPageNumber(1);
    try {
      const rc = await fetchReviewsByBuyerId(
        buyerId,
        val.value,
        MAGIC_NUMBERS.REVEIWS_PER_PAGE,
        1
      );
      if (rc) {
        setReviews(await mapReviewsesToCardData(rc.data));
        setReviewPageCount(Math.ceil(rc.meta.total / rc.meta.limit));
      }
    } catch (err) {
      console.log("Error sorting the review data");
    } finally {
      setIsLoadingInPage(false);
    }
  };

  const onClickLoadMoreReviews = async () => {
    setIsLoadingInPage(true);
    setReviewPageNumber(reviewPageNumber + 1);
    try {
      const rc = await fetchReviewsByBuyerId(
        buyerId,
        reviewSort?.value ?? "",
        MAGIC_NUMBERS.REVEIWS_PER_PAGE,
        reviewPageNumber + 1
      );
      if (rc) {
        setReviews([...reviews, ...(await mapReviewsesToCardData(rc.data))]);
      }
    } catch (err) {
      console.log("Error gettting more review data");
    } finally {
      setIsLoadingInPage(false);
    }
  };

  return (
    <Layout>
      <div className="hidden lg:block mt-8">
        <NavigatorBack />
      </div>
      <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
        <LeftIcon
          className="absolute cursor-pointer left-4 top-5"
          onClick={() => router.back()}
        />
        {t("buyer.information")}
      </div>
      {!isLoadingInit && !buyerDetail ? (
        <></>
      ) : (
        <>
          <BuyerDetailCard
            isLoading={isLoadingInit}
            buyerDetail={buyerDetail}
          />
          <div className="px-4 py-3 lg:px-0 lg:py-4 flex flex-col lg:flex-row -my-1 lg:-mx-2">
            <div className="flex items-center justify-between my-1 lg:mx-2">
              <ToggleTab
                activeItem={toggleActiveItem}
                list={[
                  { label: t("product.products"), value: "product" },
                  { label: t("common.reviews"), value: "review" },
                ]}
                onClick={(val) => {
                  setToggleActiveItem(val);
                  setPage(val.value);
                }}
              />
              <div className="block lg:hidden">
                <div
                  className={classNames("flex items-center justify-center", {
                    hidden: page !== "product",
                  })}
                >
                  <Sorter
                    position="left"
                    list={[
                      { label: t("common.sort_rate"), value: "rate" },
                      { label: t("common.sort_price"), value: "price" },
                    ]}
                    activeSortItem={productSort}
                    onChange={onChangeProductSort}
                  />
                </div>
                <div
                  className={classNames("flex items-center justify-center", {
                    hidden: page !== "review",
                  })}
                >
                  <Sorter
                    position="left"
                    list={[
                      { label: t("common.sort_rate"), value: "rate" },
                      { label: t("common.sort_date"), value: "date" },
                    ]}
                    activeSortItem={reviewSort}
                    onChange={onChangeReviewSort}
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex-1 my-1 lg:mx-2">
              <div className="lg:hidden">
                <DropdownBoxWithSearchMobile
                  label={t("common.type_size")}
                  list={typeList}
                  activeItem={selectedType}
                  onChange={onChangeProductType}
                />
              </div>
              <div
                className={classNames("hidden lg:grid-cols-2 lg:gap-4", {
                  "lg:grid": page === "product",
                })}
              >
                <DropdownBoxWithSearch
                  label={t("common.type_size")}
                  list={typeList}
                  activeItem={selectedType}
                  onChange={onChangeProductType}
                />
                <DropdownBoxMultiWithSearch
                  title={t("common.size")}
                  list={sizeList}
                  activeItems={selectedSize}
                  onChange={onChangeProductSize}
                  totalTitle={t("common.all_size")}
                />
              </div>
            </div>
            <div className="my-1 lg:mx-2">
              <div className="lg:hidden">
                <DropdownBoxMultiWithSearchMobile
                  title={t("common.size")}
                  list={sizeList}
                  activeItems={selectedSize}
                  onChange={onChangeProductSize}
                  totalTitle={t("common.all_size")}
                />
              </div>
              <div className="hidden lg:block">
                <div
                  className={classNames("flex items-center justify-center", {
                    hidden: page !== "product",
                  })}
                >
                  <Sorter
                    position="left"
                    list={[
                      { label: t("common.sort_rate"), value: "rate" },
                      { label: t("common.sort_price"), value: "price" },
                    ]}
                    activeSortItem={productSort}
                    onChange={onChangeProductSort}
                  />
                </div>
                <div
                  className={classNames("flex items-center justify-center", {
                    hidden: page !== "review",
                  })}
                >
                  <Sorter
                    position="left"
                    list={[
                      { label: t("common.sort_rate"), value: "rate" },
                      { label: t("common.sort_date"), value: "date" },
                    ]}
                    activeSortItem={reviewSort}
                    onChange={onChangeReviewSort}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={classNames({ hidden: page !== "product" })}>
            {!isLoadingInit && !isLoadingInPage && products.length === 0 ? (
              <p className="text-neutral-400 font-medium text-center lg:text-left leading-5 lg:leading-4 -mt-1 lg:mt-0">
                {t("common.no_data")}
              </p>
            ) : (
              <div className="pb-5 lg:pb-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                  {isLoadingInit || isLoadingInPage
                    ? Array.from({ length: 4 })
                        .fill(0)
                        .map((_, idx) => (
                          <div
                            className="py-3 px-4 rounded-lg shadow-custom-1 lg:hover:shadow-custom-3 lg:transition-all cursor-pointer"
                            key={idx}
                          >
                            <ProductSimpleCard
                              isShowLabels={true}
                              isLoading={true}
                              size={108}
                            />
                          </div>
                        ))
                    : products.map((p, _idx) => (
                        <div
                          key={_idx}
                          onClick={() => onClickProductCard(p.id)}
                          className="py-3 px-4 rounded-lg shadow-custom-1 lg:hover:shadow-custom-3 lg:transition-all cursor-pointer"
                        >
                          <ProductSimpleCard
                            product={p}
                            isShowLabels={true}
                            size={108}
                            toggleAuthModal={toggleAuthModal}
                            desktopBuyerLink={false}
                            mobileBuyerLink={false}
                          />
                        </div>
                      ))}
                </div>
                {productPageCount > 1 && (
                  <div className="pb-4 pt-6 lg:pt-8">
                    <Paginator
                      pageCount={productPageCount}
                      pageNumber={productPageNumber}
                      onClickPage={onClickPagenator}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={classNames({ hidden: page !== "review" })}>
            {!isLoadingInit && !isLoadingInPage && reviews.length === 0 ? (
              <p className="text-neutral-400 font-medium text-center lg:text-left leading-5 lg:leading-4 -mt-1 lg:mt-0">
                {t("common.no_data")}
              </p>
            ) : (
              <div className="px-4 lg:px-0 pb-10 lg:pb-0">
                <div className="flex flex-col -my-1 lg:-my-2">
                  {isLoadingInit
                    ? Array.from({ length: 2 })
                        .fill(0)
                        .map((_, idx) => (
                          <div className="my-1 lg:my-2" key={idx}>
                            <ReviewCard isLoading={true} />
                          </div>
                        ))
                    : reviews.map((r, _idx) => (
                        <div className="my-1 lg:my-2" key={_idx}>
                          <ReviewCard review={r} />
                        </div>
                      ))}
                </div>
                {reviewPageCount > reviewPageNumber && (
                  <div className="mt-4 lg:mt-6">
                    <ButtonUnderlined
                      onClick={onClickLoadMoreReviews}
                      status={
                        isLoadingInit || isLoadingInPage ? "disable" : "active"
                      }
                      title={t("common.load_more")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
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
