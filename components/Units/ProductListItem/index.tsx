"use client";

import { DownIcon, UpIcon } from "@/components/Icons";
import { ProductListItemProps } from "@/interfaces";
import moment from "moment";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import ProductSimpleCard from "../ProductSimpleCard";
import ReviewSimple from "../ReviewSimple";

const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  isLoading,
  onClickItem,
}) => {
  const t = useTranslations();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const toggleDescription = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };
  const onClickProduct = () => {
    if (product && onClickItem && !isAuthModalOpen) onClickItem(product.id);
  };

  const toggleAuthModal = (isOpen: boolean) => {
    setIsAuthModalOpen(isOpen);
  };

  return (
    <div
      className="flex flex-col px-4 py-3 bg-white rounded-lg shadow-custom-1 lg:hover:shadow-[8px_12px_32px_0px_rgba(25,118,210,0.32)] lg:transition-shadow lg:duration-200 cursor-pointer overflow-hidden"
      onClick={onClickProduct}
    >
      <ProductSimpleCard
        isLoading={isLoading}
        isShowLabels={true}
        product={product}
        size={108}
        toggleAuthModal={toggleAuthModal}
        desktopBuyerColor
      />
      {!isLoading && (
        <>
          <div className="mt-4 hidden lg:block">
            <div className="flex-col flex am-gapY-12px">
              <p
                className={`text-sm text-neutral-600 ${
                  isDescriptionExpanded ? "" : "line-clamp-3"
                }`}
              >
                {product?.description}
              </p>
              <button
                onClick={toggleDescription}
                className="text-sky-600 text-sm flex items-center am-gapX-4px w-fit"
              >
                <span>{t("product.description")}</span>
                {isDescriptionExpanded ? <UpIcon /> : <DownIcon />}
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            {product?.last_review && (
              <div className="mt-4">
                <ReviewSimple
                  review={{
                    rating: product.last_review.rating,
                    date: moment(product.last_review.publish_at).format(
                      "DD.MM.YYYY"
                    ),
                    time: moment(product.last_review.publish_at).format(
                      "HH:mm"
                    ),
                    location: product.last_review.cities,
                    comment: product.last_review.comment,
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListItem;
