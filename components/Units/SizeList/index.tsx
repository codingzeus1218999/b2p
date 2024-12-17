"use client";

import { SizeListProps } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useLayoutEffect, useRef } from "react";
import Swiper from "swiper";
import "swiper/css/bundle";
import styles from "./style.module.css";

const SizeList: React.FC<SizeListProps> = ({ sizes }) => {
  const swiperRef = useRef<any>(null);
  const t = useTranslations();

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
          spaceBetween: 4,
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
    <div className="bg-white max-w-full">
      <div ref={swiperRef} className="lg:hidden overflow-hidden">
        <ul className="swiper-wrapper">
          {sizes.map((size, index) => (
            <li
              key={index}
              className={classNames(
                `!w-fit !h-fit rounded bg-sky-50 px-2 py-1 text-sky-600 text-[11px] leading-3 swiper-slide`,
                styles.swiperItem
              )}
            >
              {size}
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden lg:flex am-gapX-4px am-gapY-4px flex-wrap max-h-11 overflow-hidden h-fit relative">
        {sizes.map((tag, index) => (
          <div
            key={index}
            className="!w-fit !h-fit rounded bg-sky-50 px-2 py-1 text-sky-600 text-[11px] leading-3"
          >
            {tag}
          </div>
        ))}
        <div
          className="text-xs leading-5 text-neutral-400 absolute right-0 bg-white pl-1"
          style={{ top: "24px" }}
        >
          + {t("product.more_sizes")}
        </div>
      </div>
    </div>
  );
};

export default SizeList;
