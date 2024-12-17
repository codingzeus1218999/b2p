"use client";

import { CommentsIcon } from "@/components/Icons";
import { AuthModalContext } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthProvider";
import { BuyerCardProps, FAVORITESTATES } from "@/interfaces";
import {
  favoriteBuyer,
  fetchBuyerByIdWithAuth,
  unFavoriteBuyer,
} from "@/services/shopsApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import FavoriteSymbol from "../FavoriteSymbol";
import Skeleton from "../Skeleton";

const BuyerCard: React.FC<BuyerCardProps> = ({
  buyer,
  isLoading = false,
  size,
}) => {
  const t = useTranslations();
  const [favState, setFavState] = useState<FAVORITESTATES>("no");
  const [fetchFav, setFetchFav] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();
  const {
    isOpenAuthModal,
    setIsOpenAuthModal,
    setDefaultTab,
    setLastProduct,
    setCallbackFunc,
  } = useContext(AuthModalContext);
  const pad = size > 194 ? 13.96 : size > 167 ? 12 : 8;
  const rad = size > 194 ? 9.31 : 8;
  const imgSize = size > 194 ? 93 : 80;
  const nameMt = size > 194 ? 18.61 : size > 167 ? 16 : 5.92;
  const nameFs = size > 194 ? 18 : size > 167 ? 16 : 12;
  const nameLh = size > 194 ? 27.917 : size > 167 ? 24 : 20;
  const gapS = size > 194 ? 9.31 : 8;
  const countFs = size > 194 ? 16 : size > 167 ? 14 : 12;
  const countLh = size > 194 ? 28 : size > 167 ? 24 : 20;

  const router = useRouter();
  useEffect(() => {
    if (buyer && isLoggedIn && !fetchFav) {
      getBuyer();
      setFetchFav(true);
    }
  }, [buyer]);

  const getBuyer = async () => {
    if (!buyer) return;
    try {
      const res = await fetchBuyerByIdWithAuth(buyer.id);
      setFavState(res.is_favorites ? "yes" : "no");
    } catch (err) {
      console.log("Error get buyer with auth", err);
    }
  };
  const onClickCard = () => {
    if (isLoading) return;
    if (!isOpenAuthModal) router.push(`/buyers/${buyer?.id}`);
  };
  const onClickFavorite = async () => {
    if (!buyer) return;
    if (!isLoggedIn) {
      setDefaultTab("login");
      setLastProduct("");
      setCallbackFunc(null);
      setIsOpenAuthModal(true);
    } else {
      if (favState === "no") {
        try {
          const res = await favoriteBuyer(buyer.id);
          setFavState("yes");
        } catch (err) {
          console.log("Error favorite buyer", err);
        }
      }
      if (favState === "yes") {
        setFavState("mid");
      }
      if (favState === "mid") {
        try {
          const res = await unFavoriteBuyer(buyer.id);
          setFavState("no");
        } catch (err) {
          console.log("Error unfavorite buyer", err);
        }
      }
    }
  };
  return (
    <div
      className="cursor-pointer group bg-white shadow-[0_4.8px_24px_0px_rgba(25,118,210,0.16)] relative lg:hover:shadow-[0_12px_32px_0px_rgba(25,118,210,0.32)] lg:transition-shadow duration-200 flex flex-col justify-between"
      onClick={onClickCard}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: `${pad}px 0`,
        borderRadius: `${rad}px`,
      }}
    >
      <div>
        <div className="mx-auto w-fit">
          {isLoading ? (
            <div style={{ width: `${imgSize}px`, height: `${imgSize}px` }}>
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ) : (
            <img
              width={80}
              height={80}
              style={{ width: `${imgSize}px`, height: `${imgSize}px` }}
              className="rounded-xl object-cover object-center mx-auto"
              src={buyer?.picture ?? "/images/no_img.png"}
              alt={buyer?.name ?? t("buyer.buyer")}
            />
          )}
        </div>
        <div
          className="absolute"
          style={{ right: `${pad}px`, top: `${pad}px` }}
        >
          {isLoading ? (
            <Skeleton className="w-19px h-19px rounded-full" />
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onClickFavorite();
              }}
            >
              <FavoriteSymbol showState={favState} />
            </div>
          )}
        </div>
        <div
          className="flex justify-center px-6px"
          style={{ marginTop: `${nameMt}px` }}
        >
          {isLoading ? (
            <Skeleton className="rounded-md w-2/3 h-5 lg:h-6" />
          ) : (
            <p
              className="text-center lg:group-hover:text-sky-600 overflow-hidden text-ellipsis"
              style={{ fontSize: `${nameFs}px`, lineHeight: `${nameLh}px` }}
            >
              {buyer?.name}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        {isLoading ? (
          <Skeleton className="rounded-md w-1/3 h-14px lg:h-5" />
        ) : (
          <>
            {size < 195 && <CommentsIcon size={15} />}
            {size > 194 && <CommentsIcon size={18} />}
            <p
              className="w-fit"
              style={{
                fontSize: `${countFs}px`,
                lineHeight: `${countLh}px`,
                marginLeft: `${gapS}px`,
              }}
            >
              {buyer?.comments}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerCard;
