"use client";

import { OrderCardProps } from "@/interfaces";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React from "react";
import CopyIconButton from "../CopyIconButton";
import Skeleton from "../Skeleton";

const OrderCard: React.FC<OrderCardProps> = ({ order, isLoading = false }) => {
  const router = useRouter();
  const t = useTranslations();

  const onClickCard = () => {
    if (isLoading || !order) return;
    router.push(`/orders/${order.id}`);
  };

  return (
    <div
      className="rounded-xl p-10px shadow-custom-1 lg:rounded-lg lg:p-3 lg:hover:shadow-custom-5 lg:transition-all cursor-pointer"
      onClick={onClickCard}
    >
      {isLoading && (
        <div className="flex flex-col am-gapY-2px">
          <Skeleton className="rounded-md w-20 h-17px lg:h-22px" />
          <div className="flex justify-between items-center">
            <Skeleton className="rounded-md w-2/5 h-5 lg:h-8" />
            <Skeleton className="rounded-md w-62px h-14px lg:w-116px lg:h-26px" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="rounded-md w-1/5 h-4 lg:h-22px" />
            <Skeleton className="rounded-md w-1/5 h-4 lg:h-22px" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="rounded-md w-2/5 h-4 lg:h-22px" />
            <Skeleton className="rounded-md w-2/5 h-4 lg:h-22px" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="rounded-md w-1/5 h-4 lg:h-22px" />
            <Skeleton className="rounded-md w-3/5 h-4 lg:h-22px" />
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="flex flex-col am-gapY-2px">
          <div
            className="px-1 py-2px text-10px lg:text-sm leading-normal w-fit"
            style={{
              backgroundColor: `${order?.status_label_color ?? "white"}`,
              borderRadius: "4px",
            }}
          >
            {order?.status_label ?? ""}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-sky-600 font-semibold lg:text-xl lg:leading-8">
              {order?.product.title ?? ""}
            </p>
            <img
              width={62}
              height={14}
              alt={order?.product.store.file?.filename ?? ""}
              src={order?.product.store.file?.path ?? "/images/no_img.png"}
              className="w-62px lg:w-116px h-14px lg:h-26px"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-10px leading-4 lg:text-sm lg:leading-22px">
              {Number(order?.order_price ?? 0).toLocaleString("ru-RU")} ₽
            </p>
            <p className="text-10px leading-4 lg:text-sm lg:leading-22px">
              {order?.product.title ?? ""}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-10px leading-4 lg:text-sm lg:leading-22px">
              {moment(order?.updated_at ?? 0).format("DD.MM.YYYY / HH:mm")}
            </p>
            <p className="text-10px leading-4 lg:text-sm lg:leading-22px">
              {order?.product.shop.title ?? ""}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-10px leading-4 lg:text-sm lg:leading-22px">
              {t("order.order")}:
            </p>
            <div className="items-center flex am-gapX-4px">
              <p className="text-10px leading-4 lg:text-sm lg:leading-22px">
                {order?.id ?? ""}
              </p>
              <CopyIconButton val={order?.id ?? ""} size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
