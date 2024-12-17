"use client";

import { Layout } from "@/components/Layouts";
import { SearchOptionLeft } from "@/components/Sections";
import { ProductListItem } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { useAuth } from "@/context/AuthProvider";
import { productInterface } from "@/interfaces";
import { fetchFavoriteProducts } from "@/services/catalogsApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FavoritesPage = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favoriteProducts, setFavoriteProducts] = useState<productInterface[]>(
    []
  );
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    getInitData();
  }, []);

  const getInitData = async () => {
    setIsLoading(true);
    try {
      const fps = await fetchFavoriteProducts();
      setFavoriteProducts(fps);
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  const onClickSearch = () => {
    localStorage.removeItem(LOCALSTORAGES.SEARCH_LEAVE_PRODUCT_ID);
    router.push("/search");
  };

  const onClickProductItem = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <Layout>
      {isLoggedIn && (
        <div className="lg:mt-8 flex">
          <div className="hidden lg:block mr-8 w-336px max-w-336px min-w-336px">
            <SearchOptionLeft onSearch={onClickSearch} />
          </div>
          <div className="flex-1 w-full lg:max-w-calc1">
            <div className="p-4 font-semibold text-2xl">
              {t("menu.favorites")}
            </div>
            {!isLoading && favoriteProducts.length === 0 && (
              <p className="font-medium text-neutral-400 text-center">
                {t("common.no_data")}
              </p>
            )}
            <div className="flex flex-col am-gapY-8px">
              {isLoading
                ? Array(MAGIC_NUMBERS.PRODUCTS_PER_PAGE)
                    .fill(0)
                    .map((a, _idx) => (
                      <ProductListItem key={_idx} isLoading={true} />
                    ))
                : favoriteProducts.map((p, _idx) => (
                    <ProductListItem
                      product={p}
                      key={_idx}
                      onClickItem={() => onClickProductItem(p.id)}
                    />
                  ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FavoritesPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
