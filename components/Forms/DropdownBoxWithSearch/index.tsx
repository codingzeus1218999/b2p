"use client";

import {
  CrossIcon,
  DropdownCloseIcon,
  DropdownOpenIcon,
  SearchIcon,
} from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxWithSearchProps } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";

const DropdownBoxWithSearch: React.FC<DropdownBoxWithSearchProps> = ({
  label,
  list,
  activeItem,
  onChange,
  disableSearch,
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
        className={classNames(
          "cursor-pointer min-h-9 px-3 justify-between flex items-center am-gapX-8px rounded-xl",
          {
            "bg-sky-50": !isOpen,
            "bg-gray-300": isOpen,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p
          className={classNames(
            "whitespace-nowrap flex-1 overflow-hidden text-sm",
            {
              "text-sky-600": activeItem,
            }
          )}
        >
          {activeItem ? activeItem.label : label}
        </p>
        {isOpen ? <DropdownOpenIcon /> : <DropdownCloseIcon />}
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
              {!disableSearch && (
                <div className="bg-white sticky top-0">
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
                        className="cursor-pointer min-w-5"
                        onClick={() => {
                          setSearchStr("");
                        }}
                      />
                    ) : (
                      <SearchIcon className="min-w-5" />
                    )}
                  </div>
                </div>
              )}
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

export default DropdownBoxWithSearch;
