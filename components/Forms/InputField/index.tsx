"use client";

import { AvailableIcon, ErrorClearIcon } from "@/components/Icons";
import { InputFieldProps } from "@/interfaces";
import { useState } from "react";

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  errMsg,
  value,
  onChange,
  available,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <div
      className={`px-4 pt-4 border-b bg-white ${
        focused ? "border-b-sky-600" : "border-b-white"
      }`}
      style={{ paddingBottom: "2px" }}
    >
      <div
        className="flex items-center justify-between am-gapX-4px"
        style={{ padding: "2px 0px" }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="placeholder:text-neutral-400 focus:text-sky-600 flex-1 bg-white"
        />
        {errMsg && value && !available && (
          <ErrorClearIcon
            className="cursor-pointer"
            onClick={() => onChange("")}
          />
        )}
        {available && <AvailableIcon />}
      </div>
      <div
        className="text-red-300 text-sm"
        style={{
          paddingBottom: errMsg ? "14px" : "10px",
          paddingTop: errMsg ? "2px" : "0px",
          lineHeight: "16px",
        }}
      >
        {errMsg}
      </div>
    </div>
  );
};

export default InputField;
