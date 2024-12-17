"use client";

import {
  ButtonUnderlined,
  DropdownBoxMultiWithSearch,
  DropdownBoxMultiWithSearchMobile,
} from "@/components/Forms";
import { DownIcon, UpIcon } from "@/components/Icons";
import { StocksList } from "@/components/Sections";
import { LOCALSTORAGES, STATUS_CODES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { AuthModalContext } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthProvider";
import { FilterContext } from "@/context/FilterContext";
import { StockContext } from "@/context/StockContext";
import {
  ProductItemProps,
  dropdownItemInterface,
  productStocksInterface,
} from "@/interfaces";
import { getProductStocks } from "@/services/catalogsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductSimpleCard from "../ProductSimpleCard";
import ProgressBar from "../ProgressBar";
import ReviewCard from "../ReviewCard";

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  isLoading = true,
  reviews = [],
  reviewTotalCount = 0,
  onLoadMoreReviews,
  stocksTips,
  variants,
  couponId,
}) => {
  const t = useTranslations();
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<
    dropdownItemInterface[]
  >([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState<boolean>(false);
  const [progressBarWidth, setProgressBarWidth] = useState<number>(0);
  const [productStocks, setProductStocks] = useState<productStocksInterface[]>(
    []
  );
  const [fetchStocksErrMsg, setFetchStocksErrMsg] = useState<string>("");
  const [gotStocks, setGotStocks] = useState<boolean>(false);
  const [activeStock, setActiveStock] = useState<productStocksInterface>();
  const [currentLoadingProductId, setCurrentLoadingProductId] =
    useState<string>("");
  const { setStock } = useContext(StockContext);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { filterOption } = useContext(FilterContext);
  const { setIsOpenAuthModal, setCallbackFunc, setDefaultTab, setLastProduct } =
    useContext(AuthModalContext);

  let checkLoadingStateId: any;

  useEffect(() => {
    checkLoadingStateId = setInterval(checkLoadingState, 100);
    return () => {
      clearInterval(checkLoadingStateId);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const lastSearchState = getDataFromLocalStorageWithExpiry(
        LOCALSTORAGES.LAST_SEARCH_STATE
      );
      if (lastSearchState) {
        if (lastSearchState.initload) onClickAvailable();
        localStorage.removeItem(LOCALSTORAGES.LAST_SEARCH_STATE);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoadingStocks) return;
    if (!product) return;
    const savedStocks =
      getDataFromLocalStorageWithExpiry(LOCALSTORAGES.STOCKS) ?? {};
    const loaderId = setInterval(() => {
      setProgressBarWidth((prev) => {
        savedStocks[currentLoadingProductId] = {
          ...savedStocks[currentLoadingProductId],
          bar: prev + 0.07,
        };
        saveDataInLocalStorage(LOCALSTORAGES.STOCKS, savedStocks);
        return prev + 0.07;
      });
    }, 200);
    return () => {
      clearInterval(loaderId);
    };
  }, [isLoadingStocks]);

  const checkLoadingState = () => {
    const savedStocks =
      getDataFromLocalStorageWithExpiry(LOCALSTORAGES.STOCKS) ?? {};
    for (const product_id in savedStocks) {
      if (savedStocks[product_id].isLoaded === false) {
        if (savedStocks[product_id].bar > 84) {
          setFetchStocksErrMsg(t("product.stock_err"));
          delete savedStocks[product_id];
          saveDataInLocalStorage(LOCALSTORAGES.STOCKS, savedStocks);
          setIsLoadingStocks(false);
          setProgressBarWidth(0);
          setCurrentLoadingProductId("");
          return;
        }
        setIsLoadingStocks(true);
        setProgressBarWidth(savedStocks[product_id].bar);
        setCurrentLoadingProductId(product_id);
        return;
      }
    }
    setIsLoadingStocks(false);
    setProgressBarWidth(0);
    setCurrentLoadingProductId("");
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const onClickAvailable = () => {
    setGotStocks(false);
    setFetchStocksErrMsg("");
    if (!product) return;
    if (!isLoggedIn) {
      setDefaultTab("login");
      setCallbackFunc(null);
      setLastProduct(product.id);
      setIsOpenAuthModal(true);
      return;
    }
    const savedStocks =
      getDataFromLocalStorageWithExpiry(LOCALSTORAGES.STOCKS) ?? {};
    // if (savedStocks[product.id]) {
    //   setProductStocks(savedStocks[product.id].data);
    //   setGotStocks(true);
    //   return;
    // }
    setProgressBarWidth(0);
    savedStocks[product.id] = { isLoaded: false };
    saveDataInLocalStorage(LOCALSTORAGES.STOCKS, savedStocks);
    getProductStocks(
      product.id,
      filterOption.sizes.map((s: dropdownItemInterface) => s.value).join(",")
    )
      .then((res) => {
        setIsLoadingStocks(false);
        setProductStocks(res as productStocksInterface[]);
        savedStocks[product.id] = {
          data: res,
          isLoaded: true,
          bar: 0,
        };
        saveDataInLocalStorage(LOCALSTORAGES.STOCKS, savedStocks);
        setGotStocks(true);
      })
      .catch((err) => {
        setIsLoadingStocks(false);
        delete savedStocks[product.id];
        saveDataInLocalStorage(LOCALSTORAGES.STOCKS, savedStocks);
        if (err.response.status === STATUS_CODES.UNAUTHORIZED) {
          setDefaultTab("login");
          setCallbackFunc(null);
          setLastProduct(product.id);
          setIsOpenAuthModal(true);
        } else setFetchStocksErrMsg(err.response.data.message);
      });
  };

  const onClickInit = () => {
    localStorage.removeItem(LOCALSTORAGES.STOCKS);
    onClickAvailable();
  };

  const onClickBuy = (st: productStocksInterface) => {
    setStock(st);
    if (!product) return;
    if (couponId) router.push(`/coupons/${couponId}/${product.id}/buy`);
    else router.push(`/buy/${product.id}`);
  };

  return (
    <div className="flex flex-col p-4 pt-0 lg:pt-4 bg-white rounded-lg lg:shadow-custom-1 lg:transition-shadow lg:duration-200 relative overflow-y-visible">
      <ProductSimpleCard
        isShowLabels={true}
        isLoading={isLoading}
        product={product}
        desktopBuyerColor
        mobileBuyerColor
      />
      {!isLoading && (
        <>
          <div className="mt-10px lg:mt-3">
            <div className="flex-col flex am-gapY-12px">
              <p
                className={`text-sm text-neutral-600 ${
                  isDescriptionExpanded ? "" : "line-clamp-3"
                }`}
              >
                {product?.description}
              </p>
              <button
                onClick={toggleDescription}
                className="text-sky-600 text-sm flex items-center am-gapX-4px w-fit"
              >
                <span>{t("product.description")}</span>
                {isDescriptionExpanded ? <UpIcon /> : <DownIcon />}
              </button>
            </div>
          </div>
          <div className={`mt-18px lg:mt-5 ${isLoading ? "hidden" : ""}`}>
            <div className={`${gotStocks ? "hidden" : ""}`}>
              {fetchStocksErrMsg && (
                <div className="text-center p-2 rounded-xl border border-yellow-400 bg-yellow-50 text-xs mb-2">
                  {fetchStocksErrMsg}
                </div>
              )}
              <ButtonUnderlined
                onClick={onClickAvailable}
                title={
                  isLoadingStocks
                    ? Math.ceil(
                        progressBarWidth /
                          MAGIC_NUMBERS.BUTTON_CHANGE_TIME_STOCKS
                      ) %
                        3 ===
                      1
                      ? t("product.interview")
                      : Math.ceil(
                          progressBarWidth /
                            MAGIC_NUMBERS.BUTTON_CHANGE_TIME_STOCKS
                        ) %
                          3 ===
                        2
                      ? t("product.checking_available")
                      : t("product.checking_data")
                    : t("product.show_available_positions")
                }
                status={isLoadingStocks ? "disable" : "active"}
              />
              <div className={`${isLoadingStocks ? "pb-4" : "hidden"} mt-2`}>
                <ProgressBar width={progressBarWidth} />
                <p className="mt-2 text-center text-indigo-80 font-medium text-sm">
                  {t("common.wait_for_download")}
                </p>
                <div className="mt-2">
                  <Swiper
                    spaceBetween={8}
                    slidesPerView={1}
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000 }}
                    pagination={{
                      clickable: true,
                      el: ".swiper-pagination",
                    }}
                    className="relative"
                  >
                    {stocksTips.map((s, _idx) => (
                      <SwiperSlide key={_idx}>
                        <div className="p-3 lg:p-4 rounded-xl border border-blue-50 text-indigo-300 text-sm text-center">
                          {s}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="swiper-pagination absolute h-9 flex items-center justify-center lg:bottom-0"></div>
                </div>
              </div>
            </div>
            <div
              className={`${
                gotStocks
                  ? "flex flex-col am-gapY-8px am-lg-gapY-12px"
                  : "hidden"
              }`}
            >
              <ButtonUnderlined
                onClick={onClickInit}
                title={t("common.update")}
                status="active"
              />
              <div className="hidden lg:block sizes-filter">
                <DropdownBoxMultiWithSearch
                  searchable={false}
                  list={variants}
                  activeItems={selectedVariants}
                  onChange={setSelectedVariants}
                  title={t("common.available")}
                  totalTitle={t("common.all_variant")}
                />
              </div>
              <div className="block lg:hidden sizes-filter">
                <DropdownBoxMultiWithSearchMobile
                  list={variants}
                  activeItems={selectedVariants}
                  onChange={setSelectedVariants}
                  title={t("common.available")}
                  totalTitle={t("common.all_variant")}
                />
              </div>
              <StocksList
                activeItem={activeStock}
                onClick={setActiveStock}
                onClickBuy={onClickBuy}
                deliveries={variants}
                list={
                  selectedVariants.length === 0 ||
                  selectedVariants.length === variants.length
                    ? productStocks
                    : productStocks.filter((ps) => {
                        let count = 0;
                        selectedVariants.forEach((sv) => {
                          if (
                            ps.delivery
                              .toLowerCase()
                              .includes(sv.label.toLowerCase())
                          )
                            count++;
                        });
                        return count > 0;
                      })
                }
              />
            </div>
          </div>
          {reviews.length > 0 && (
            <p className="font-semibold text-base leading-8 mt-2 lg:mt-3">
              {t("common.reviews")}
            </p>
          )}
          <div
            className={`mt-3 lg:mt-10px flex-col am-gapY-12px am-lg-gapY-8px ${
              isLoading || reviews.length > 0 ? "flex" : "hidden"
            }`}
          >
            {isLoading ? (
              Array(2)
                .fill(0)
                .map((_, idx) => <ReviewCard isLoading={true} key={idx} />)
            ) : reviews ? (
              reviews.map((r, idx) => <ReviewCard review={r} key={idx} />)
            ) : (
              <></>
            )}
          </div>
          {reviewTotalCount > reviews.length && (
            <div className="mt-3 lg:mt-6">
              <ButtonUnderlined
                onClick={() => {
                  if (onLoadMoreReviews) onLoadMoreReviews();
                  return;
                }}
                title={t("common.load_more")}
                status="active"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductItem;
