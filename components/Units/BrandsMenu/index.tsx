"use client";

import { BrandsMenuProps, brandInterface } from "@/interfaces";
import { toggleInArray } from "@/utils/calcUtils";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import Skeleton from "../Skeleton";
import styles from "./style.module.css";

const BrandsMenu: React.FC<BrandsMenuProps> = ({
  isLoading = true,
  onSelect,
  activeBrands,
  list,
}) => {
  const [availableBrands, setAvailableBrands] = useState<brandInterface[]>([]);
  const t = useTranslations();

  useEffect(() => {
    setAvailableBrands(list.filter((b) => b.available));
  }, [list]);

  const onClickAll = () => {
    if (activeBrands.length === availableBrands.length) {
      onSelect([]);
    } else {
      onSelect(availableBrands);
    }
  };

  const onClickItem = (b: brandInterface) => {
    if (!b.available) return;
    const newV =
      availableBrands.length === activeBrands.length
        ? [b]
        : toggleInArray([...activeBrands], b);
    onSelect(newV);
  };

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-30px rounded-md" />
      ) : (
        <div className={classNames(styles.container, "am-gapX-24px")}>
          <div
            className={classNames(
              styles.item,
              activeBrands.length === availableBrands.length
                ? styles.active
                : ""
            )}
            onClick={onClickAll}
          >
            <span>{t("common.all_brand")}</span>
          </div>
          {list.map((b, _idx) => (
            <div
              className={classNames(
                styles.item,
                b.available ? "" : styles.disabled,
                activeBrands.map((t) => t.id).includes(b.id) &&
                  activeBrands.length !== availableBrands.length
                  ? styles.active
                  : ""
              )}
              onClick={() => onClickItem(b)}
              key={_idx}
            >
              <div dangerouslySetInnerHTML={{ __html: b.title }} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BrandsMenu;
