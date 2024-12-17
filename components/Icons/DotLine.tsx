"use client";

import { iconPropsInterface } from "@/interfaces";

const DotLineIcon: React.FC<iconPropsInterface> = ({
  size,
  className,
  fill = "#eef1f8",
  onClick,
}) => {
  return (
    <>
      {size === 40 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2"
          height="40"
          viewBox="0 0 2 40"
          fill="none"
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
        >
          <path
            d="M0.999998 0L0.999998 40"
            stroke={fill}
            strokeDasharray="8 8"
          />
        </svg>
      )}
      {size === 64 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2"
          height="64"
          viewBox="0 0 2 64"
          fill="none"
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            }
          }}
        >
          <path
            d="M0.999997 0L0.999997 64"
            stroke={fill}
            strokeDasharray="8 8"
          />
        </svg>
      )}
    </>
  );
};

export default DotLineIcon;
