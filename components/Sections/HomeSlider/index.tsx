"use client";

import { Skeleton } from "@/components/Units";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import { homeSwiperItemInterface } from "@/interfaces";
import { fetchHomeSliders } from "@/services/configurationsApi";
import { mapHomeSlidersToSwiperData } from "@/utils/mapUtils";
import React, { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const HomeSlider: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mainPageSlider, setMainPageSlider] = useState<
    homeSwiperItemInterface[]
  >([]);
  const swiperRef = useRef<any>(null);
  const { dropdownOpen, setDropdownOpen } = useContext(DropdownOpenContext);

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = mapHomeSlidersToSwiperData(await fetchHomeSliders());
      setMainPageSlider(data);
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-40 rounded-lg" />
      ) : (
        <>
          <div className="relative shadow-[0_4px_24px_0px_rgba(25,118,210,0.16)]">
            <div className="rounded-lg overflow-hidden">
              <Swiper
                ref={swiperRef}
                slidesPerView={"auto"}
                spaceBetween={16}
                loop={true}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                }}
                modules={[Pagination]}
                initialSlide={0}
                onSlideChange={() => {
                  setDropdownOpen(dropdownOpen + 1);
                }}
                onClick={() => {
                  setDropdownOpen(dropdownOpen + 1);
                }}
                speed={1500}
                effect="fade"
              >
                {mainPageSlider.map((slide, index) => (
                  <SwiperSlide className="!w-[812px]" key={index}>
                    <img
                      src={slide.imageSrc}
                      alt={`Slide ${index + 1}`}
                      width={812}
                      height={258}
                      className="rounded-lg shadow-[0_4px_24px_0px_rgba(25,118,210,0.24)]"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="swiper-pagination absolute lg:h-9 flex items-center justify-center lg:bottom-0"></div>
            <div
              className="home-slider-navigator prev"
              onClick={() => {
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.slidePrev();
                }
              }}
            >
              <span>&lt;</span>
            </div>
            <div
              className="home-slider-navigator next"
              onClick={() => {
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.slideNext();
                }
              }}
            >
              <span>&gt;</span>
            </div>
          </div>
          <div className="h-9 w-full"></div>
        </>
      )}
    </>
  );
};

export default HomeSlider;
