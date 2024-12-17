"use client";

import {
  CrossIcon,
  DropdownCloseIcon,
  DropdownOpenIcon,
  RemoveIcon,
  SearchIcon,
} from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  NestedDropdownBoxMultiWithSearchProps,
  nestedDropdownItemInterface,
} from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const NestedDropdownBoxMultiWithSearch: React.FC<
  NestedDropdownBoxMultiWithSearchProps
> = ({
  list,
  onChange,
  title,
  totalTitle,
  maxCount,
  maxErrMsg,
  activeItems,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState("");
  const [showErr, setShowErr] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [lastSelectedItems, setLastSelectedItems] = useState<
    nestedDropdownItemInterface[]
  >([]);
  const [sortedList, setSortedList] = useState<nestedDropdownItemInterface[]>(
    []
  );
  const ref = useRef(null);
  const { setBlur } = useContext(BlurContext);
  const { setDropdownOpen, dropdownOpen, isSelf, setIsSelf } =
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
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

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
    <div className="relative filter-main" ref={ref}>
      <div
        className={classNames(
          "cursor-pointer pr-3 pl-1 min-h-9 flex items-center rounded-xl am-gapX-8px",
          {
            "bg-sky-50": !isOpen,
            "bg-gray-300": isOpen,
          }
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex-1 overflow-hidden">
          {activeItems.length === 0 ? (
            <p className={`text-sm whitespace-nowrap pl-2`}>{title}</p>
          ) : activeItems.length ===
            [...list].filter((c) => c.parentId !== null).length ? (
            <p className="text-sky-600 whitespace-nowrap text-sm pl-2">
              {totalTitle}
            </p>
          ) : (
            <Swiper
              spaceBetween={4}
              slidesPerView={"auto"}
              modules={[FreeMode]}
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
              {[...list].map((l, _idx) => {
                if (l.parentId === null) {
                  const isActive = l.subValues.every(
                    (s) => activeItems.filter((t) => t.value === s).length > 0
                  );
                  if (isActive) {
                    return (
                      <SwiperSlide key={_idx} className="!w-fit">
                        <div className="multi-selected-item-3">{l.label}</div>
                      </SwiperSlide>
                    );
                  } else {
                    const activeSubs = activeItems.filter((ai) =>
                      l.subValues.includes(ai.value)
                    );
                    return activeSubs.map((asb, _inx) => {
                      return (
                        <SwiperSlide key={_inx} className="!w-fit">
                          <div className="multi-selected-item-3">
                            {asb.label}
                          </div>
                        </SwiperSlide>
                      );
                    });
                  }
                }
              })}
            </Swiper>
          )}
        </div>
        <div>{isOpen ? <DropdownOpenIcon /> : <DropdownCloseIcon />}</div>
      </div>
      {isOpen && list.length > 0 && (
        <div
          className="absolute top-10 bg-white z-40 rounded-lg shadow-custom-1 w-full"
          style={{
            maxHeight: "532px",
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
              <div className="bg-white flex flex-col am-gapY-6px sticky top-0">
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
                    onFocus={() => setIsInputFocused(true)}
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
                  "cursor-pointer py-2 px-4 text-neutral-400 leading-6 dropdownbox-item",
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
                            activeItems.filter((t) => t.value === s).length > 0
                        )
                      : activeItems.filter((t) => t.value === l.value).length >
                        0;
                  const isParentActive =
                    l.parentId === null
                      ? false
                      : [...list]
                          .filter((a) => a.value === l.parentId)[0]
                          .subValues.every(
                            (s) =>
                              activeItems.filter((t) => t.value === s).length >
                              0
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
                            [...list].filter((c) => c.parentId !== null).length
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
                                .filter((ll) => l.subValues.includes(ll.value))
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
      )}
    </div>
  );
};

export default NestedDropdownBoxMultiWithSearch;
