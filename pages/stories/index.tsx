"use client";

import { CrossCircleIcon } from "@/components/Icons";
import { LOCALSTORAGES } from "@/constants";
import { MAGIC_NUMBERS } from "@/constants/ui";
import { storyInterface } from "@/interfaces";
import { fetchStories } from "@/services/storiesApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./style.module.css";

const StoriesPage = () => {
  const [stories, setStories] = useState<storyInterface[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const router = useRouter();
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    calcWidth();
    getInitData();
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);

  const getInitData = async () => {
    try {
      const res = (await fetchStories(100, 1)).data;
      setStories(res);
      const startId = getDataFromLocalStorageWithExpiry(
        LOCALSTORAGES.START_STORY
      );
      saveDataInLocalStorage(LOCALSTORAGES.START_STORY, null);
      if (startId) {
        const idx = res.findIndex((i) => i.id === startId);
        if (idx > -1) {
          setStartIndex(idx);
          setSelectedIndex(idx);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching init data", err);
    }
  };

  const calcWidth = () => {
    if (window.innerWidth > 1023) {
      router.push("/");
      return;
    }
    setScreenWidth(window.innerWidth);
  };

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      const activeIndex = swiper.realIndex;
      setSelectedIndex(activeIndex);
    }
  };

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToPreviousSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return !isLoading && stories.length > 0 ? (
    <div className="block lg:hidden relative">
      <div className="absolute left-4 z-10" style={{ top: "34px" }}>
        <CrossCircleIcon
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
      </div>
      <div
        className="absolute top-4 left-4 flex am-gapX-8px z-10"
        style={{ height: "2px", width: "calc(100% - 32px)" }}
      >
        {stories.map((_, idx) => (
          <div
            key={idx}
            className={classNames(
              styles.progressItem,
              selectedIndex > idx
                ? styles.passed
                : selectedIndex === idx
                ? styles.current
                : styles.forward
            )}
            style={{
              width: `${
                (screenWidth - 32 - 8 * (stories.length - 1)) / stories.length
              }px`,
            }}
          >
            <div
              className={styles.whiteSection}
              style={{
                animationDuration: `${
                  selectedIndex === idx
                    ? MAGIC_NUMBERS.STORY_SWIPER_DURATION
                    : 0
                }ms`,
              }}
            ></div>
            <div
              className={styles.graySection}
              style={{
                animationDuration: `${
                  selectedIndex === idx
                    ? MAGIC_NUMBERS.STORY_SWIPER_DURATION
                    : 0
                }ms`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <Swiper
        ref={swiperRef}
        initialSlide={startIndex}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        slidesPerView={1}
        loop
        modules={[Autoplay]}
        autoplay={{ delay: MAGIC_NUMBERS.STORY_SWIPER_DURATION }}
      >
        {stories.map((s, _idx) => (
          <SwiperSlide key={_idx}>
            <div
              className="am-gapY-12px"
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
                color: "white",
                width: "100%",
                height: "100dvh",
                background: `linear-gradient(180deg, rgba(25, 122, 210, 0.00) -0.37%, rgba(25, 122, 210, 0.52) 51.9%, rgba(25, 122, 210, 0.70) 100%), url(${s.original.path}) lightgray 50% / cover no-repeat`,
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  lineHeight: "32px",
                  fontWeight: "700",
                }}
              >
                {s.title}
              </div>
              <div style={{ lineHeight: "22px" }}>{s.description}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="absolute w-2/5 bottom-0 left-0 z-100"
        style={{ height: "calc(100dvh - 100px)" }}
        onClick={goToPreviousSlide}
      ></div>
      <div
        className="absolute w-2/5 top-0 right-0 z-100"
        style={{ height: "100dvh" }}
        onClick={goToNextSlide}
      ></div>
    </div>
  ) : (
    <></>
  );
};

export default StoriesPage;

export async function getStaticProps() {
  const locale = "ru";
  return {
    props: {
      messages: (await import(`@/messages/${locale}.json`)).default,
    },
  };
}
