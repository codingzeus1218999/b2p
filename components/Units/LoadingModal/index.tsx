"use client";

import { LoadingModalProps } from "@/interfaces";
import ImgLogoBlack from "@/public/images/logo_black.svg";
import cn from "classnames";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Spinner from "../Spinner";
import styles from "./style.module.css";

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen = false }) => {
  const t = useTranslations();
  return isOpen ? (
    <div
      className={cn(
        "z-999 fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center px-4",
        styles.container
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "352px", minHeight: "198px" }}
        className="flex flex-col items-center bg-white px-4 pb-8 pt-10 rounded-lg shadow-lg text-center relative overflow-hidden am-gapY-10px"
      >
        <div
          className={"w-full absolute top-0 bg-gray-500 h-2 overflow-hidden"}
        >
          <div className={styles.progressBg}></div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ height: "30px" }}
        >
          <Image
            className="h-[30px] max-w-[136px] w-full"
            width={136}
            height={30}
            src={ImgLogoBlack}
            alt="Logo"
          />
        </div>
        <Spinner size={30} color="blue" innerColor="white" />
        <p className="text-base">
          {t("home.selected_options")}, <br /> {t("common.wait_for_download")}
        </p>
      </motion.div>
    </div>
  ) : (
    <></>
  );
};

export default LoadingModal;
