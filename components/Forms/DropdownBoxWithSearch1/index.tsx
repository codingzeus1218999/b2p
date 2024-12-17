"use client";

import { CrossIcon, SearchIcon } from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxWithSearch1Props } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";

const DropdownBoxWithSearch1: React.FC<DropdownBoxWithSearch1Props> = ({
  label,
  list,
  activeItem,
  onChange,
  left = 0,
  isBlue,
  top,
  width,
  maxHeight,
  isCustomWidth,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState<string>("");
  const ref = useRef(null);
  const { setBlur } = useContext(BlurContext);
  const { dropdownOpen, isSelf, setIsSelf } = useContext(DropdownOpenContext);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    if (isSelf) {
      setBlur(true);
      setTimeout(() => {
        setIsSelf(false);
      }, 100);
    } else {
      setBlur(isOpen);
    }

    if (!isOpen) setSearchStr("");
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={ref}>
      <div
        className={classNames("cursor-pointer min-h-6 overflow-hidden", {
          "text-zinc-200": !isOpen && !activeItem,
          "text-sky-600": isOpen || (!isOpen && activeItem && isBlue),
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="whitespace-nowrap">{activeItem?.label ?? label}</p>
      </div>
      {isOpen && list.length > 0 && (
        <div
          className="absolute top-12 bg-white z-40 rounded-lg"
          style={{
            maxHeight: maxHeight ? maxHeight + "px" : "532px",
            boxShadow: "0px 4px 24px 0px rgba(25, 118, 210, 0.16)",
            width:
              isCustomWidth === undefined
                ? "320px"
                : width === undefined
                ? "100%"
                : `calc(100% + ${width}px)`,
            left: left ? left + "px" : "0px",
            top: top === undefined ? "48px" : `calc(100% + ${top}px)`,
            padding: "16px 6px 16px 16px",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              maxHeight: maxHeight ? maxHeight - 32 + "px" : "500px",
            }}
          >
            <div
              style={{ paddingRight: "6px" }}
              className="flex flex-col am-gapY-6px"
            >
              <div className="sticky top-0 bg-white">
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
                      "text-sky-600 flex-1 bg-gray-200 min-w-3",
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
                      fill="#ababad"
                    />
                  ) : (
                    <SearchIcon />
                  )}
                </div>
              </div>
              {list
                .filter((l) =>
                  l.label?.toLowerCase()?.includes(searchStr.toLowerCase())
                )
                .sort((a, b) => (a.value === activeItem?.value ? -1 : 0))
                .map((l, _idx) => (
                  <div
                    className={classNames(
                      "cursor-pointer py-2 px-4 text-neutral-400 dropdownbox-item",
                      { active: l.value === activeItem?.value }
                    )}
                    key={_idx}
                    onClick={() => {
                      setIsOpen(false);
                      if (l.value === activeItem?.value) return;
                      onChange(l);
                    }}
                  >
                    {l.label}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBoxWithSearch1;
