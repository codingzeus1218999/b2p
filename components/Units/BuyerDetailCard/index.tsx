"use client";

import { AuthModalContext } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthProvider";
import { BuyerDetailCardProps, FAVORITESTATES } from "@/interfaces";
import {
  favoriteBuyer,
  fetchBuyerByIdWithAuth,
  unFavoriteBuyer,
} from "@/services/shopsApi";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import FavoriteSymbol from "../FavoriteSymbol";
import Skeleton from "../Skeleton";
import styles from "./style.module.css";

const BuyerDetailCard: React.FC<BuyerDetailCardProps> = ({
  isLoading = false,
  buyerDetail,
}) => {
  const t = useTranslations();
  const [favState, setFavState] = useState<FAVORITESTATES>("no");
  const [fetchFav, setFetchFav] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { setIsOpenAuthModal, setDefaultTab, setLastProduct, setCallbackFunc } =
    useContext(AuthModalContext);
  useEffect(() => {
    if (buyerDetail && isLoggedIn && !fetchFav) {
      getBuyer();
      setFetchFav(true);
    }
  }, [buyerDetail]);

  const getBuyer = async () => {
    if (!buyerDetail) return;
    try {
      const res = await fetchBuyerByIdWithAuth(buyerDetail.id);
      setFavState(res.is_favorites ? "yes" : "no");
    } catch (err) {
      console.log("Error get buyer with auth", err);
    }
  };
  const onClickFavorite = async () => {
    if (!buyerDetail) return;
    if (!isLoggedIn) {
      setDefaultTab("login");
      setLastProduct("");
      setCallbackFunc(null);
      setIsOpenAuthModal(true);
    } else {
      if (favState === "no") {
        try {
          const res = await favoriteBuyer(buyerDetail.id);
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
          const res = await unFavoriteBuyer(buyerDetail.id);
          setFavState("no");
        } catch (err) {
          console.log("Error unfavorite buyer", err);
        }
      }
    }
  };
  const onClickCard = () => {
    if (!buyerDetail) return;
    router.push(`/buyers/${buyerDetail.id}`);
  };
  return (
    <div className={classNames(styles.container)} onClick={onClickCard}>
      <div className={styles.leftSection}>
        {isLoading ? (
          <Skeleton className="rounded-lg lg:h-96px lg:w-96px w-20 h-20" />
        ) : (
          <img
            width={96}
            height={96}
            className="h-20 w-20 lg:h-96px lg:w-96px rounded-xl object-cover object-center"
            src={buyerDetail?.picture.path ?? "/images/no_img.png"}
            alt={buyerDetail?.shop_name ?? t("buyer.buyer")}
          />
        )}
        <div className={styles.info} style={{ marginLeft: "12px" }}>
          {isLoading ? (
            <Skeleton className="w-40 h-4 lg:h-6 rounded-md" />
          ) : (
            <p className="text-base leading-5 lg:text-xl">
              {buyerDetail?.shop_name}
            </p>
          )}
          {isLoading ? (
            <Skeleton className="w-20 h-4 lg:h-6 rounded-md" />
          ) : (
            <div className="flex items-center">
              <object
                data="/images/ChatbubbleEllipses.svg"
                className="h-[18px] w-[18px] flex-shrink-0 mr-2"
              />
              <p>{buyerDetail?.comments}</p>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-4 w-4 rounded-full lg:h-6 lg:w-6" />
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
  );
};

export default BuyerDetailCard;
