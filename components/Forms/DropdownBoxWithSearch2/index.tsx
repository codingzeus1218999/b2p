"use client";

import { CrossIcon, SearchIcon } from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxWithSearch2Props } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";

const DropdownBoxWithSearch2: React.FC<DropdownBoxWithSearch2Props> = ({
  label,
  list,
  activeItem,
  onChange,
  type = 1,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState<string>("");
  const ref = useRef(null);
  const { setBlur } = useContext(BlurContext);
  const { dropdownOpen, isSelf, setIsSelf } = useContext(DropdownOpenContext);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [horveredIndex, setHorveredIndex] = useState<number>(0);

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
        className={classNames(
          "cursor-pointer min-h-11 px-4 py-3 justify-between flex items-center rounded-xl",
          {
            "bg-sky-50": !isOpen,
            "bg-gray-300": isOpen,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-sm">{label}</p>
        <div className="flex flex-col items-center justify-center w-fit">
          <p className="text-sm text-sky-600">
            {activeItem?.label ?? "Выбрать"}
          </p>
          <div className="mt-px h-px border-t border-dashed border-sky-600 w-full"></div>
        </div>
      </div>
      {isOpen && list.length > 0 && (
        <div
          className={`absolute top-12 bg-white z-40 shadow-custom-1 right-0`}
          style={{
            width: "320px",
            maxHeight: "302px",
            padding: `${type === 1 ? "16px 6px 16px 16px" : "0px"}`,
            borderRadius: `${type === 1 ? 8 : 12}px`,
          }}
        >
          <div
            style={{
              overflowY: "auto",
              maxHeight: type === 1 ? "270px" : "302px",
            }}
          >
            <div
              style={{ paddingRight: type === 1 ? "6px" : "0px" }}
              className={`flex flex-col ${type === 1 ? "am-gapY-6px" : ""}`}
            >
              {type === 1 && (
                <div
                  className={classNames(
                    "py-2 px-4 flex items-center justify-between rounded bg-gray-200 sticky top-0",
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
                      className="cursor-pointer min-w-5"
                      onClick={() => {
                        setSearchStr("");
                      }}
                    />
                  ) : (
                    <SearchIcon className="min-w-5" />
                  )}
                </div>
              )}
              {list
                .filter((l) =>
                  l.label?.toLowerCase()?.includes(searchStr.toLowerCase())
                )
                .sort((a, b) => (a.value === activeItem?.value ? -1 : 0))
                .map((l, _idx) => (
                  <div
                    className={classNames("cursor-pointer", {
                      active: l.value === activeItem?.value,
                      "text-neutral-400": type === 1,
                      "dropdownbox-item": type === 1,
                      "dropdownbox-item-1": type === 2,
                      "has-border":
                        type === 2 &&
                        _idx !== list.length - 1 &&
                        (_idx !== 0 || (_idx === 0 && !activeItem)),
                      "border-change": _idx === horveredIndex - 1,
                    })}
                    onMouseEnter={() => setHorveredIndex(_idx)}
                    onMouseLeave={() => setHorveredIndex(0)}
                    style={{
                      padding: `${type === 1 ? "8px 16px" : "13px 12px"}`,
                    }}
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

export default DropdownBoxWithSearch2;
