"use client";

import { FavoriteIcon, FavoriteMidIcon } from "@/components/Icons";
import { FavoriteSymbolProps } from "@/interfaces";
import React from "react";

const FavoriteSymbol: React.FC<FavoriteSymbolProps> = ({ showState }) => {
  return (
    <>
      {showState === "no" && (
        <FavoriteIcon
          className="group/svg cursor-pointer"
          pathClassName="fill-current text-zinc-100 lg:group-hover/svg:text-blue-50"
        />
      )}
      {showState === "yes" && (
        <FavoriteIcon
          className="cursor-pointer"
          pathClassName="fill-current text-red-500"
        />
      )}
      {showState === "mid" && <FavoriteMidIcon className="cursor-pointer" />}
    </>
  );
};

export default FavoriteSymbol;
