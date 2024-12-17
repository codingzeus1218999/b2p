"use client";

import { RightIcon } from "@/components/Icons";
import { PaymentSystemProps } from "@/interfaces";
import ImgPsCard from "@/public/images/ps-card.svg";
import ImgPsOther from "@/public/images/ps-other.svg";
import ImgPsQiwi from "@/public/images/ps-qiwi.svg";
import ImgPsSbp from "@/public/images/ps-sbp.svg";
import ImgPsSim from "@/public/images/ps-sim.svg";
import classNames from "classnames";
import Image from "next/image";
import styles from "./style.module.css";

const PaymentSystem: React.FC<PaymentSystemProps> = ({
  ps,
  lackPrice,
  onClick,
}) => {
  const calcP = Math.ceil((lackPrice * ps.percent) / 100) + lackPrice;
  const isEnable = ps.minimum <= calcP && ps.maximum >= calcP;
  return (
    <div
      onClick={() => {
        if (!isEnable) return;
        onClick(ps, lackPrice);
      }}
      className={classNames(
        styles.container,
        isEnable ? styles.active : styles.disable
      )}
    >
      <div className="flex am-gapX-12px items-center">
        <Image
          src={
            ps.type === "card"
              ? ImgPsCard
              : ps.type === "other"
              ? ImgPsOther
              : ps.type === "qiwi"
              ? ImgPsQiwi
              : ps.type === "sbp"
              ? ImgPsSbp
              : ImgPsSim
          }
          alt={ps.code}
          className="w-auto h-auto"
          style={{
            opacity: `${isEnable ? 1 : 0.32}`,
          }}
        />
        <p className="text-sm hidden lg:block">{ps.subtitle}</p>
      </div>
      <div className="flex am-gapX-12px items-center">
        <p className="text-xs text-zinc-200">
          {`${ps.minimum.toLocaleString(
            "ru-RU"
          )} ₽ - ${ps.maximum.toLocaleString("ru-RU")} ₽`}
        </p>
        <div
          className={classNames("flex am-gapX-4px items-center", {
            "text-sky-600": isEnable,
            "text-zinc-200": !isEnable,
          })}
        >
          <div>{(isEnable ? calcP : 0).toLocaleString("ru-RU")} ₽</div>
          <div>
            <RightIcon fill={`${!isEnable ? "#ababad" : "#1976D2"}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;
