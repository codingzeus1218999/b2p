"use client";

import {
  AvailableIcon,
  ErrorClearIcon,
  EyeActiveIcon,
  EyeDisableIcon,
} from "@/components/Icons";
import { PasswordFieldMobileProps } from "@/interfaces";
import { useState } from "react";

const PasswordFieldMobile: React.FC<PasswordFieldMobileProps> = ({
  placeholder,
  errMsg,
  value,
  onChange,
  available,
  onBlur,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [type, setType] = useState<"text" | "password">("password");
  return (
    <div>
      <div
        className={`rounded-lg flex items-center justify-between am-gapX-4px p-3 bg-gray-100 border ${
          focused ? "bg-white" : ""
        } ${
          errMsg
            ? "border-red-300"
            : focused
            ? "border-sky-600"
            : "border-gray-100"
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e.target.value);
          }}
          placeholder={placeholder}
          className={`placeholder:text-neutral-400 placeholder:font-normal placeholder:text-base bg-gray-100 flex-1 focus:text-sky-600 text-xl leading-6 font-semibold focus:bg-white `}
        />
        {errMsg && value && (
          <ErrorClearIcon
            className="cursor-pointer"
            onClick={() => onChange("")}
          />
        )}
        {available && (
          <div className="p-1">
            <AvailableIcon />
          </div>
        )}
        <div className="h-6 w-6 flex justify-center items-center">
          {type === "text" && (
            <EyeActiveIcon
              className="cursor-pointer"
              onClick={() => setType("password")}
            />
          )}
          {type === "password" && (
            <EyeDisableIcon
              className="cursor-pointer mr-2px"
              onClick={() => setType("text")}
            />
          )}
        </div>
      </div>
      <div
        className="text-red-300 text-sm leading-4 mt-2"
        style={{ display: errMsg ? "block" : "hidden" }}
      >
        {errMsg}
      </div>
    </div>
  );
};

export default PasswordFieldMobile;
