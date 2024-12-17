"use client";

import { PaymentHistoryItemProps } from "@/interfaces";
import classNames from "classnames";
import React from "react";

const PaymentHistoryItem: React.FC<PaymentHistoryItemProps> = ({
  payment,
  operations,
  onClick,
}) => {
  const onClickCard = () => {
    if (payment.payment_id) onClick(payment);
  };
  return (
    <div
      onClick={onClickCard}
      className="h-10 py-2 flex flex-col justify-between border-b border-b-sky-50"
    >
      <div className="flex flex-row justify-between items-start">
        <p className="text-xs leading-none">{operations[payment.operation]}</p>
        <p
          className={classNames("text-xs leading-none font-semibold", {
            "text-neutral-400": payment.status === "cancel",
            "text-red-300": payment.status === "expired",
            "text-green-200":
              payment.status === "done" && payment.operation === "deposit",
          })}
        >
          {payment.status === "cancel"
            ? ""
            : payment.operation === "withdrawal"
            ? "-"
            : payment.operation === "deposit"
            ? "+"
            : ""}{" "}
          {Number(
            payment.status === "cancel" ? 0 : payment.amount
          ).toLocaleString("ru-RU")}{" "}
          ₽
        </p>
      </div>
      <div className="text-xs font-light leading-none text-neutral-400">
        {payment.id}
      </div>
    </div>
  );
};

export default PaymentHistoryItem;
