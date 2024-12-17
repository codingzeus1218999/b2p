"use client";

import { Spinner } from "@/components/Units";
import { StocksListProps, productStocksInterface } from "@/interfaces";
import { findIcon } from "@/utils/mapUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

const StocksList: React.FC<StocksListProps> = ({
  list,
  deliveries,
  activeItem,
  onClick,
  onClickBuy,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortedList, setSortedList] = useState<productStocksInterface[]>([]);
  const t = useTranslations();

  useEffect(() => {
    setSortedList(
      [...list].sort((a, b) => {
        if (a.in_filter !== b.in_filter) {
          return a.in_filter ? -1 : 1;
        }
        if (a.weight !== b.weight) {
          return a.weight - b.weight;
        }
        return a.size.localeCompare(b.size);
      })
    );
  }, [list]);
  let lastWeight = 0;
  return (
    <div className="flex flex-col am-gapY-12px">
      {sortedList.map((sl, _idx) => {
        const isNewWeight = lastWeight !== sl.weight;
        lastWeight = sl.weight;
        const isActive = sl.id === activeItem?.id;
        return (
          <div key={_idx}>
            <div
              className={`justify-between mb-4 px-4 h-8 items-center ${
                isNewWeight ? "flex" : "hidden"
              }`}
            >
              <div className="font-bold text-xs">{sl.weight} шт.</div>
              <div className="font-bold text-xs">{t("payment.upfront")}</div>
            </div>
            <div
              className={classNames(
                styles.item,
                sl.in_filter ? styles.filtered : styles.non_filtered,
                isActive ? styles.active : "flex lg:pr-4 cursor-pointer"
              )}
              onClick={() => {
                if (isLoading) return;
                onClick(sl);
              }}
            >
              <div className="text-sm text-sky-600">
                {sl.size.split("-")[0]}
              </div>
              <div className={`flex items-center am-gapX-4px am-lg-gapX-8px`}>
                <div className="text-indigo-300 text-10px hidden lg:block">
                  {sl.delivered_at.split(" ")[1]}
                </div>
                {!isActive &&
                  sl.delivery.split("/").map((sld, _idx) => (
                    <div
                      key={_idx}
                      className="text-sky-600 text-sm flex items-center am-gapX-4px"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: findIcon(deliveries, sld.trim()),
                        }}
                      />
                      <span className="hidden lg:block">{sld}</span>
                    </div>
                  ))}
                {!isActive && (
                  <div className={`text-sky-600 text-sm`}>
                    /&nbsp;{sl.price.toLocaleString("ru-RU")}&nbsp;₽
                  </div>
                )}
                {isActive && (
                  <div
                    className={classNames(styles.buyBtn)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLoading) return;
                      setIsLoading(true);
                      onClickBuy(sl);
                    }}
                  >
                    {!isLoading && (
                      <span>
                        {t("common.buy_with")}{" "}
                        {sl.price.toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                    {isLoading && (
                      <Spinner size={20} color="white" innerColor="#1976D2" />
                    )}
                  </div>
                )}
              </div>
            </div>
            {isActive && (
              <div className="flex lg:hidden p-3 rounded-xl shadow-custom-1 flex-col am-gapY-8px bg-white">
                <p className="text-sky-600 text-sm font-semibold leading-4">
                  {sl.size.split("-")[0]}
                </p>
                <div className="flex items-center flex-wrap -m-2">
                  {sl.delivery.split("/").map((sld, _idx) => (
                    <div
                      key={_idx}
                      className="text-sm flex items-center am-gapX-4px leading-4 m-2"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: findIcon(deliveries, sld.trim()),
                        }}
                      />
                      <span>{sld}</span>
                    </div>
                  ))}
                </div>
                <div className="text-10px leading-10px flex justify-between">
                  <p>{t("product.expected_date")}</p>
                  <p>{sl.delivered_at.split(" ")[1]}</p>
                </div>
                <div
                  className={classNames(styles.buyBtn)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLoading) return;
                    setIsLoading(true);
                    onClickBuy(sl);
                  }}
                >
                  {!isLoading && (
                    <span>Купить за {sl.price.toLocaleString("ru-RU")} ₽</span>
                  )}
                  {isLoading && (
                    <Spinner size={20} color="white" innerColor="#1976D2" />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StocksList;
