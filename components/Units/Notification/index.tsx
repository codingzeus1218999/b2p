"use client";

import { CrossIcon } from "@/components/Icons";
import { NOTIFICATIONBGS } from "@/constants/ui";
import { NotificationProps } from "@/interfaces";
import React from "react";

const Notification: React.FC<NotificationProps> = ({
  notification,
  isLoading = false,
  onClickHide,
  fadeOutNotificationIds = [],
}) => {
  return (
    <article
      role="main"
      className={`border-box p-4 flex flex-col justify-center am-gapY-10px rounded-lg text-zinc-900 shadow-[0_4px_24px_0px_rgba(25,118,210,0.16)] ${
        fadeOutNotificationIds.includes(notification?.id ?? "")
          ? "animate-fadeOut"
          : ""
      }`}
    >
      <div className="flex flex-wrap justify-between am-gapY-12px pt-px min-[1270px]:flex-nowrap">
        <div className="flex flex-col items-start am-gapY-11px">
          <div
            className={`rounded ${
              NOTIFICATIONBGS[notification?.type ?? "info"]
            } px-1 py-0.5 text-center text-sm leading-[normal]`}
          >
            {notification?.type_title ?? ""}
          </div>
          <div className="self-stretch text-xl font-medium leading-6 tracking-[-0.32px] text-sky-600">
            {notification?.title ?? ""}
          </div>
        </div>
        <div className="flex h-6 w-6 flex-shrink-0 flex-col items-center">
          <CrossIcon
            size={24}
            fill="#b1b1b1"
            className="-mb-px flex-shrink-0 cursor-pointer"
            onClick={() => onClickHide && onClickHide(notification?.id ?? "")}
          />
        </div>
      </div>
      <p className="text-sm lg:leading-[22px] lg:text-base">
        {notification?.message ?? ""}
      </p>
    </article>
  );
};

export default Notification;
