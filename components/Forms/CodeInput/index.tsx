"use client";

import { CodeInputProps } from "@/interfaces";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

const CodeInput: React.FC<CodeInputProps> = ({
  length,
  onComplete,
  error,
  updated,
}) => {
  useEffect(() => {
    setValues(Array(length).fill(""));
  }, [updated]);

  const [values, setValues] = useState(Array(length).fill(""));

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < length - 1) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }

    if (newValues.every((val) => val !== "") && newValues.length === length) {
      onComplete(newValues.join(""));
      unfocusAllInputs();
    }
  };

  const unfocusAllInputs = () => {
    for (let i = 0; i < length; i++) {
      const input = document.getElementById(`code-input-${i}`);
      if (input) (input as HTMLInputElement).blur();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  return (
    <>
      <div className="flex justify-between">
        {values.map((value, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={value}
            disabled={values.filter((t) => t === "").length === 0}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={classNames(
              styles.input,
              index === 0 && values.filter((t) => t === "").length === length
                ? styles.first
                : values.filter((t) => t === "").length === 0
                ? styles.filled
                : ""
            )}
          />
        ))}
      </div>
      {error && values.filter((t) => t === "").length === length && (
        <div className="mt-3 text-red-300 text-sm">{error}</div>
      )}
    </>
  );
};

export default CodeInput;
