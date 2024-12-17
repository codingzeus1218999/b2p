"use client";

import { DotLineIcon } from "@/components/Icons";
import { CouponCardProps } from "@/interfaces";
import ImgCouponLN from "@/public/images/couponLN.png";
import ImgCouponRN from "@/public/images/couponRN.png";
import ImgCouponLH from "@/public/images/couponLH.png";
import ImgCouponRH from "@/public/images/couponRH.png";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Skeleton from "../Skeleton";

const CouponCard: React.FC<CouponCardProps> = ({ isLoading = false, data }) => {
  const [hoverState, setHoverState] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const router = useRouter();
  const t = useTranslations();
  const onClickCard = () => {
    if (data?.status === "active" && !isLoading) {
      router.push(`/coupons/${data.id}`);
    }
  };
  const active = data?.status === "active";
  useEffect(() => {
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);
  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth < 1024) setHoverState(false);
  };
  return (
    <div
      className="rounded-lg shadow-custom-1 lg:hover:shadow-custom-5 lg:transition-all py-3 pl-33px pr-6 lg:px-7 flex w-full items-center am-gapX-12px relative coupon-card"
      onClick={onClickCard}
      onMouseEnter={() => {
        if (screenWidth > 1023) setHoverState(true);
      }}
      onMouseLeave={() => setHoverState(false)}
    >
      {isLoading ? (
        <Skeleton className="w-60px h-60px lg:w-24 lg:h-24 rounded-lg" />
      ) : (
        <img
          alt={data?.shop.name ?? ""}
          width={60}
          height={60}
          src={data?.shop.file?.path ?? "/images/no_img.png"}
          className="w-60px h-60px lg:w-24 lg:h-24 rounded-xl"
          style={{ opacity: active ? 1 : 0.32 }}
        />
      )}
      <DotLineIcon size={40} className="lg:hidden" />
      <DotLineIcon size={64} className="hidden lg:block" />
      <div className="flex flex-col am-gapY-8px am-lg-gapY-12px">
        {isLoading ? (
          <Skeleton className="rounded-md w-20 h-18px lg:h-6" />
        ) : (
          <p
            className={classNames(
              "font-semibold text-lg leading-none lg:text-2xl lg:leading-none",
              { "text-neutral-400": !active }
            )}
          >
            {data?.amount.toLocaleString("ru-RU")} ₽
          </p>
        )}
        {isLoading ? (
          <Skeleton className="rounded-md w-36 h-14px lg:h-4" />
        ) : (
          <p
            className={classNames(
              "text-sm lg:text-base leading-none lg:leading-none",
              {
                "text-sky-600": active,
                "text-neutral-400": !active,
              }
            )}
          >
            {data?.shop.name ?? ""}
          </p>
        )}
        {isLoading ? (
          <Skeleton className="rounded-md w-36 h-3 lg:h-14px" />
        ) : (
          <p className="text-xs lg:text-sm text-neutral-400 font-light leading-none lg:leading-none">
            {t("common.code")}: {data?.value ?? ""}
          </p>
        )}
      </div>
      <div className="absolute top-3 right-6 lg:right-7">
        {isLoading ? (
          <Skeleton className="h-14px w-62px lg:w-116px lg:h-26px rounded-md" />
        ) : (
          <img
            style={{ opacity: active ? 1 : 0.32 }}
            alt={data?.store.file?.filename ?? ""}
            src={data?.store.file?.path ?? ""}
            className="h-14px w-62px lg:w-116px lg:h-26px"
          />
        )}
      </div>
      <Image
        src={hoverState ? ImgCouponLH : ImgCouponLN}
        width={12}
        alt="coupon-left-normal"
        className="absolute left-0"
      />
      <Image
        src={hoverState ? ImgCouponRH : ImgCouponRN}
        width={12}
        alt="coupon-left-normal"
        className="absolute right-0"
      />
    </div>
  );
};

export default CouponCard;
