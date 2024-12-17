"use client";

import { ButtonBase, ButtonWhite } from "@/components/Forms";
import { CrossIcon } from "@/components/Icons";
import { M_SLIDES_REG } from "@/constants/ui";
import { RegisterSlidesProps } from "@/interfaces";
import ImgLogo from "@/public/images/Logo.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const RegisterSlides: React.FC<RegisterSlidesProps> = ({ redirectUrl }) => {
  const router = useRouter();
  const swiperRef = useRef<any>(null);
  const [slideNum, setSlideNum] = useState<number>(1);
  const t = useTranslations();

  return (
    <div
      className="p-4 lg:hidden flex flex-col justify-between"
      style={{ height: "100dvh", maxHeight: "100dvh" }}
    >
      <div className="py-2 px-4 flex justify-between items-center">
        <Link href="/">
          <Image width={90} height={20} src={ImgLogo} alt="Logo" />
        </Link>
        <div
          className="cursor-pointer w-5 h-5"
          onClick={() => {
            router.push(redirectUrl ? "/" + redirectUrl : "/");
          }}
        >
          <CrossIcon fill="#191c1f" />
        </div>
      </div>
      <div
        style={{
          padding: "6px 0px",
          maxHeight: "calc(100dvh - 112px)",
          height: "calc(100dvh - 112px)",
        }}
        className="relative flex-1"
      >
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          spaceBetween={16}
          loop={false}
          pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
          modules={[Pagination]}
          onSlideChange={() => {
            if (swiperRef.current) {
              setSlideNum(swiperRef.current.swiper.activeIndex + 1);
            }
          }}
          style={{ height: "100%" }}
        >
          {M_SLIDES_REG.map((sl, _idx) => (
            <SwiperSlide key={_idx} className="!w-full !h-full">
              <img
                src={sl}
                alt="background-slide"
                className="object-cover rounded-lg"
                style={{ width: "100%", height: "100%" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="mb-4 relative flex h-9 items-center justify-center">
        <div className="swiper-pagination-custom swiper-pagination-style-3"></div>
        <div className="absolute right-4 leading-4" style={{ bottom: "10px" }}>
          <span className="text-sky-600">{slideNum}</span>
          <span className="text-zinc-100">/{M_SLIDES_REG.length}</span>
        </div>
      </div>
      <div
        className={`${slideNum === M_SLIDES_REG.length ? "hidden" : "block"}`}
      >
        <ButtonBase
          status="active"
          onClick={() => {
            if (swiperRef.current && swiperRef.current.swiper) {
              swiperRef.current.swiper.slideNext();
            }
          }}
        >
          {t("common.next")}
        </ButtonBase>
      </div>
      <div
        className={`grid-cols-2 gap-4 ${
          slideNum === M_SLIDES_REG.length ? "grid" : "hidden"
        }`}
      >
        <ButtonWhite
          status="active"
          onClick={() => {
            if (swiperRef.current && swiperRef.current.swiper) {
              setSlideNum(0);
              swiperRef.current.swiper.slideTo(0);
            }
          }}
        >
          {t("common.repeat")}
        </ButtonWhite>
        <ButtonBase
          status="active"
          onClick={() => {
            router.push(redirectUrl ? "/" + redirectUrl : "/");
          }}
        >
          {t("buyer.to_buyers")}
        </ButtonBase>
      </div>
    </div>
  );
};

export default RegisterSlides;
