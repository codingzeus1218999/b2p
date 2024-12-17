"use client";

import {
  DropdownBoxMultiWithSearch,
  DropdownBoxMultiWithSearchMobile,
  DropdownBoxWithSearch,
  DropdownBoxWithSearchMobile,
  NestedDropdownBoxMultiWithSearch,
  NestedDropdownBoxMultiWithSearchMobile,
  Paginator,
  Sorter,
} from "@/components/Forms";
import { InfoCircleIcon, LeftIcon } from "@/components/Icons";
import { Layout } from "@/components/Layouts";
import { CouponCard, NavigatorBack, ProductListItem } from "@/components/Units";
import { MAGIC_NUMBERS } from "@/constants/ui";
import {
  couponInterface,
  dropdownItemInterface,
  nestedDropdownItemInterface,
  productInterface,
} from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import { getCoupon, getProductsByCouponId } from "@/services/catalogsApi";
import {
  fetchCategories,
  fetchDefaultType,
  fetchSizesByTypeId,
  fetchTypes,
} from "@/services/directoriesApi";
import { getCouponText } from "@/services/instructionsApi";
import {
  mapCategoriesToNestedDropdownData,
  mapSizesToDropdownData,
  mapTypesToDropdownData,
} from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CouponBuyerPage = () => {
  const t = useTranslations();
  const [isLoadingInit, setIsLoadingInit] = useState<boolean>(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [textCouponTitle, setTextCouponTitle] = useState<string>("");
  const [textCouponContent, setTextCouponContent] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const [sizeList, setSizeList] = useState<dropdownItemInterface[]>([]);
  const [selectedSize, setSelectedSize] = useState<dropdownItemInterface[]>([]);
  const [categoryList, setCategoryList] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [productSort, setProductSort] = useState<dropdownItemInterface>();
  const [couponId, setCouponId] = useState<string>("");
  const [coupon, setCoupon] = useState<couponInterface>();
  const [products, setProducts] = useState<productInterface[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.couponId) {
      getInitData(router.query.couponId as string);
    }
  }, [router.isReady, router.query.couponId]);

  const getInitData = async (cid: string) => {
    setCouponId(cid);
    setIsLoadingInit(true);
    setIsLoadingProducts(true);
    try {
      const res = await getCouponText();
      setTextCouponContent(res.content);
      setTextCouponTitle(res.title);
      const dt = sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const ts = mapTypesToDropdownData(await fetchTypes());
      const cl = mapCategoriesToNestedDropdownData(await fetchCategories());
      if (dt) {
        setSelectedType({ value: dt.id, label: dt.title });
        const szs = mapSizesToDropdownData(await fetchSizesByTypeId(dt.id));
        setSizeList(szs);
      }
      setTypeList(ts);
      setCategoryList(cl);
      const cres = await getCoupon(cid);
      const ps = await getProductsByCouponId(cid, dt.id);
      setCoupon(cres);
      setProducts(ps.data);
      setPageCount(Math.ceil(ps.meta.total / ps.meta.limit));
    } catch (err) {
      console.log("Error getting init data", err);
    } finally {
      setIsLoadingInit(false);
      setIsLoadingProducts(false);
    }
  };

  const onChangeType = async (type: dropdownItemInterface) => {
    setIsLoadingProducts(true);
    setSelectedType(type);
    try {
      const szs = mapSizesToDropdownData(await fetchSizesByTypeId(type.value));
      setSelectedSize([]);
      setSizeList(szs);
      const ps = await getProductsByCouponId(
        couponId,
        type.value,
        "",
        selectedCategories.map((c) => c.value).join(","),
        MAGIC_NUMBERS.COUPONS_PER_PAGE,
        0,
        productSort?.value
      );
      setProducts(ps.data);
      setPageNumber(1);
      setPageCount(Math.ceil(ps.meta.total / ps.meta.limit));
    } catch (err) {
      console.log("Error fetching the products data", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };
  const onChangeCategory = async (vals: nestedDropdownItemInterface[]) => {
    if (!selectedType) return;
    setIsLoadingProducts(true);
    setSelectedCategories(vals);
    try {
      const ps = await getProductsByCouponId(
        couponId,
        selectedType.value,
        selectedSize.map((c) => c.value).join(","),
        vals.map((c) => c.value).join(","),
        MAGIC_NUMBERS.COUPONS_PER_PAGE,
        0,
        productSort?.value
      );
      setProducts(ps.data);
      setPageNumber(1);
      setPageCount(Math.ceil(ps.meta.total / ps.meta.limit));
    } catch (err) {
      console.log("Error fetching the products data", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const onClickPage = async (val: number) => {
    if (!selectedType) return;
    setIsLoadingProducts(true);
    setPageNumber(val);
    try {
      const ps = await getProductsByCouponId(
        couponId,
        selectedType.value,
        selectedSize.map((c) => c.value).join(","),
        selectedCategories.map((c) => c.value).join(","),
        MAGIC_NUMBERS.COUPONS_PER_PAGE,
        MAGIC_NUMBERS.COUPONS_PER_PAGE * (val - 1),
        productSort?.value
      );
      setProducts(ps.data);
    } catch (err) {
      console.log("Error fetching the products data", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const onChangeSize = async (val: dropdownItemInterface[]) => {
    if (!selectedType) return;
    setIsLoadingProducts(true);
    setSelectedSize(val);
    try {
      const ps = await getProductsByCouponId(
        couponId,
        selectedType.value,
        val.map((c) => c.value).join(","),
        selectedCategories.map((c) => c.value).join(","),
        MAGIC_NUMBERS.COUPONS_PER_PAGE,
        0,
        productSort?.value
      );
      setProducts(ps.data);
      setPageNumber(1);
      setPageCount(Math.ceil(ps.meta.total / ps.meta.limit));
    } catch (err) {
      console.log("Error fetching the products data", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const onChangeProductSort = async (val: dropdownItemInterface) => {
    if (!selectedType) return;
    setIsLoadingProducts(true);
    setProductSort(val);
    try {
      const ps = await getProductsByCouponId(
        couponId,
        selectedType.value,
        selectedSize.map((c) => c.value).join(","),
        selectedCategories.map((c) => c.value).join(","),
        MAGIC_NUMBERS.COUPONS_PER_PAGE,
        0,
        val.value
      );
      setProducts(ps.data);
      setPageNumber(1);
      setPageCount(Math.ceil(ps.meta.total / ps.meta.limit));
    } catch (err) {
      console.log("Error fetching the products data", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const onClickProduct = (id: string) => {
    router.push(`/coupons/${couponId}/${id}`);
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
          <div className="flex-1 max-w-full">
            <div className="lg:hidden px-4 py-3 relative text-center font-semibold text-base leading-10">
              <LeftIcon
                className="absolute cursor-pointer left-4 top-5"
                onClick={() => {
                  router.back();
                }}
              />
              <p>
                {t("product.coupon")}{" "}
                {Number(coupon?.amount).toLocaleString("ru-RU")} ₽
              </p>
            </div>
            <div className="hidden lg:block">
              <NavigatorBack />
            </div>
            <div className="px-4 lg:px-0">
              <CouponCard isLoading={isLoadingInit} data={coupon} />
              <div className="py-3 flex flex-col am-gapY-8px lg:hidden">
                <DropdownBoxWithSearchMobile
                  label={t("common.type_size")}
                  list={typeList}
                  activeItem={selectedType}
                  onChange={onChangeType}
                />
                <DropdownBoxMultiWithSearchMobile
                  title={t("common.size")}
                  list={sizeList}
                  activeItems={selectedSize}
                  onChange={onChangeSize}
                  totalTitle={t("common.all_size")}
                />
                <NestedDropdownBoxMultiWithSearchMobile
                  activeItems={selectedCategories}
                  list={categoryList}
                  onChange={onChangeCategory}
                  title={t("common.category")}
                  totalTitle={t("common.all_category")}
                />
              </div>
              <div className="hidden lg:flex items-center justify-between py-4 am-gapX-16px">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <DropdownBoxWithSearch
                    label={t("common.type_size")}
                    list={typeList}
                    activeItem={selectedType}
                    onChange={onChangeType}
                  />
                  <DropdownBoxMultiWithSearch
                    title={t("common.size")}
                    list={sizeList}
                    activeItems={selectedSize}
                    onChange={onChangeSize}
                    totalTitle={t("common.all_size")}
                  />
                  <NestedDropdownBoxMultiWithSearch
                    activeItems={selectedCategories}
                    list={categoryList}
                    onChange={onChangeCategory}
                    title={t("common.category")}
                    totalTitle={t("common.all_category")}
                  />
                </div>
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
            </div>
            <div className="flex flex-col am-gapY-8px am-lg-gapY-16px">
              {isLoadingProducts ? (
                Array(3)
                  .fill(0)
                  .map((_, _idx) => <ProductListItem key={_idx} isLoading />)
              ) : products.length === 0 ? (
                <></>
              ) : (
                products.map((p, _idx) => (
                  <ProductListItem
                    key={_idx}
                    product={p}
                    onClickItem={() => onClickProduct(p.id)}
                  />
                ))
              )}
            </div>
            {pageCount > 1 && (
              <div className="hidden lg:block pt-8 pb-4">
                <Paginator
                  onClickPage={onClickPage}
                  pageCount={pageCount}
                  pageNumber={pageNumber}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CouponBuyerPage;

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
