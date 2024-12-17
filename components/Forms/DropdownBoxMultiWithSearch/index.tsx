"use client";

import {
  DropdownCloseIcon,
  DropdownOpenIcon,
  RemoveIcon,
  SearchIcon,
} from "@/components/Icons";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxMultiWithSearchProps } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DropdownBoxMultiWithSearch: React.FC<DropdownBoxMultiWithSearchProps> = ({
  list,
  onChange,
  title = "",
  totalTitle = "",
  activeItems,
  searchable = true,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState("");
  const ref = useRef(null);
  const { dropdownOpen, setDropdownOpen } = useContext(DropdownOpenContext);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    if (!isOpen) {
      setSearchStr("");
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

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
        <div
          className="absolute top-10 bg-white z-40 rounded-lg w-full"
          style={{
            maxHeight: "532px",
            boxShadow: "0px 4px 24px 0px rgba(25, 118, 210, 0.16)",
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
              {searchable && (
                <div className="bg-white sticky top-0">
                  <div className="py-2 px-4 flex items-center justify-between">
                    <input
                      type="text"
                      placeholder={t("common.search")}
                      className="leading-6 text-sky-600 flex-1 min-w-3"
                      value={searchStr}
                      onChange={(e) => {
                        setSearchStr(e.target.value);
                      }}
                    />
                    <SearchIcon />
                  </div>
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
                          onClick={() =>
                            onChange(
                              activeItems.filter((t) => t.value !== l.value)
                            )
                          }
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

export default DropdownBoxMultiWithSearch;
