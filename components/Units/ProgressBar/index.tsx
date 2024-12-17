"use client";

import { ProgressBarProps } from "@/interfaces";
import React from "react";

const ProgressBar: React.FC<ProgressBarProps> = ({ width = 0 }) => {
  return (
    <div className="w-full h-4 rounded-xl bg-blue-50 overflow-hidden">
      <div className="h-full bg-indigo-80" style={{ width: `${width}%` }}></div>
    </div>
  );
};

export default ProgressBar;
