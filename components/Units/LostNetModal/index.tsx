"use client";

import { LogoIcon } from "@/components/Icons";
import { LOCALSTORAGES } from "@/constants";
import { LostNetModalProps } from "@/interfaces";
import { getDataFromLocalStorageWithExpiry } from "@/utils/calcUtils";
import cn from "classnames";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Spinner from "../Spinner";
import styles from "./style.module.css";

const LostNetModal: React.FC<LostNetModalProps> = ({ isOpen = false }) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const t = useTranslations();
  const [tips, setTips] = useState<string[]>([]);
  useEffect(() => {
    setTips(getDataFromLocalStorageWithExpiry(LOCALSTORAGES.TEXT_LOST_NETWORK));
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);
  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
  };
  return isOpen ? (
    <div
      className={cn(
        "z-999 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center",
        styles.container
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: screenWidth > 1023 ? "352px" : "calc(100vw - 32px)" }}
        className="flex flex-col items-center"
      >
        <div className="py-1 flex justify-center mb-17px lg:mb-29px">
          <LogoIcon />
        </div>
        <Spinner color="white" size={42} width={5} innerColor="white" blur />
        <div className="mt-17px text-center text-white leading-none mb-5">
          {`⚠️ ${t("home.lost_connection")}`}
        </div>
        <Swiper
          spaceBetween={8}
          slidesPerView={1}
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          className="w-full max-w-full"
        >
          {tips.map((s, _idx) => (
            <SwiperSlide key={_idx} className="w-full max-w-full">
              <div
                className="py-3 px-4 lg:px-3 rounded-xl border text-white text-center leading-5 font-medium w-full max-w-full"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.32)",
                  backgroundColor: "rgba(255, 255, 255, 0.16)",
                }}
              >
                {s}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  ) : (
    <></>
  );
};

export default LostNetModal;
