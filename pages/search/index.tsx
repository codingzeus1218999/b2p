"use client";

import { Paginator, Sorter } from "@/components/Forms";
import { DownIcon, LeftIcon, UpIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { SearchOptionLeft } from "@/components/Sections";
import {
  LoadingModal,
  NavigatorBack,
  ProductItem,
  ProductListItem,
} from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { FilterContext } from "@/context/FilterContext";
import { useToast } from "@/context/ToastContext";
import {
  dropdownItemInterface,
  productInterface,
  reviewCardInterface,
  tipStocksInterface,
} from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import {
  fetchProductById,
  fetchProductReviewsByProductId,
  searchProducts,
} from "@/services/catalogsApi";
import {
  fetchBrands,
  fetchDefaultType,
  fetchDeliveryTypes,
} from "@/services/directoriesApi";
import { fetchTipsStocks } from "@/services/instructionsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import {
  mapDeliveryTypesToDropdownData,
  mapReviewsesToCardData,
} from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const ProductSearchPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { id: paramId } = router.query;
  const { filterOption, setFilterOption } = useContext(FilterContext);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(true);
  const [products, setProducts] = useState<productInterface[]>([]);
  const [product, setProduct] = useState<productInterface>();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [productSort, setProductSort] = useState<
    dropdownItemInterface | undefined
  >(filterOption.sort);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<"search" | "detail">();
  const [reviews, setReviews] = useState<reviewCardInterface[]>([]);
  const [reviewTotalCount, setReviewTotalCount] = useState<number>(0);
  const [stocksTips, setStocksTips] = useState<tipStocksInterface>([]);
  const [variants, setVariants] = useState<dropdownItemInterface[]>([]);
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
  const { showToast } = useToast();
  const [runonce, setRunonce] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady && !runonce) {
      getInitData();
      if (paramId) {
        onClickProductItem(paramId as string);
      } else {
        const lastSearchState =
          getDataFromLocalStorageWithExpiry(LOCALSTORAGES.LAST_SEARCH_STATE) ??
          getDataFromLocalStorageWithExpiry(
            LOCALSTORAGES.SEARCH_LEAVE_PRODUCT_ID
          );
        if (lastSearchState) {
          onClickProductItem(lastSearchState?.pid ?? lastSearchState);
        } else {
          setPage("search");
        }
      }
      search(true);
      setRunonce(true);
    }
  }, [router.isReady, paramId]);

  useEffect(() => {
    if (page === "search")
      saveDataInLocalStorage(LOCALSTORAGES.SEARCH_LEAVE_PRODUCT_ID, "");
  }, [page]);

  const getInitData = async () => {
    try {
      const tips = await fetchTipsStocks();
      const vd = await fetchDeliveryTypes();
      const variantData = mapDeliveryTypesToDropdownData(vd);
      setStocksTips(tips);
      setVariants(variantData);
    } catch (err) {
      console.log("Error fetching the initial data");
    }
  };

  const search = async (init: boolean = false): Promise<void> => {
    const dt = filterOption.type
      ? { id: filterOption.type.value, title: filterOption.type.label }
      : sessionStorage.getItem("access")
      ? await getAccountDefaultTypeSize()
      : await fetchDefaultType();
    const bl = await fetchBrands();
    if (!init && filterOption.brands.length === 0) {
      showToast(t("common.not_found"), "warning");
      setShowLoadingModal(false);
      return;
    }
    setIsLoadingList(true);
    setShowFilters(false);
    try {
      const data = await searchProducts({
        type_id: init ? dt?.id ?? "" : filterOption.type?.value ?? "",
        size_ids: filterOption.sizes.map((t) => t.value).join(","),
        brand_ids: init
          ? bl
              .filter((t) => t.available)
              .map((t) => t.id)
              .join(",")
          : filterOption.brands.map((t) => t.value).join(","),
        category_ids: filterOption.categories.map((t) => t.value).join(","),
        variant_ids: filterOption.variants.map((t) => t.value).join(","),
        from_price: filterOption.priceFrom,
        from_step: filterOption.stepFrom,
        to_price: filterOption.priceTo,
        to_step: filterOption.stepTo,
        limit: filterOption.limit,
        offset: filterOption.offset,
        sort: filterOption.sort?.value,
      });
      if (data) {
        setProducts(data.data);
        setPageNumber(
          (filterOption.offset ?? 0) / MAGIC_NUMBERS.PRODUCTS_PER_PAGE + 1
        );
        setPageCount(
          Math.ceil(data.meta.total / MAGIC_NUMBERS.PRODUCTS_PER_PAGE)
        );
      }
    } catch (err) {
      console.log("Error searching products data");
      showToast(t("home.search_err"), "warning");
    } finally {
      setIsLoadingList(false);
      setShowLoadingModal(false);
    }
  };

  const onClickSearch = () => {
    setShowLoadingModal(true);
    setPage("search");
    search();
  };

  const onChangeProductSort = (val: dropdownItemInterface) => {
    if (filterOption.brands.length === 0) {
      showToast(t("common.not_found"), "warning");
      return;
    }
    setProductSort(val);
    setFilterOption({ ...filterOption, sort: val });
    setShowLoadingModal(true);
    setTimeout(() => search(), 100);
  };

  const onClickPage = (num: number) => {
    if (filterOption.brands.length === 0) {
      showToast(t("common.not_found"), "warning");
      return;
    }
    setPageNumber(num);
    setFilterOption({
      ...filterOption,
      offset: (num - 1) * MAGIC_NUMBERS.PRODUCTS_PER_PAGE,
    });
  };

  const onClickProductItem = async (id: string) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage("detail");
    setIsLoadingProduct(true);
    router.push(`/search?id=${id}`);
    try {
      const p = await fetchProductById(id);
      const rss = await fetchProductReviewsByProductId(id);
      if (p) {
        setProduct(p);
        if (rss) {
          setReviews(await mapReviewsesToCardData(rss.data));
          setReviewTotalCount(rss.meta.total);
        }
        saveDataInLocalStorage(LOCALSTORAGES.SEARCH_LEAVE_PRODUCT_ID, id);
      } else {
        setPage("search");
        router.push("/search");
      }
    } catch (err) {
      console.log("Error fetching the product");
    } finally {
      setIsLoadingProduct(false);
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
      <LoadingModal isOpen={showLoadingModal} />
      {/* Обновляем этот вызов */}
      <div className="mt-0 lg:mt-8">
        <div className="flex flex-col lg:flex-row lg:pb-0 pb-3">
          <div className="w-full lg:w-336px lg:min-w-336px lg:mr-8">
            <div
              className={`lg:hidden h-52px px-4 ${
                page === "search" ? "flex" : "hidden"
              } justify-between items-center`}
            >
              <div
                className={`${
                  showFilters ? "" : "hidden"
                } flex items-center cursor-pointer`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex flex-col items-center justify-center w-fit mr-1">
                  <p className="text-sky-600 text-sm font-medium">
                    {t("home.hide_filter")}
                  </p>
                  <div className="mt-px h-px border-t border-dashed border-sky-600 w-full"></div>
                </div>
                <UpIcon size={20} />
              </div>
              <div
                className={`${
                  showFilters ? "hidden" : ""
                } flex items-center cursor-pointer`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex flex-col items-center justify-center w-fit mr-1">
                  <p className="text-indigo-300 text-sm font-medium">
                    {t("home.show_filter")}
                  </p>
                  <div className="mt-px h-px border-t border-dashed border-indigo-300 w-full"></div>
                </div>
                <DownIcon size={20} fill="#75ADE4" />
              </div>
              <div className={`${showFilters ? "hidden" : ""}`}>
                <Sorter
                  position="left"
                  list={[
                    { label: t("common.sort_rate"), value: "rate" },
                    { label: t("common.sort_rate"), value: "price" },
                  ]}
                  activeSortItem={productSort}
                  onChange={onChangeProductSort}
                />
              </div>
            </div>
            <div
              className={`${
                page === "detail"
                  ? "hidden lg:block"
                  : showFilters
                  ? "block"
                  : "hidden lg:block"
              }`}
            >
              <SearchOptionLeft onSearch={onClickSearch} />
            </div>
          </div>
          {page === "search" && (
            <div className="lg:flex-1 lg:max-w-calcs">
              <div className="hidden lg:block p-4">
                <Sorter
                  position="right"
                  list={[
                    { label: t("common.sort_rate"), value: "rate" },
                    { label: t("common.sort_rate"), value: "price" },
                  ]}
                  activeSortItem={productSort}
                  onChange={onChangeProductSort}
                  left={-16}
                />
              </div>
              <div className="flex flex-col -my-1 lg:-my-2">
                {isLoadingList ? (
                  Array(MAGIC_NUMBERS.PRODUCTS_PER_PAGE)
                    .fill(0)
                    .map((a, _idx) => (
                      <div className="my-1 lg:my-2" key={_idx}>
                        <ProductListItem isLoading={true} />
                      </div>
                    ))
                ) : products.length > 0 ? (
                  products.map((p, _idx) => (
                    <div className="my-1 lg:my-2" key={_idx}>
                      <ProductListItem
                        product={p}
                        key={_idx}
                        onClickItem={onClickProductItem}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center leading-5 font-medium text-neutral-400 my-1 lg:my-2">
                    {t("common.not_found")}
                  </p>
                )}
              </div>
              <div
                className={`pt-6 lg:pt-8 pb-4 px-4 lg:px-11 ${
                  pageCount === 1 ? "hidden" : ""
                }`}
              >
                {pageCount > 1 && (
                  <Paginator
                    pageNumber={pageNumber}
                    pageCount={pageCount}
                    onClickPage={onClickPage}
                  />
                )}
              </div>
            </div>
          )}
          {page === "detail" && (
            <div className="flex-1 overflow-visible product-page-right-side lg:max-w-calc1">
              <div className="hidden lg:flex items-center justify-between">
                <NavigatorBack
                  onOnePage={true}
                  onClick={() => {
                    setPage("search");
                    router.push("/search");
                  }}
                />
                <p className="font-semibold text-2xl mr-4">
                  {t("product.information_p")}
                </p>
              </div>
              <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
                <LeftIcon
                  className="absolute cursor-pointer left-4 top-5"
                  onClick={() => {
                    setPage("search");
                    router.push("/search");
                  }}
                />
                {t("product.information_p")}
              </div>
              <ProductItem
                product={product}
                isLoading={isLoadingProduct}
                reviews={reviews}
                reviewTotalCount={reviewTotalCount}
                onLoadMoreReviews={onLoadMoreReviews}
                stocksTips={stocksTips}
                variants={variants}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductSearchPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
