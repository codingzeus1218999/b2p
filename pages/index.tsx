"use client";

import { Layout } from "@/components/Layouts";
import {
  HomeSlider,
  Instructions,
  Notifications,
  RecommendProducts,
  SearchOptionHome,
  Stories,
  TopBuyers,
} from "@/components/Sections";
import { LoadingModal } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { BlurContext } from "@/context/BlurContext";
import { FilterContext } from "@/context/FilterContext";
import { useToast } from "@/context/ToastContext";
import { searchProducts } from "@/services/catalogsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const HomePage = () => {
  const { blur } = useContext(BlurContext);
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { filterOption } = useContext(FilterContext);
  const t = useTranslations();

  useEffect(() => {
    if (getDataFromLocalStorageWithExpiry(LOCALSTORAGES.FRESHED) === true) {
      showToast(t("profile.session_terminated"), "info");
      saveDataInLocalStorage(LOCALSTORAGES.FRESHED, false);
    }
  }, []);

  const onClickSearch = async () => {
    if (filterOption.brands.length === 0) {
      showToast(t("common.not_found"), "warning");
    } else {
      setShowLoadingModal(true);
      try {
        const data = await searchProducts({
          type_id: filterOption.type?.value ?? "",
          size_ids: filterOption.sizes.map((t) => t.value).join(","),
          brand_ids: filterOption.brands.map((t) => t.value).join(","),
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
        if (data?.data.length === 0) {
          showToast(t("common.not_found"), "warning");
          setShowLoadingModal(false);
        } else {
          localStorage.removeItem(LOCALSTORAGES.SEARCH_LEAVE_PRODUCT_ID);
          router.push("/search");
        }
      } catch (err) {
        console.log("Error filtering products", err);
        setShowLoadingModal(false);
      } finally {
      }
    }
  };

  return (
    <Layout>
      <LoadingModal isOpen={showLoadingModal} />
      <div className="pt-4 lg:pt-6 flex flex-col am-gapY-16px">
        <div className="lg:hidden order-1">
          <Stories />
        </div>
        <div className="order-3 lg:order-2">
          <SearchOptionHome onSearch={onClickSearch} />
        </div>
        <div
          className={classNames("px-4 lg:px-0 order-2 lg:order-3", {
            "blur-section": blur,
          })}
        >
          <Notifications />
        </div>
        <div
          className={classNames("hidden lg:block lg:order-4", {
            "blur-section": blur,
          })}
        >
          <HomeSlider />
        </div>
        <div
          className={classNames("order-5", {
            "blur-section": blur,
          })}
        >
          <div className="overflow-hidden pb-4 lg:overflow-visible">
            <TopBuyers />
          </div>
          <RecommendProducts />
        </div>
        <div
          className={classNames("order-7 mt-2 lg:mt-5", {
            "blur-section": blur,
          })}
        >
          <Instructions />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
