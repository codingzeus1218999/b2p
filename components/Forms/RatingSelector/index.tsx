"use client";

import { StarIcon } from "@/components/Icons";
import { RatingSelectorProps } from "@/interfaces";
import { useState } from "react";

const RatingSelector: React.FC<RatingSelectorProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 24,
  gap = 16,
  displayValue = false,
  maxRating = 5,
  displayOnlyValue = false,
  valueGap = 8,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center">
      <div className="flex" style={{ margin: `0px -${gap / 2}px` }}>
        {Array(maxRating)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} style={{ margin: `0px ${gap / 2}px` }}>
              <StarIcon
                size={size}
                onClick={() => {
                  if (onChange && !readOnly) onChange(idx + 1);
                }}
                onMouseEnter={() => {
                  if (!readOnly) setHoverIndex(idx);
                }}
                onMouseLeave={() => {
                  if (!readOnly) setHoverIndex(null);
                }}
                className="cursor-pointer"
                fill={
                  hoverIndex !== null
                    ? hoverIndex >= idx
                      ? "#FFD05E"
                      : "#E3E3E5"
                    : Math.round(value) > idx
                    ? "#FFD05E"
                    : "#E3E3E5"
                }
              />
            </div>
          ))}
      </div>
      {displayValue && (
        <p
          className="text-xs leading-5 lg:text-base flex items-center"
          style={{ marginLeft: valueGap + "px" }}
        >
          <span>{value}</span>
          <span className="mx-2px">&#47;</span>
          <span>{maxRating}</span>
        </p>
      )}
      {displayOnlyValue && (
        <span
          className="text-xs lg:text-sm lg:leading-4"
          style={{ marginLeft: valueGap + "px" }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default RatingSelector;
