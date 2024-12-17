"use client";

import { ProductSimpleCard } from "@/components/Units";
import { DefaultTypeContext } from "@/context/DefaultTypeContext";
import { FilterContext } from "@/context/FilterContext";
import { productInterface } from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import { fetchRecommendProductsByTypeId } from "@/services/catalogsApi";
import { fetchDefaultType } from "@/services/directoriesApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const RecommendProducts: React.FC = () => {
  const [recommendProducts, setRecommendProducts] = useState<
    productInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { filterOption } = useContext(FilterContext);
  const { dtypeId } = useContext(DefaultTypeContext);
  const t = useTranslations();
  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    const getD = async () => {
      setIsLoading(true);
      const d = await fetchRecommendProductsByTypeId(dtypeId);
      setRecommendProducts(d);
      setIsLoading(false);
    };
    if (dtypeId) getD();
  }, [dtypeId]);

  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const dt = filterOption.type
        ? { id: filterOption.type.value, title: filterOption.type.label }
        : sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      const data = dt ? await fetchRecommendProductsByTypeId(dt.id) : [];
      setRecommendProducts(data);
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  const onClickItem = async (id: string) => {
    if (!isAuthModalOpen) {
      router.push(`/products/${id}`);
    }
  };

  const toggleAuthModal = (isOpen: boolean) => {
    setIsAuthModalOpen(isOpen);
  };

  return (
    <>
      <h2 className="px-4 lg:px-0 font-medium leading-5 text-zinc-900 hidden lg:block">
        {t("home.best_buyers")}
      </h2>
      <h2 className="px-4 lg:px-0 font-medium leading-5 text-zinc-900 lg:hidden">
        {t("home.recommend_products")}
      </h2>
      <div className="mt-3 lg:mt-4 grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-4">
        {isLoading
          ? Array.from({ length: 4 })
              .fill(0)
              .map((b, _id) => (
                <div
                  className="px-4 py-3 rounded-lg shadow-custom-1 lg:hover:shadow-custom-3 lg:transition-all cursor-pointer"
                  key={_id}
                >
                  <ProductSimpleCard
                    isShowLabels={true}
                    isLoading={true}
                    size={108}
                  />
                </div>
              ))
          : recommendProducts.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 rounded-lg shadow-custom-1 lg:hover:shadow-custom-3 lg:transition-all cursor-pointer"
                onClick={() => onClickItem(item.id)}
              >
                <ProductSimpleCard
                  isShowLabels={true}
                  size={108}
                  product={item}
                  toggleAuthModal={toggleAuthModal}
                  desktopBuyerColor
                />
              </div>
            ))}
      </div>
    </>
  );
};

export default RecommendProducts;
