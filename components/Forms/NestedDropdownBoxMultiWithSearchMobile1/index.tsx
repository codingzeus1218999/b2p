"use client";

import { CrossIcon, RemoveIcon, SearchIcon } from "@/components/Icons";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import { ScrollContext } from "@/context/ScrollContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  NestedDropdownBoxMultiWithSearchMobile1Props,
  nestedDropdownItemInterface,
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

const NestedDropdownBoxMultiWithSearchMobile1: React.FC<
  NestedDropdownBoxMultiWithSearchMobile1Props
> = ({
  list,
  onChange,
  title,
  totalTitle,
  maxCount,
  maxErrMsg,
  activeItems,
  type,
}) => {
  const t = useTranslations();
  const [chromeVersion, setChromeVersion] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setScroll } = useContext(ScrollContext);
  const [searchStr, setSearchStr] = useState("");
  const [showErr, setShowErr] = useState<boolean>(false);
  const ref = useRef(null);
  const { dropdownOpen, setDropdownOpen } = useContext(DropdownOpenContext);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [lastSelectedItems, setLastSelectedItems] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [sortedList, setSortedList] = useState<nestedDropdownItemInterface[]>(
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchStr("");
      setShowErr(false);
      if (type !== "desktop") setScroll(true);
      setSortedList(
        activeItems.length === [...list].filter((s) => s.parentId).length
          ? [...list]
          : [...list].sort((a, b) => {
              let isAActive = false;
              let isBActive = false;
              if (
                a.parentId === null &&
                a.subValues.every(
                  (s) => activeItems.filter((t) => t.value === s).length > 0
                )
              ) {
                isAActive = true;
              }
              if (
                a.parentId !== null &&
                activeItems.filter((t) => t.value === a.value).length > 0 &&
                ![...list]
                  .filter((l) => l.value === a.parentId)[0]
                  .subValues.every(
                    (s) => activeItems.filter((t) => t.value === s).length > 0
                  )
              ) {
                isAActive = true;
              }
              if (
                b.parentId === null &&
                b.subValues.every(
                  (s) => activeItems.filter((t) => t.value === s).length > 0
                )
              ) {
                isBActive = true;
              }
              if (
                b.parentId !== null &&
                activeItems.filter((t) => t.value === b.value).length > 0 &&
                ![...list]
                  .filter((l) => l.value === b.parentId)[0]
                  .subValues.every(
                    (s) => activeItems.filter((t) => t.value === s).length > 0
                  )
              ) {
                isBActive = true;
              }
              return Number(isBActive) - Number(isAActive);
            })
      );
      setLastSelectedItems(
        [...list].filter((l) => l.parentId).length === activeItems.length
          ? []
          : [...list].filter((a) => {
              if (
                a.parentId === null &&
                a.subValues.every(
                  (s) => activeItems.filter((t) => t.value === s).length > 0
                )
              ) {
                return true;
              }
              if (
                a.parentId !== null &&
                activeItems.filter((t) => t.value === a.value).length > 0 &&
                ![...list]
                  .filter((l) => l.value === a.parentId)[0]
                  .subValues.every(
                    (s) => activeItems.filter((t) => t.value === s).length > 0
                  )
              ) {
                return true;
              }
            })
      );
    } else if (type !== "desktop") setScroll(false);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

  useEffect(() => {
    const cv = getChromeVersion();
    setChromeVersion(cv);
  }, []);

  useEffect(() => {
    setSortedList([...list]);
  }, [list]);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  const reSort = (item: nestedDropdownItemInterface) => {
    const newLasted = [...lastSelectedItems].filter(
      (ls) => ls.value !== item.value
    );
    setLastSelectedItems([...newLasted]);
    setSortedList(
      newLasted.length === [...list].filter((s) => s.parentId).length
        ? [...list]
        : [...list].sort((a, b) => {
            let isAActive = false;
            let isBActive = false;
            if (newLasted.includes(a)) {
              isAActive = true;
            }
            if (newLasted.includes(b)) {
              isBActive = true;
            }

            return Number(isBActive) - Number(isAActive);
          })
    );
  };

  return (
    <div ref={ref} className="bg-white">
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
          [...list].filter((c) => c.parentId !== null).length ? (
          <p className="text-sky-600 whitespace-nowrap leading-7">
            {totalTitle}
          </p>
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
            {[...list].map((l, _idx) => {
              if (l.parentId === null) {
                const isActive = l.subValues.every(
                  (s) => activeItems.filter((t) => t.value === s).length > 0
                );
                if (isActive) {
                  return (
                    <SwiperSlide key={_idx} className="!w-fit">
                      <div className="multi-selected-item-1">{l.label}</div>
                    </SwiperSlide>
                  );
                } else {
                  const activeSubs = activeItems.filter((ai) =>
                    l.subValues.includes(ai.value)
                  );
                  return activeSubs.map((asb, _inx) => {
                    return (
                      <SwiperSlide key={_inx} className="!w-fit">
                        <div className="multi-selected-item-1">{asb.label}</div>
                      </SwiperSlide>
                    );
                  });
                }
              }
            })}
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
                    position: "fixed",
                    padding: "16px 6px 84px 16px",
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
                        className="cursor-pointer"
                        onClick={() => {
                          setSearchStr("");
                        }}
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
                    "cursor-pointer py-2 pr-4 pl-6 text-neutral-400 leading-6 dropdownbox-item",
                    {
                      active:
                        [...list].filter((c) => c.parentId !== null).length ===
                        activeItems.length,
                      hidden: searchStr,
                    }
                  )}
                  onClick={() => {
                    setSortedList([...list]);
                    if (
                      activeItems.length ===
                      [...list].filter((c) => c.parentId !== null).length
                    )
                      onChange([]);
                    else onChange([...list].filter((c) => c.parentId !== null));
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
                      l.parentId === null
                        ? l.subValues.every(
                            (s) =>
                              activeItems.filter((t) => t.value === s).length >
                              0
                          )
                        : activeItems.filter((t) => t.value === l.value)
                            .length > 0;
                    const isParentActive =
                      l.parentId === null
                        ? false
                        : [...list]
                            .filter((a) => a.value === l.parentId)[0]
                            .subValues.every(
                              (s) =>
                                activeItems.filter((t) => t.value === s)
                                  .length > 0
                            );
                    return (
                      <div
                        className={classNames(
                          "cursor-pointer py-2 pr-4 text-neutral-400 leading-6 dropdownbox-item flex items-center justify-between",
                          {
                            active:
                              (l.parentId === null &&
                                isActive &&
                                activeItems.length !==
                                  [...list].filter((l) => l.parentId !== null)
                                    .length) ||
                              (l.parentId !== null &&
                                isActive &&
                                !isParentActive),
                            "pl-4 font-semibold": l.parentId === null,
                            "pl-6": l.parentId !== null,
                          }
                        )}
                        key={_idx}
                        onClick={() => {
                          if (l.parentId === null) {
                            if (
                              activeItems.length ===
                              [...list].filter((c) => c.parentId !== null)
                                .length
                            ) {
                              if (maxCount && l.subValues.length > maxCount) {
                                setShowErr(true);
                                return;
                              }
                              onChange(
                                [...list].filter((c) => c.parentId === l.value)
                              );
                              return;
                            } else {
                              if (isActive) {
                                if (lastSelectedItems.includes(l)) reSort(l);
                                onChange(
                                  activeItems.filter(
                                    (s) => !l.subValues.includes(s.value)
                                  )
                                );
                                setShowErr(false);
                                return;
                              } else {
                                const newArr = [...list]
                                  .filter((lii) =>
                                    l.subValues.includes(lii.value)
                                  )
                                  .concat(
                                    activeItems.filter(
                                      (s) => !l.subValues.includes(s.value)
                                    )
                                  );
                                if (maxCount && newArr.length > maxCount) {
                                  setShowErr(true);
                                  return;
                                }
                                [...list]
                                  .filter((ll) =>
                                    l.subValues.includes(ll.value)
                                  )
                                  .map((tl) => {
                                    if (lastSelectedItems.includes(tl))
                                      reSort(tl);
                                    return 0;
                                  });
                                onChange(newArr);
                                return;
                              }
                            }
                          } else {
                            if (isParentActive) {
                              if (
                                lastSelectedItems.includes(
                                  [...list].filter(
                                    (t) => t.value === l.parentId
                                  )[0]
                                )
                              ) {
                                reSort(
                                  [...list].filter(
                                    (t) => t.value === l.parentId
                                  )[0]
                                );
                              }
                              onChange([
                                ...activeItems.filter(
                                  (c) => c.parentId !== l.parentId
                                ),
                                l,
                              ]);
                              return;
                            } else if (isActive) {
                              if (lastSelectedItems.includes(l)) reSort(l);
                              onChange(
                                activeItems.filter((a) => a.value !== l.value)
                              );
                              setShowErr(false);
                              return;
                            } else {
                              if (maxCount && activeItems.length >= maxCount) {
                                setShowErr(true);
                                return;
                              }
                              onChange([...activeItems, l]);
                            }
                          }
                        }}
                      >
                        <p className="flex-1">{l.label}</p>
                        {((l.parentId === null &&
                          isActive &&
                          activeItems.length !==
                            [...list].filter((l) => l.parentId !== null)
                              .length) ||
                          (l.parentId !== null &&
                            isActive &&
                            !isParentActive)) && (
                          <RemoveIcon className="cursor-pointer" />
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

export default NestedDropdownBoxMultiWithSearchMobile1;
