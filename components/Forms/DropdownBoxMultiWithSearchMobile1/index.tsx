"use client";

import { CrossIcon, RemoveIcon, SearchIcon } from "@/components/Icons";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import { ScrollContext } from "@/context/ScrollContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  DropdownBoxMultiWithSearchMobile1Props,
  dropdownItemInterface,
} from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./style.module.css";
import { getChromeVersion } from "@/utils/calcUtils";

const DropdownBoxMultiWithSearchMobile1: React.FC<
  DropdownBoxMultiWithSearchMobile1Props
> = ({
  list,
  onChange,
  title,
  totalTitle,
  maxCount,
  maxErrMsg,
  activeItems,
  type,
  isShowTotalTitle = false,
  style,
  searchable = true,
}) => {
  const t = useTranslations();
  const [chromeVersion, setChromeVersion] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setScroll } = useContext(ScrollContext);
  const [searchStr, setSearchStr] = useState("");
  const [showErr, setShowErr] = useState<boolean>(false);
  const [sortedList, setSortedList] = useState<dropdownItemInterface[]>([]);
  const [lastSelectedItems, setLastSelectedItems] = useState<
    dropdownItemInterface[]
  >([]);
  const ref = useRef(null);
  const { dropdownOpen, setDropdownOpen } = useContext(DropdownOpenContext);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  useEffect(() => {
    setSortedList([...list]);
  }, [list]);
  useEffect(() => {
    if (!isOpen) {
      setSearchStr("");
      setShowErr(false);
      setSortedList(
        [...list].sort((a, b) => (activeItems.includes(a) ? -1 : 0))
      );
      setLastSelectedItems([...activeItems]);
      if (type !== "desktop") setScroll(true);
    } else if (type !== "desktop") setScroll(false);
  }, [isOpen]);
  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);
  useEffect(() => {
    const cv = getChromeVersion();
    setChromeVersion(cv);
  });

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
    <div ref={ref} className="bg-white" style={style}>
      <div
        className="cursor-pointer overflow-hidden px-4 py-3.5"
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
        ) : activeItems.length ===
          list.filter((l) => l.available !== false).length ? (
          isShowTotalTitle ? (
            <div
              className="px-2 py-0.5 bg-sky-100 rounded text-sky-600 leading-6 w-fit"
              style={{ fontSize: "14px" }}
            >
              {totalTitle}
            </div>
          ) : (
            <p className="text-sky-600 whitespace-nowrap leading-7">
              {totalTitle}
            </p>
          )
        ) : (
          <Swiper
            spaceBetween={8}
            slidesPerView={"auto"}
            modules={[FreeMode]}
            freeMode
            onSlideChange={() => {
              setDropdownOpen(dropdownOpen + 1);
            }}
            onClick={() => {
              setDropdownOpen(dropdownOpen + 1);
            }}
          >
            {activeItems.map((s, _idx) => (
              <SwiperSlide key={_idx} className="!w-fit">
                <div
                  className="multi-selected-item-2"
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
        <div className={styles.modal}>
          <div
            className={classNames(styles.container)}
            style={
              type === "desktop"
                ? {
                    maxHeight: "532px",
                    position: "absolute",
                    boxShadow: "8px 12px 32px 0px rgba(25, 118, 210, 0.32)",
                    padding: "16px 6px 16px 16px",
                  }
                : {
                    height: "100dvh",
                    padding: "16px 6px 84px 16px",
                    position: "fixed",
                  }
            }
          >
            <div
              style={{
                overflowY: "auto",
                maxHeight: type === "desktop" ? "500px" : "calc(100dvh - 32px)",
                paddingBottom: type === "desktop" ? "0px" : "68px",
              }}
            >
              <div
                style={{ paddingRight: "6px" }}
                className="flex flex-col am-gapY-6px"
              >
                <div
                  className={`py-2 px-4 ${type === "desktop" ? "hidden" : ""}`}
                >
                  <CrossIcon
                    fill="#191c1f"
                    className="cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <div
                  className={`flex flex-col am-gapY-6px bg-white ${
                    type === "desktop" ? "sticky top-0" : ""
                  } `}
                >
                  <div
                    className={classNames(
                      "py-2 px-4 flex items-center justify-between rounded bg-gray-200",
                      { "bg-gray-50": isInputFocused, hidden: !searchable }
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
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                    />
                    {searchStr ? (
                      <CrossIcon
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
                      active:
                        list.filter((l) => l.available !== false).length ===
                        activeItems.length,
                      hidden: searchStr,
                    }
                  )}
                  onClick={() => {
                    if (
                      activeItems.length ===
                      list.filter((l) => l.available !== false).length
                    ) {
                      onChange([]);
                    } else {
                      onChange([...list.filter((l) => l.available !== false)]);
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
                              isActive &&
                              activeItems.length !==
                                list.filter((l) => l.available !== false)
                                  .length,
                            disable: l.available === false,
                          }
                        )}
                        key={_idx}
                        onClick={() => {
                          if (l.available === false) return;
                          if (
                            activeItems.length ===
                            list.filter((l) => l.available !== false).length
                          ) {
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
                        {isActive &&
                          activeItems.length !==
                            list.filter((l) => l.available !== false)
                              .length && (
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
          <div
            className={classNames(
              styles.btnContainer,
              type === "desktop" ? "hidden" : ""
            )}
            style={
              chromeVersion > 75
                ? {
                    backdropFilter: "blur(2px)",
                  }
                : { backgroundColor: "white" }
            }
          >
            <div
              className="btn-primary w-full"
              onClick={() => setIsOpen(false)}
            >
              Готово
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBoxMultiWithSearchMobile1;
