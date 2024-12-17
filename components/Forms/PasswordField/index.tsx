"use client";

import {
  AvailableIcon,
  ErrorClearIcon,
  EyeActiveIcon,
  EyeDisableIcon,
} from "@/components/Icons";
import { PasswordFieldProps } from "@/interfaces";
import { useState } from "react";

const PasswordField: React.FC<PasswordFieldProps> = ({
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e.target.value);
          }}
          placeholder={placeholder}
          className={`placeholder:text-neutral-400 bg-white flex-1 ${
            type === "text" ? "focus:text-sky-600" : ""
          }`}
        />
        {errMsg && value && (
          <ErrorClearIcon
            className="cursor-pointer"
            onClick={() => onChange("")}
          />
        )}
        {available && <AvailableIcon />}
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
        className="text-red-300 text-sm leading-4"
        style={{ paddingBottom: errMsg ? "6px" : "10px" }}
      >
        {errMsg}
      </div>
    </div>
  );
};

export default PasswordField;
