"use client";

import { CrossIcon, SearchIcon } from "@/components/Icons";
import { ScrollContext } from "@/context/ScrollContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { DropdownBoxWithSearchMobile1Props } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { getChromeVersion } from "@/utils/calcUtils";

const DropdownBoxWithSearchMobile1: React.FC<
  DropdownBoxWithSearchMobile1Props
> = ({ label, list, onChange, activeItem, type, isBlue, hiddenReady }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setScroll } = useContext(ScrollContext);
  const [searchStr, setSearchStr] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const ref = useRef(null);
  const t = useTranslations();
  const [chromeVersion, setChromeVersion] = useState<number>(0);

  const handleClickOutside = () => {
    setIsOpen(false);
  };
  useOnClickOutside(ref, handleClickOutside);
  useEffect(() => {
    const cv = getChromeVersion();
    setChromeVersion(cv);
  });

  useEffect(() => {
    if (!isOpen) {
      setSearchStr("");
      if (type !== "desktop") setScroll(true);
    } else if (type !== "desktop") setScroll(false);
  }, [isOpen]);

  return (
    <div ref={ref} className="bg-white">
      <div
        className={classNames("cursor-pointer min-h-14 overflow-hidden p-4", {
          "text-zinc-200": !isOpen && !activeItem,
          "text-sky-600": isOpen || (!isOpen && activeItem && isBlue),
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="whitespace-nowrap">{activeItem?.label ?? label}</p>
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
                    padding: `16px 6px ${hiddenReady ? "0px" : "84px"} 16px`,
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
                  className={`bg-white ${
                    type === "desktop" ? "sticky top-0" : ""
                  }`}
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
            className={classNames(
              styles.btnContainer,
              type === "desktop" ? "hidden" : "",
              hiddenReady ? "hidden" : ""
            )}
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

export default DropdownBoxWithSearchMobile1;
