"use client";

import { ButtonBase, ButtonWhite, RatingSelector } from "@/components/Forms";
import { AuthModalContext } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthProvider";
import {
  FAVORITESTATES,
  ProductSimpleCardProps,
  buyerInterface,
} from "@/interfaces";
import {
  favoriteProduct,
  fetchProductByIdWithAuth,
  unFavoriteProduct,
} from "@/services/catalogsApi";
import { fetchBuyerById } from "@/services/shopsApi";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import "swiper/css";
import FavoriteSymbol from "../FavoriteSymbol";
import SizeList from "../SizeList";
import Skeleton from "../Skeleton";

const ProductSimpleCard: React.FC<ProductSimpleCardProps> = ({
  isLoading = false,
  product,
  isShowLabels = true,
  size = 156,
  toggleAuthModal,
  price,
  desktopBuyerColor = false,
  mobileBuyerColor = false,
  desktopBuyerLink = true,
  mobileBuyerLink = true,
}) => {
  const t = useTranslations();
  const [favState, setFavState] = useState<FAVORITESTATES>("no");
  const { isLoggedIn } = useAuth();
  const { setIsOpenAuthModal, setDefaultTab, setCallbackFunc, setLastProduct } =
    useContext(AuthModalContext);
  const [fetchFav, setFetchFav] = useState<boolean>(false);
  const router = useRouter();
  const [showBuyerLinkModal, setShowBuyerLinkModal] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [buyer, setBuyer] = useState<buyerInterface>();

  useEffect(() => {
    if (product && isLoggedIn && !fetchFav) {
      getProduct();
      setFetchFav(true);
    }
    if (product) {
      getBuyer();
    }
  }, [product]);

  useEffect(() => {
    window.addEventListener("resize", calcWidth);
    return () => {
      window.removeEventListener("resize", calcWidth);
    };
  }, []);

  const getProduct = async () => {
    if (!product) return;
    try {
      const res = await fetchProductByIdWithAuth(product.id);
      setFavState(res.is_favorite ? "yes" : "no");
    } catch (err) {
      console.log("Error get product with auth", err);
    }
  };
  const getBuyer = async () => {
    if (!product) return;
    try {
      const res = await fetchBuyerById(product.shop.id);
      if (res) setBuyer(res);
    } catch (err) {
      console.log("Error get buyer", err);
    }
  };

  const calcWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  const onClickFavorite = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      toggleAuthModal?.(true);
      setCallbackFunc(() => toggleAuthModal?.(false));
      setDefaultTab("login");
      setLastProduct("");
      setIsOpenAuthModal(true);
    } else {
      if (favState === "no") {
        try {
          const res = await favoriteProduct(product.id);
          setFavState("yes");
        } catch (err) {
          console.log("Error favorite product", err);
        }
      }
      if (favState === "yes") {
        setFavState("mid");
      }
      if (favState === "mid") {
        try {
          const res = await unFavoriteProduct(product.id);
          setFavState("no");
        } catch (err) {
          console.log("Error unfavorite product", err);
        }
      }
    }
  };

  return (
    <div>
      <Modal
        isOpen={showBuyerLinkModal}
        onRequestClose={() => setShowBuyerLinkModal(false)}
        style={{
          content: {
            width: screenWidth > 1023 ? "352px" : "calc(100% - 32px)",
            borderRadius: "8px",
            height: "min-content",
            background: "white",
            maxWidth: screenWidth > 1023 ? "352px" : "288px",
            margin: "auto",
            padding: screenWidth > 1023 ? "24px 16px" : "24px 16px 16px 16px",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          },
          overlay: {
            background: "rgba(12, 44, 75, 0.64)",
            backdropFilter: "blur(4px)",
            zIndex: 300,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          },
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <img
            src={buyer?.picture.path ?? "/images/no_img.png"}
            alt={product?.shop.title ?? ""}
            className="mx-auto rounded-xl w-128px h-128px"
          />
          <p className="text-center leading-5 font-semibold mt-4">
            {buyer?.shop_name ?? ""}
          </p>
          <p className="mt-1 mb-4 text-center text-sm leading-5">
            {t("product.redirect_store")}
          </p>
          <ButtonBase
            onClick={() => {
              router.push(`/buyers/${product?.shop.id}`);
            }}
            status="active"
          >
            {t("common.go")}
          </ButtonBase>
          <div className="mt-3">
            <ButtonWhite
              onClick={() => {
                setShowBuyerLinkModal(false);
              }}
              status="active"
            >
              {t("common.cancel")}
            </ButtonWhite>
          </div>
        </div>
      </Modal>
      {!isLoading && (
        <>
          <div className="flex justify-between am-gapX-8px am-lg-gapX-12px relative w-full max-w-full overflow-hidden">
            <img
              className={classNames(
                `rounded-xl object-cover object-center w-20 h-20`,
                {
                  "lg:h-156px lg:w-156px": size === 156,
                  "lg:h-108px lg:w-108px": size === 108,
                }
              )}
              src={product?.file?.path ?? "/images/no_img.png"}
              alt={product?.title ?? ""}
            />
            <div
              className="hidden flex-1 lg:flex flex-col am-gapY-8px"
              style={{ width: `calc(100% - 12px - ${size}px)` }}
            >
              <div className="flex items-center justify-between am-gapX-4px">
                <div className="flex-1 text-xl overflow-hidden whitespace-nowrap text-ellipsis">
                  {product?.title ?? ""}
                </div>
                <div>
                  <RatingSelector
                    value={product?.rate ?? 0}
                    maxRating={product?.max_rate ?? 5}
                    readOnly={true}
                    size={20}
                    gap={4}
                    displayValue={true}
                    valueGap={8}
                  />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <img
                  height={26}
                  className="h-[26px] max-w-[116px]"
                  src={product?.store?.file?.path ?? "/images/no_img.png"}
                  alt="Brand Logo"
                />
                <div
                  className={`${
                    desktopBuyerColor
                      ? "text-sky-600 cursor-pointer"
                      : "text-neutral-400"
                  } text-lg`}
                  style={{ lineHeight: "26px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (desktopBuyerLink) setShowBuyerLinkModal(true);
                  }}
                >
                  {product?.shop?.title ?? ""}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex am-gapX-8px items-end">
                  <div
                    style={{ fontSize: "28px", lineHeight: "1" }}
                    className="font-semibold"
                  >
                    {!price && "от "}
                    {(price ?? product?.price ?? 0).toLocaleString("ru-RU")} ₽
                  </div>
                  <div
                    className="text-neutral-400"
                    style={{ fontSize: "16px", lineHeight: "21px" }}
                  >
                    / {product?.quantity ?? 0} {product?.unit ?? "шт"}.
                  </div>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickFavorite();
                  }}
                >
                  <FavoriteSymbol showState={favState} />
                </div>
              </div>
            </div>
            <div
              className="lg:hidden flex-1 flex flex-col relative"
              style={{ width: "calc(100% - 88px)" }}
            >
              <div className="flex justify-between items-center h-5">
                <div>
                  <RatingSelector
                    value={product?.rate ?? 0}
                    maxRating={product?.max_rate ?? 5}
                    readOnly={true}
                    size={13}
                    gap={2}
                    displayValue={true}
                    valueGap={8}
                  />
                </div>
                <img
                  height={14}
                  className="h-3.5 max-w-62px"
                  src={product?.store?.file?.path ?? "/images/no_img.png"}
                  alt="Brand Logo"
                />
              </div>
              <div className="flex justify-between am-gapX-16px">
                <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                  {product?.title ?? ""}
                </div>
                <div className="w-5 min-w-5"></div>
              </div>
              <div
                className={`${
                  mobileBuyerColor
                    ? "text-sky-600 cursor-pointer"
                    : "text-neutral-400"
                } text-xs leading-5 w-fit`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (mobileBuyerLink) setShowBuyerLinkModal(true);
                }}
              >
                {product?.shop.title ?? ""}
              </div>
              <div className="flex items-end">
                <div
                  style={{ fontSize: "14px", lineHeight: "20px" }}
                  className="font-semibold mr-1"
                >
                  {!price && "от "}
                  {(price ?? product?.price ?? 0).toLocaleString("ru-RU")} ₽
                </div>
                <div
                  className="text-neutral-400"
                  style={{ fontSize: "12px", lineHeight: "20px" }}
                >
                  / {product?.quantity ?? 0} {product?.unit ?? "шт"}.
                </div>
              </div>
              <div
                className="absolute right-0"
                style={{ bottom: "29px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickFavorite();
                }}
              >
                <FavoriteSymbol showState={favState} />
              </div>
            </div>
          </div>
          {product?.stocks_labels && product?.stocks_labels.length > 0 && (
            <div
              className={classNames("lg:mt-3 mt-10px", {
                hidden: !isShowLabels,
              })}
            >
              <SizeList sizes={product?.stocks_labels ?? []} />
            </div>
          )}
        </>
      )}
      {isLoading && (
        <>
          <div className="flex am-gapX-8px am-lg-gapX-12px relative">
            <Skeleton
              className={`rounded-lg h-20 w-20 lg:w-${size}px lg:h-${size}px`}
            />
            <div className="flex flex-col justify-between am-gapX-4px flex-1">
              <div className="flex justify-between">
                <Skeleton className="rounded-md h-4 lg:h-6 w-20" />
                <Skeleton className="rounded-md h-4 lg:h-6 w-16" />
              </div>
              <Skeleton className="rounded-md h-4 lg:h-6 w-40" />
              <Skeleton className="rounded-md h-4 lg:h-6 w-20" />
              <Skeleton className="rounded-md h-4 lg:h-6 w-40" />
            </div>
            <Skeleton className="absolute right-0 rounded-full h-4 w-4 lg:h-6 lg:w-6 bottom-45px" />
          </div>
          <Skeleton
            className={classNames(
              "rounded-md h-4 lg:h-6 mt-10px lg:mt-3 w-full",
              {
                hidden: !isShowLabels,
              }
            )}
          />
        </>
      )}
    </div>
  );
};

export default ProductSimpleCard;
