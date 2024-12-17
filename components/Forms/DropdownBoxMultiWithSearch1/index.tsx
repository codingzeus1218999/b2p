"use client";

import { CrossIcon, RemoveIcon, SearchIcon } from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  DropdownBoxMultiWithSearch1Props,
  dropdownItemInterface,
} from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DropdownBoxMultiWithSearch1: React.FC<
  DropdownBoxMultiWithSearch1Props
> = ({
  list,
  onChange,
  title,
  totalTitle,
  maxCount,
  maxErrMsg,
  activeItems,
  left = 0,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState("");
  const [showErr, setShowErr] = useState<boolean>(false);
  const [sortedList, setSortedList] = useState<dropdownItemInterface[]>([]);
  const [lastSelectedItems, setLastSelectedItems] = useState<
    dropdownItemInterface[]
  >([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const ref = useRef(null);
  const { setBlur } = useContext(BlurContext);
  const { setDropdownOpen, dropdownOpen, setIsSelf, isSelf } =
    useContext(DropdownOpenContext);

  useEffect(() => {
    setSortedList([...list]);
  }, [list]);
  useEffect(() => {
    if (isSelf) {
      setBlur(true);
      setTimeout(() => {
        setIsSelf(false);
      }, 100);
    } else {
      setBlur(isOpen);
    }
    if (!isOpen) {
      setSearchStr("");
      setShowErr(false);
      setSortedList(
        [...list].sort((a, b) => (activeItems.includes(a) ? -1 : 0))
      );
      setLastSelectedItems([...activeItems]);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  const reSort = (item: dropdownItemInterface) => {
    const newLasted = lastSelectedItems.filter((ls) => ls !== item);
    setLastSelectedItems([...newLasted]);
    setSortedList([...list].sort((a, b) => (newLasted.includes(a) ? -1 : 0)));
  };

  return (
    <div className="relative filter-main" ref={ref}>
      <div
        className="cursor-pointer overflow-hidden"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {activeItems.length === 0 ? (
          <p
            className={`${
              !isOpen && "text-zinc-200"
            } whitespace-nowrap leading-7`}
          >
            {title}
          </p>
        ) : activeItems.length === list.length ? (
          <p className="text-sky-600 whitespace-nowrap leading-7">
            {totalTitle}
          </p>
        ) : (
          <Swiper
            spaceBetween={8}
            slidesPerView={"auto"}
            modules={[FreeMode]}
            className="flex-nowrap"
            freeMode
            onSlideChange={() => {
              setDropdownOpen(dropdownOpen + 1);
              setIsSelf(true);
            }}
            onClick={() => {
              setDropdownOpen(dropdownOpen + 1);
              setIsSelf(true);
            }}
          >
            {activeItems.map((s, _idx) => (
              <SwiperSlide key={_idx} className="!w-fit">
                <div
                  className="multi-selected-item-1"
                  dangerouslySetInnerHTML={{
                    __html: s.icon ? s.icon + "&nbsp;" + s.label : s.label,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      {isOpen && list.length > 0 && (
        <div
          className="absolute top-12 bg-white z-40 rounded-lg"
          style={{
            maxHeight: "532px",
            boxShadow: "0px 4px 24px 0px rgba(25, 118, 210, 0.16)",
            width: "320px",
            left: left ? left + "px" : "0px",
            padding: "16px 6px 16px 16px",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              maxHeight: "500px",
            }}
          >
            <div
              style={{ paddingRight: "6px" }}
              className="flex flex-col am-gapY-6px"
            >
              <div className="sticky top-0 bg-white flex flex-col am-gapY-6px">
                <div
                  className={classNames(
                    "py-2 px-4 flex items-center justify-between rounded bg-gray-200",
                    { "bg-gray-50": isInputFocused }
                  )}
                >
                  <input
                    type="text"
                    placeholder={t("common.search")}
                    className={classNames(
                      "leading-6 text-sky-600 flex-1 bg-gray-200 min-w-3",
                      {
                        "bg-gray-50": isInputFocused,
                      }
                    )}
                    value={searchStr}
                    onChange={(e) => {
                      setSearchStr(e.target.value);
                    }}
                    onFocus={() => {
                      setIsInputFocused(true);
                    }}
                    onBlur={() => setIsInputFocused(false)}
                  />
                  {searchStr ? (
                    <CrossIcon
                      fill="#ababad"
                      className="cursor-pointer"
                      onClick={() => setSearchStr("")}
                    />
                  ) : (
                    <SearchIcon />
                  )}
                </div>
                {maxCount && showErr && (
                  <div style={{ padding: "2px 0" }}>
                    <p className="text-red-300 text-sm">{maxErrMsg}</p>
                  </div>
                )}
              </div>
              <div
                className={classNames(
                  "cursor-pointer py-2 px-4 text-neutral-400 leading-6 dropdownbox-item",
                  {
                    active: list.length === activeItems.length,
                    hidden: searchStr,
                  }
                )}
                onClick={() => {
                  if (activeItems.length === list.length) {
                    onChange([]);
                  } else {
                    onChange([...list]);
                  }
                  setIsOpen(false);
                }}
              >
                {totalTitle}
              </div>
              {sortedList
                .filter((l) =>
                  l.label?.toLowerCase()?.includes(searchStr.toLowerCase())
                )
                .map((l, _idx) => {
                  const isActive =
                    activeItems.filter((t) => t.value === l.value).length > 0;
                  return (
                    <div
                      className={classNames(
                        "cursor-pointer py-2 px-4 text-neutral-400 leading-6 dropdownbox-item flex items-center justify-between",
                        {
                          active:
                            isActive && activeItems.length !== list.length,
                        }
                      )}
                      key={_idx}
                      onClick={() => {
                        if (activeItems.length === list.length) {
                          onChange([l]);
                          return;
                        } else if (isActive) {
                          onChange(
                            activeItems.filter((t) => t.value !== l.value)
                          );
                          if (lastSelectedItems.includes(l)) {
                            reSort(l);
                          }
                          setShowErr(false);
                          return;
                        } else {
                          if (maxCount && activeItems.length >= maxCount) {
                            setShowErr(true);
                            return;
                          }
                          onChange([...activeItems, l]);
                        }
                      }}
                    >
                      <div
                        className="flex-1"
                        dangerouslySetInnerHTML={{
                          __html: l.icon
                            ? l.icon + "&nbsp;" + l.label
                            : l.label,
                        }}
                      />
                      {isActive && activeItems.length !== list.length && (
                        <RemoveIcon
                          className="cursor-pointer"
                          onClick={() => {
                            onChange(
                              activeItems.filter((t) => t.value !== l.value)
                            );
                            setShowErr(false);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBoxMultiWithSearch1;
