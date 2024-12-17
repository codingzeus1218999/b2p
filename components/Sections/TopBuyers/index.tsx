"use client";

import { BuyerCard } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { DefaultTypeContext } from "@/context/DefaultTypeContext";
import { FilterContext } from "@/context/FilterContext";
import { buyerCardInterface } from "@/interfaces";
import { getAccountDefaultTypeSize } from "@/services/accountsApi";
import { fetchDefaultType } from "@/services/directoriesApi";
import { fetchBuyersByTypeId } from "@/services/shopsApi";
import { saveDataInLocalStorage } from "@/utils/calcUtils";
import { mapBuyersToCardDta } from "@/utils/mapUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Swiper from "swiper";
import "swiper/css";

const TopBuyers: React.FC = () => {
  const [topBuyers, setTopBuyers] = useState<buyerCardInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cardWidth, setCardWidth] = useState<number>(0);
  const swiperRef = useRef<any>(null);
  const router = useRouter();
  const { filterOption } = useContext(FilterContext);
  const { dtypeId } = useContext(DefaultTypeContext);
  const t = useTranslations();

  useEffect(() => {
    getInitData();
    calcResponsive();
    window.addEventListener("resize", calcResponsive);
    return () => {
      window.removeEventListener("resize", calcResponsive);
    };
  }, []);

  useEffect(() => {
    const getD = async () => {
      setIsLoading(true);
      const d = await fetchBuyersByTypeId(dtypeId, "", 12);
      if (d) setTopBuyers(mapBuyersToCardDta(d.data));
      setIsLoading(false);
    };
    if (dtypeId) getD();
  }, [dtypeId]);

  const calcResponsive = () => {
    setCardWidth(window.innerWidth > 1023 ? 168 : 140);
  };

  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const dt = filterOption.type
        ? { id: filterOption.type.value, title: filterOption.type.label }
        : sessionStorage.getItem("access")
        ? await getAccountDefaultTypeSize()
        : await fetchDefaultType();
      if (dt) {
        const data = await fetchBuyersByTypeId(dt.id, "", 12);
        if (data) {
          setTopBuyers(mapBuyersToCardDta(data.data));
        }
      }
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    const initializeSwiper = () => {
      if (
        window.matchMedia("(max-width: 1023px)").matches &&
        swiperRef.current &&
        !swiperRef.current.swiper
      ) {
        new Swiper(swiperRef.current, {
          direction: "horizontal",
          loop: false,
          slidesPerView: "auto",
          freeMode: true,
          spaceBetween: 8,
          slidesOffsetAfter: 16,
          slidesOffsetBefore: 16,
        });
      }
    };

    initializeSwiper();

    const resizeHandler = () => {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.destroy();
        }
        initializeSwiper();
      } else {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.destroy();
        }
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-0">
        <h2 className="font-medium leading-5 text-zinc-900">
          {t("common.buyers")}
        </h2>
        <div className="leading-4 text-sky-600">
          <div
            className="cursor-pointer"
            onClick={() => {
              saveDataInLocalStorage(
                LOCALSTORAGES.LAST_BUYER_SEARCH_KEYWORD,
                ""
              );
              router.push("/buyers");
            }}
          >
            {t("common.all")} <span className="font-bold">&gt;</span>
          </div>
        </div>
      </div>
      <div className="mt-3 lg:mt-4">
        <div ref={swiperRef}>
          <div className="flex lg:flex-wrap swiper-wrapper am-lg-gapX-16px">
            {isLoading
              ? Array.from({ length: MAGIC_NUMBERS.BUYERS_PER_LINE })
                  .fill(0)
                  .map((b, _idx) => (
                    <div className="swiper-slide !w-fit" key={_idx}>
                      <BuyerCard isLoading={true} size={cardWidth} />
                    </div>
                  ))
              : topBuyers.map((b, _idx) => (
                  <div className="swiper-slide !w-fit" key={_idx}>
                    <BuyerCard buyer={b} size={cardWidth} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBuyers;
