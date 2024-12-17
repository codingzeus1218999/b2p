"use client";

import { RemoveIcon, SearchIcon } from "@/components/Icons";
import useOnClickOutside from "@/hooks/useOnClickOutside"; // Make sure this path is correct
import { SearchInputProps } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

function SearchInput(props: SearchInputProps) {
  const [inputState, setInputState] = useState(
    props.initVal ? "found" : "init"
  );
  const [keyword, setKeyword] = useState(props.initVal || "");
  const inputRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  useEffect(() => {
    if (props.clearSignal > 0) {
      setInputState("init");
      setKeyword("");
      props.onSearch("");
    }
  }, [props.clearSignal]);

  useEffect(() => {
    props.onFocusEvent(inputState);
  }, [inputState]);

  useOnClickOutside(inputRef, () => {
    if (inputState !== "found") {
      setInputState("init");
    }
  });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onFocusInput = () => {
    if (inputState !== "found") {
      setInputState("focus");
    }
  };

  const onKeyPressInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (keyword !== "") {
        setInputState("found");
      }
      props.onSearch(keyword);
    } else if (keyword !== props.initVal) {
      setInputState("focus");
    }
  };

  const onClickClear = () => {
    setInputState("init");
    setKeyword("");
    props.onSearch("");
  };

  const onClickSearchIcon = () => {
    if (keyword !== "") {
      setInputState("found");
    } else {
      setInputState("init");
    }
    props.onSearch(keyword);
  };

  return (
    <div
      ref={inputRef}
      className={classNames(
        "flex flex-row rounded-xl px-3 py-2 am-gapX-12px items-center justify-between w-full",
        {
          "bg-sky-50": inputState === "init" || inputState === "found",
          "bg-gray-300": inputState === "focus",
        }
      )}
    >
      <input
        type="text"
        onChange={onChangeInput}
        value={keyword}
        onKeyDown={onKeyPressInput}
        onFocus={onFocusInput}
        placeholder={t("common.search")}
        className={classNames("w-10 font-normal text-sky-600 flex-1 text-sm", {
          "bg-sky-50": inputState === "init" || inputState === "found",
          "bg-gray-300": inputState === "focus",
        })}
      />
      <div>
        {inputState === "init" && (
          <SearchIcon
            fill="#b1b1b1"
            className="cursor-pointer"
            onClick={onClickSearchIcon}
          />
        )}
        {inputState === "focus" && (
          <SearchIcon
            className="cursor-pointer z-10"
            onClick={onClickSearchIcon}
            fill="#1976D2"
          />
        )}
        {inputState === "found" && (
          <RemoveIcon className="cursor-pointer" onClick={onClickClear} />
        )}
      </div>
    </div>
  );
}

export default SearchInput;
