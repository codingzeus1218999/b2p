"use client";

import { NavigatorBackProps } from "@/interfaces";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import styles from "./style.module.css";

const NavigatorBack: React.FC<NavigatorBackProps> = ({
  onOnePage = false,
  onClick,
  onClickEvent,
}) => {
  const router = useRouter();
  const t = useTranslations();
  return (
    <div className={styles.container}>
      <div
        className={styles.containerMain}
        onClick={() => {
          if (onClickEvent) onClickEvent();
          if (onOnePage && onClick) onClick();
          else router.back();
        }}
      >
        <div>&lt;</div>
        <div className="ml-4">{t("common.back")}</div>
      </div>
    </div>
  );
};

export default NavigatorBack;
