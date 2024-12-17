"use client";

import { RangeInputProps } from "@/interfaces";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const RangeInput: React.FC<RangeInputProps> = ({
  fromPlaceholder,
  toPlaceholder,
  unit,
  onChangeFromVal,
  onChangeToVal,
  fromActiveVal,
  toActiveVal,
}) => {
  const [fromVal, setFromVal] = useState<string>("");
  const [toVal, setToVal] = useState<string>("");

  useEffect(() => {
    setFromVal(
      fromActiveVal === undefined
        ? ""
        : fromActiveVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    );
  }, [fromActiveVal]);

  useEffect(() => {
    setToVal(
      toActiveVal === undefined
        ? ""
        : toActiveVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    );
  }, [toActiveVal]);

  const onChangeVal = (
    str: string,
    setVal: React.Dispatch<React.SetStateAction<string>>,
    callback: Function
  ) => {
    const numericValue = str.replace(/\D/g, "");
    if (numericValue === "") {
      setVal("");
      callback(undefined);
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
    <div className={styles.container}>
      <div className={`${styles.subContainer} pr-4`}>
        <div className="flex-1">
          <input
            placeholder={fromPlaceholder}
            value={fromVal}
            onChange={(e) =>
              onChangeVal(e.target.value, setFromVal, onChangeFromVal)
            }
            className="focus:text-sky-600 w-full max-w-full"
          />
        </div>
        <div className="text-sm text-zinc-200">{unit}</div>
      </div>
      <div className={`${styles.subContainer} pl-4`}>
        <div className="flex-1">
          <input
            placeholder={toPlaceholder}
            value={toVal}
            onChange={(e) =>
              onChangeVal(e.target.value, setToVal, onChangeToVal)
            }
            className="focus:text-sky-600 w-full max-w-full"
          />
        </div>
        <div className="text-sm text-zinc-200">{unit}</div>
      </div>
    </div>
  );
};

export default RangeInput;
