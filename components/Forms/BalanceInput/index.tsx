"use client";

import { BalanceInputProps } from "@/interfaces";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const BalanceInput: React.FC<BalanceInputProps> = ({
  unit = "₽",
  onChangeVal,
  activeVal,
}) => {
  const t = useTranslations();
  const [inputVal, setInputVal] = useState<string>("");
  const [inputState, setInputState] = useState<"init" | "focus">("init");

  useEffect(() => {
    setInputVal(
      inputState === "init" && activeVal === 0
        ? t("payment.zero")
        : inputState === "focus" && activeVal === 0
        ? ""
        : activeVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    );
  }, [activeVal]);

  const onChange = (
    str: string,
    setVal: React.Dispatch<React.SetStateAction<string>>,
    callback: Function
  ) => {
    const numericValue = str.replace(/\D/g, "");
    if (numericValue === "") {
      setVal("");
      callback(0);
      return;
    }
    const formattedNumber = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    setVal(formattedNumber);
    const parsedValue = parseInt(numericValue, 10);
    if (!isNaN(parsedValue)) {
      callback(parsedValue);
    }
  };

  return (
    <div
      className={classNames(
        styles.container,
        inputState === "init" ? styles.init : styles.focus
      )}
    >
      <input
        value={inputVal}
        onChange={(e) => onChange(e.target.value, setInputVal, onChangeVal)}
        onFocus={() => {
          setInputState("focus");
          if (activeVal === 0) onChange("", setInputVal, onChangeVal);
        }}
        onBlur={() => {
          setInputState("init");
          if (activeVal === 0) setInputVal(t("payment.zero"));
        }}
      />
      <span className="ml-1">{unit}</span>
    </div>
  );
};

export default BalanceInput;
