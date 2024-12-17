"use client";

import { CopyIcon } from "@/components/Icons";
import { useToast } from "@/context/ToastContext";
import { CopyIconButtonProps } from "@/interfaces";
import { useTranslations } from "next-intl";
import React from "react";

const CopyIconButton: React.FC<CopyIconButtonProps> = ({ val, size = 20 }) => {
  const { showToast } = useToast();
  const t = useTranslations();
  const onClickCopyIconButton = async (val: string) => {
    await navigator.clipboard.writeText(val);
    showToast(t("common.copied"), "success");
  };

  return (
    <CopyIcon
      size={size}
      className="cursor-pointer min-w-5 min-h-5"
      onClick={() => onClickCopyIconButton(val)}
    />
  );
};

export default CopyIconButton;
