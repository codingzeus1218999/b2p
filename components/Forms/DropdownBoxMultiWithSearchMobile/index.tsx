"use client";

import {
  CrossIcon,
  DropdownCloseIcon,
  DropdownOpenIcon,
  RemoveIcon,
  SearchIcon,
} from "@/components/Icons";
import { ScrollContext } from "@/context/ScrollContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxMultiWithSearchMobileProps } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./style.module.css";
import { getChromeVersion } from "@/utils/calcUtils";

const DropdownBoxMultiWithSearchMobile: React.FC<
  DropdownBoxMultiWithSearchMobileProps
> = ({
  list,
  onChange,
  title = "",
  totalTitle = "",
  activeItems,
  searchable = true,
}) => {
  const t = useTranslations();
  const [chromeVersion, setChromeVersion] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState("");
  const ref = useRef(null);
  const { setScroll } = useContext(ScrollContext);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    if (!isOpen) {
      setSearchStr("");
      setScroll(true);
    } else setScroll(false);
  }, [isOpen]);

  useEffect(() => {
    const cv = getChromeVersion();
    setChromeVersion(cv);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className={classNames(
          "cursor-pointer rounded-xl pl-1 py-1 pr-3 flex flex-row am-gapX-12px items-center justify-between",
          { "bg-sky-50": !isOpen, "bg-gray-300": isOpen }
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {activeItems.length === 0 ? (
          <p
            className="text-neutral-200 font-normal pl-2"
            style={{
              fontSize: "14px",
              lineHeight: "16px",
              paddingTop: "6px",
              paddingBottom: "6px",
            }}
          >
            {title}
          </p>
        ) : activeItems.length === list.length ? (
          <p
            className="text-sky-600 font-normal pl-2"
            style={{
              fontSize: "14px",
              lineHeight: "16px",
              paddingTop: "6px",
              paddingBottom: "6px",
            }}
          >
            {totalTitle}
          </p>
        ) : (
          <Swiper
            spaceBetween={4}
            slidesPerView={"auto"}
            modules={[FreeMode]}
            freeMode
            className="!w-full"
          >
            {activeItems.map((s, _idx) => (
              <SwiperSlide key={_idx} className="!w-fit">
                <div
                  className={classNames("multi-selected-item-3", {
                    opened: isOpen,
                  })}
                  dangerouslySetInnerHTML={{
                    __html: s.label,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {isOpen ? (
          <DropdownOpenIcon className="min-w-2" />
        ) : (
          <DropdownCloseIcon className="min-w-2" />
        )}
      </div>
      {isOpen && list.length > 0 && (
        <div className={styles.modal}>
          <div className={classNames(styles.container)}>
            <div
              style={{
                overflowY: "auto",
                maxHeight: "calc(100dvh - 32px)",
                paddingBottom: "68px",
              }}
            >
              <div
                style={{ paddingRight: "6px" }}
                className="flex flex-col am-gapY-6px"
              >
                <div className="py-2 px-4">
                  <CrossIcon
                    fill="#191c1f"
                    className="cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                {searchable && (
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
                )}
                <div
                  className={classNames(
                    "cursor-pointer py-2 px-4 text-neutral-400 leading-6 dropdownbox-item",
                    {
                      active: list.length === activeItems.length,
                      hidden: searchStr,
                    }
                  )}
                  onClick={() => {
                    if (activeItems.length === list.length) onChange([]);
                    else onChange([...list]);
                    setIsOpen(false);
                  }}
                >
                  {totalTitle}
                </div>
                {list
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
                            return;
                          } else {
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
            className={classNames(styles.btnContainer)}
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

export default DropdownBoxMultiWithSearchMobile;
