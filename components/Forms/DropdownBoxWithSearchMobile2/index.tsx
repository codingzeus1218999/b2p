"use client";

import { CrossIcon, RightIcon, SearchIcon } from "@/components/Icons";
import { BlurContext } from "@/context/BlurContext";
import { DropdownOpenContext } from "@/context/DropdownOpenContext";
import { ScrollContext } from "@/context/ScrollContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxWithSearchMobile2Props } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { getChromeVersion } from "@/utils/calcUtils";

const DropdownBoxWithSearchMobile2: React.FC<
  DropdownBoxWithSearchMobile2Props
> = ({ label, list, activeItem, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchStr, setSearchStr] = useState<string>("");
  const ref = useRef(null);
  const { setBlur } = useContext(BlurContext);
  const { dropdownOpen, isSelf, setIsSelf } = useContext(DropdownOpenContext);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const { setScroll } = useContext(ScrollContext);
  const [chromeVersion, setChromeVersion] = useState<number>(0);
  const t = useTranslations();

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

    if (isOpen) {
      setScroll(false);
    } else {
      setSearchStr("");
      setScroll(true);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [dropdownOpen]);

  useEffect(() => {
    const cv = getChromeVersion();
    setChromeVersion(cv);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        style={{ padding: "13px 16px" }}
        className="flex items-center justify-between am-gapX-8px cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-sm flex-1 leading-22px whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </p>
        <p className="text-sky-600 text-xs">{activeItem?.label ?? ""}</p>
        <RightIcon />
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
                      onClick={() => {
                        setSearchStr("");
                      }}
                    />
                  ) : (
                    <SearchIcon />
                  )}
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

export default DropdownBoxWithSearchMobile2;
