"use client";

import {
  ButtonUnderlined,
  DropdownBoxWithSearch,
  DropdownBoxWithSearchMobile,
  NestedDropdownBoxMultiWithSearch,
  NestedDropdownBoxMultiWithSearchMobile,
  Paginator,
  SearchInput,
} from "@/components/Forms";
import { Layout } from "@/components/Layouts";
import { BuyerCard, SectionSeparator } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import {
  buyerInterface,
  dropdownItemInterface,
  nestedDropdownItemInterface,
} from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import {
  fetchCategories,
  fetchDefaultType,
  fetchTypes,
} from "@/services/directoriesApi";
import {
  fetchBuyersByName,
  fetchBuyersByTypeId,
  fetchFavoritesBuyers,
  fetchSimilarBuyers,
} from "@/services/shopsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import {
  mapCategoriesToNestedDropdownData,
  mapTypesToDropdownData,
} from "@/utils/mapUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const Buyers = () => {
  const t = useTranslations();
  const [isSearched, setIsSearched] = useState<boolean>(
    getDataFromLocalStorageWithExpiry(LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD)
      ? true
      : false
  );
  const [buyers, setBuyers] = useState<buyerInterface[]>([]);
  const [favoriteBuyers, setFavoriteBuyers] = useState<buyerInterface[]>([]);
  const [similarBuyers, setSimilarBuyers] = useState<buyerInterface[]>([]);
  const [typeList, setTypeList] = useState<dropdownItemInterface[]>([]);
  const [selectedType, setSelectedType] = useState<dropdownItemInterface>();
  const [categoryList, setCategoryList] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowLoadMore, setIsShowLoadMore] = useState<boolean>(false);
  const [isLoadingInPage, setIsLoadingInPage] = useState<boolean>(false);
  const [gapWidth, setGapWidth] = useState<number>(0);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [clearSignal, setClearSignal] = useState<number>(0);
  const [searchInputState, setSearchInputState] = useState<string>(
    getDataFromLocalStorageWithExpiry(LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD)
      ? "found"
      : "init"
  );
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    getInitData();
    calcResponsive();
    window.addEventListener("resize", calcResponsive);
    return () => {
      window.removeEventListener("resize", calcResponsive);
    };
  }, []);

  const calcResponsive = () => {
    const innerWid =
      window.innerWidth > 1023
        ? Math.min(1088, window.innerWidth) -
          (document.documentElement.scrollHeight > window.innerHeight ? 4 : 0)
        : window.innerWidth -
          (document.documentElement.scrollHeight > window.innerHeight ? 4 : 0) -
          32;
    const cardWid =
      window.innerWidth > 1023
        ? 168
        : window.innerWidth > 429
        ? 195
        : (innerWid - 8) / 2;
    setCardWidth(cardWid);
    const cardCountPerLine = Math.floor(innerWid / cardWid);
    const gapWid =
      (innerWid - cardWid * cardCountPerLine) / (cardCountPerLine - 1);
    setGapWidth(gapWid);
  };

  const onSearchByName = async (str: string) => {
    saveDataInLocalStorage(LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD, str);
    setIsSearched(str !== "");
    if (str === "") {
      setIsLoadingInPage(true);
      try {
        const bis = await fetchBuyersByTypeId(
          selectedType?.value ?? "",
          selectedCategories.map((c) => c.value).join(","),
          window.innerWidth > 1023
            ? MAGIC_NUMBERS.BUYERS_PER_PAGE_DESKTOP
            : MAGIC_NUMBERS.BUYERS_PER_PAGE_MOBILE
        );
        if (bis) {
          setBuyers(bis.data);
          setPageCount(bis.meta.total);
          setIsShowLoadMore(bis.meta.total > 1);
        }
      } catch (err) {
        console.log("Error fetching the buyer data");
      } finally {
        setIsLoadingInPage(false);
      }
    } else {
      setIsLoadingInPage(true);
      try {
        const bis = await fetchBuyersByName(str);
        setBuyers(bis);
        const sib = await fetchSimilarBuyers(bis.map((b) => b.id).join(","));
        setSimilarBuyers(sib);
      } catch (err) {
        console.log("Error fetching the buyer data");
      } finally {
        setIsLoadingInPage(false);
      }
    }
  };
  const onChangeType = (type: dropdownItemInterface) => {
    setSelectedType(type);
    setClearSignal(clearSignal + 1);
  };
  const onChangeCategory = (vals: nestedDropdownItemInterface[]) => {
    setSelectedCategories(vals);
    setClearSignal(clearSignal + 1);
  };
  const onClickPaginator = async (num: number) => {
    setPageNumber(num);
    setIsLoadingInPage(true);
    try {
      const bis = await fetchBuyersByTypeId(
        selectedType?.value ?? "",
        selectedCategories.map((c) => c.value).join(","),
        MAGIC_NUMBERS.BUYERS_PER_PAGE_DESKTOP,
        num
      );
      if (bis) {
        setBuyers(bis.data);
        setPageCount(bis.meta.total);
      }
    } catch (err) {
      console.log("Error fetching the buyers data");
    } finally {
      setIsLoadingInPage(false);
    }
  };
  const onClickLoadMore = async () => {
    setIsLoadingInPage(true);
    try {
      const bis = await fetchBuyersByTypeId(
        selectedType?.value ?? "",
        selectedCategories.map((c) => c.value).join(","),
        MAGIC_NUMBERS.BUYERS_PER_PAGE_MOBILE,
        buyers.length / MAGIC_NUMBERS.BUYERS_PER_PAGE_MOBILE + 1
      );
      if (bis) {
        setBuyers([...buyers, ...bis.data]);
        setIsShowLoadMore(
          bis.meta.total >
            Math.ceil(buyers.length / MAGIC_NUMBERS.BUYERS_PER_PAGE_MOBILE)
        );
      }
    } catch (err) {
      console.log("Error fetching the buyers data");
    } finally {
      setIsLoadingInPage(false);
    }
  };
  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const dt = sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const ts = mapTypesToDropdownData(await fetchTypes());
      const cl = mapCategoriesToNestedDropdownData(await fetchCategories());
      if (dt) setSelectedType({ value: dt.id, label: dt.title });
      setTypeList(ts);
      setCategoryList(cl);
      if (
        getDataFromLocalStorageWithExpiry(
          LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD
        )
      ) {
        onSearchByName(
          getDataFromLocalStorageWithExpiry(
            LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD
          )
        );
      } else {
        const bis = await fetchBuyersByTypeId(
          dt?.id ?? "",
          "",
          window.innerWidth > 1023
            ? MAGIC_NUMBERS.BUYERS_PER_PAGE_DESKTOP
            : MAGIC_NUMBERS.BUYERS_PER_PAGE_MOBILE
        );
        if (bis) {
          setBuyers(bis.data);
          setPageCount(bis.meta.total);
          setIsShowLoadMore(bis.meta.total > 1);
        }
        if (isLoggedIn && sessionStorage.getItem("access")) {
          const fb = await fetchFavoritesBuyers();
          setFavoriteBuyers(fb);
        }
      }
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="lg:mt-46px mt-14px grid grid-cols-1 gap-14px lg:grid-cols-2 lg:gap-4 px-4 lg:px-0">
        <div className="flex items-center am-gapX-16px">
          <p className="font-semibold text-2xl hidden lg:block">
            {t("common.buyers")}
          </p>
          <p
            className={classNames("font-semibold text-2xl lg:hidden", {
              hidden: searchInputState !== "init",
            })}
          >
            {t("common.buyers")}
          </p>
          <div className="flex-1">
            <SearchInput
              initVal={getDataFromLocalStorageWithExpiry(
                LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD
              )}
              onSearch={onSearchByName}
              clearSignal={clearSignal}
              onFocusEvent={(val: string) => setSearchInputState(val)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
          <div className="hidden lg:block">
            <DropdownBoxWithSearch
              label={t("common.type_size")}
              list={typeList}
              activeItem={selectedType}
              onChange={onChangeType}
            />
          </div>
          <div className="lg:hidden">
            <DropdownBoxWithSearchMobile
              label={t("common.type_size")}
              list={typeList}
              activeItem={selectedType}
              onChange={onChangeType}
            />
          </div>
          <div className="hidden lg:block">
            <NestedDropdownBoxMultiWithSearch
              activeItems={selectedCategories}
              list={categoryList}
              onChange={onChangeCategory}
              title={t("common.category")}
              totalTitle={t("common.all_category")}
            />
          </div>
          <div className="lg:hidden">
            <NestedDropdownBoxMultiWithSearchMobile
              activeItems={selectedCategories}
              list={categoryList}
              onChange={onChangeCategory}
              title={t("common.category")}
              totalTitle={t("common.all_category")}
            />
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        {isSearched ? (
          <div>
            <div className="mt-14px mb-4">
              <SectionSeparator />
            </div>
            <p className="leading-4 font-medium">{t("buyer.you_searched")}</p>
            <div className="mt-3">
              {isLoadingInPage ? (
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{ margin: `-8px -${gapWidth / 2}px` }}
                >
                  {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        style={{ margin: `8px ${gapWidth / 2}px` }}
                      >
                        <BuyerCard isLoading={true} size={cardWidth} />
                      </div>
                    ))}
                </div>
              ) : buyers.length > 0 ? (
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{ margin: `-8px -${gapWidth / 2}px` }}
                >
                  {buyers.map((fb, _idx) => (
                    <div key={_idx} style={{ margin: `8px ${gapWidth / 2}px` }}>
                      <BuyerCard
                        size={cardWidth}
                        buyer={{
                          id: fb.id,
                          name: fb.shop_name,
                          isFavorites: fb.is_favorites,
                          picture: fb.picture.path,
                          comments: fb.comments,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-medium text-neutral-400 text-center">
                  {t("common.not_found")}
                </p>
              )}
            </div>
            {isLoadingInPage ? (
              <div>
                <div className="my-4">
                  <SectionSeparator />
                </div>
                <p className="leading-4 font-medium mb-3">
                  {t("buyer.similars")}
                </p>
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{ margin: `-8px -${gapWidth / 2}px` }}
                >
                  {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        style={{ margin: `8px ${gapWidth / 2}px` }}
                      >
                        <BuyerCard isLoading={true} size={cardWidth} />
                      </div>
                    ))}
                </div>
              </div>
            ) : buyers.length > 0 ? (
              <div>
                <div className="my-4">
                  <SectionSeparator />
                </div>
                <p className="leading-4 font-medium mb-3">
                  {t("buyer.similars")}
                </p>
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{ margin: `-8px -${gapWidth / 2}px` }}
                >
                  {similarBuyers.map((fb, _idx) => (
                    <div key={_idx} style={{ margin: `8px ${gapWidth / 2}px` }}>
                      <BuyerCard
                        size={cardWidth}
                        buyer={{
                          id: fb.id,
                          name: fb.shop_name,
                          isFavorites: fb.is_favorites,
                          picture: fb.picture.path,
                          comments: fb.comments,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div>
            <div className="mt-14px mb-4">
              <SectionSeparator />
            </div>
            {isLoggedIn && sessionStorage.getItem("access") && (
              <div>
                {(isLoading || (!isLoading && favoriteBuyers.length > 0)) && (
                  <p className="leading-4 font-medium mb-3">
                    {t("common.favorites")}
                  </p>
                )}
                {isLoading ? (
                  <div
                    className="flex flex-wrap items-start justify-start"
                    style={{ margin: `-8px -${gapWidth / 2}px` }}
                  >
                    {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                      .fill(0)
                      .map((_, idx) => (
                        <div
                          key={idx}
                          style={{ margin: `8px ${gapWidth / 2}px` }}
                        >
                          <BuyerCard isLoading={true} size={cardWidth} />
                        </div>
                      ))}
                  </div>
                ) : (
                  favoriteBuyers.length > 0 && (
                    <div
                      className="flex flex-wrap items-start justify-start"
                      style={{ margin: `-8px -${gapWidth / 2}px` }}
                    >
                      {favoriteBuyers.map((fb, _idx) => (
                        <div
                          key={_idx}
                          style={{ margin: `8px ${gapWidth / 2}px` }}
                        >
                          <BuyerCard
                            size={cardWidth}
                            buyer={{
                              id: fb.id,
                              name: fb.shop_name,
                              isFavorites: fb.is_favorites,
                              picture: fb.picture.path,
                              comments: fb.comments,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )
                )}
                {(isLoading || (!isLoading && favoriteBuyers.length > 0)) && (
                  <div className="my-4">
                    <SectionSeparator />
                  </div>
                )}
              </div>
            )}
            <p className="leading-4 font-medium mb-3">{t("common.all")}</p>
            {isLoading || isLoadingInPage ? (
              <div
                className="flex flex-wrap items-start justify-start"
                style={{ margin: `-8px -${gapWidth / 2}px` }}
              >
                {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} style={{ margin: `8px ${gapWidth / 2}px` }}>
                      <BuyerCard isLoading={true} size={cardWidth} />
                    </div>
                  ))}
              </div>
            ) : (
              buyers.length > 0 && (
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{ margin: `-8px -${gapWidth / 2}px` }}
                >
                  {buyers.map((br, _idx) => (
                    <div key={_idx} style={{ margin: `8px ${gapWidth / 2}px` }}>
                      <BuyerCard
                        size={cardWidth}
                        buyer={{
                          id: br.id,
                          name: br.shop_name,
                          isFavorites: br.is_favorites,
                          picture: br.picture.path,
                          comments: br.comments,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
            {pageCount > 1 && (
              <div className="pt-8 pb-4">
                <Paginator
                  pageNumber={pageNumber}
                  pageCount={pageCount}
                  onClickPage={onClickPaginator}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="lg:hidden px-4 pb-20">
        {isSearched ? (
          <div>
            <p className="leading-4 pt-4 pb-2 font-medium mb-2">
              {t("buyer.you_searched")}
            </p>
            <div className="mt-2">
              {isLoadingInPage ? (
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{
                    margin: `-4px -${gapWidth / 2}px`,
                  }}
                >
                  {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          margin: `4px ${gapWidth / 2}px`,
                        }}
                      >
                        <BuyerCard isLoading={true} size={cardWidth} />
                      </div>
                    ))}
                </div>
              ) : buyers.length > 0 ? (
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{
                    margin: `-4px -${gapWidth / 2}px`,
                  }}
                >
                  {buyers.map((fb, _idx) => (
                    <div
                      key={_idx}
                      style={{
                        margin: `4px ${gapWidth / 2}px`,
                      }}
                    >
                      <BuyerCard
                        size={cardWidth}
                        buyer={{
                          id: fb.id,
                          name: fb.shop_name,
                          isFavorites: fb.is_favorites,
                          picture: fb.picture.path,
                          comments: fb.comments,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-medium text-neutral-400 text-center pt-1 mb-4">
                  {t("common.not_found")}
                </p>
              )}
            </div>
            {isLoadingInPage ? (
              <div>
                <p className="leading-4 font-medium mt-4 pt-4 pb-2 mb-2">
                  {t("buyer.similars")}
                </p>
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{
                    margin: `-4px -${gapWidth / 2}px`,
                  }}
                >
                  {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          margin: `4px ${gapWidth / 2}px`,
                        }}
                      >
                        <BuyerCard isLoading={true} size={cardWidth} />
                      </div>
                    ))}
                </div>
              </div>
            ) : buyers.length > 0 ? (
              <div>
                <p className="leading-4 font-medium mt-8 mb-2">
                  {t("buyer.similars")}
                </p>
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{
                    margin: `-4px -${gapWidth / 2}px`,
                  }}
                >
                  {similarBuyers.map((fb, _idx) => (
                    <div
                      key={_idx}
                      style={{
                        margin: `4px ${gapWidth / 2}px`,
                      }}
                    >
                      <BuyerCard
                        size={cardWidth}
                        buyer={{
                          id: fb.id,
                          name: fb.shop_name,
                          isFavorites: fb.is_favorites,
                          picture: fb.picture.path,
                          comments: fb.comments,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="mt-4">
            {isLoading || isLoadingInPage ? (
              <div
                className="flex flex-wrap items-start justify-start"
                style={{
                  margin: `-4px -${gapWidth / 2}px`,
                }}
              >
                {Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        margin: `4px ${gapWidth / 2}px`,
                      }}
                    >
                      <BuyerCard isLoading={true} size={cardWidth} />
                    </div>
                  ))}
              </div>
            ) : (
              buyers.length > 0 && (
                <div
                  className="flex flex-wrap items-start justify-start"
                  style={{
                    margin: `-4px -${gapWidth / 2}px`,
                  }}
                >
                  {buyers.map((br, _idx) => (
                    <div
                      key={_idx}
                      style={{
                        margin: `4px ${gapWidth / 2}px`,
                      }}
                    >
                      <BuyerCard
                        size={cardWidth}
                        buyer={{
                          id: br.id,
                          name: br.shop_name,
                          isFavorites: br.is_favorites,
                          picture: br.picture.path,
                          comments: br.comments,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
            {isShowLoadMore && (
              <div className="mt-4">
                <ButtonUnderlined
                  onClick={onClickLoadMore}
                  status={isLoadingInPage ? "disable" : "active"}
                  title={`${t("common.show_more")} ${
                    MAGIC_NUMBERS.BUYERS_PER_PAGE_MOBILE
                  }`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Buyers;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
