"use client";

import { iconPropsInterface } from "@/interfaces";

const RightIcon: React.FC<iconPropsInterface> = ({
  size = 24,
  fill = "#191c1f",
  className,
  onClick,
}) => {
  return (
    <>
      {size === 24 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="25"
          viewBox="0 0 24 25"
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
            d="M14 11.9999L10.0669 8.06685C9.82286 7.82277 9.42714 7.82277 9.18306 8.06685C8.93898 8.31093 8.93898 8.70665 9.18306 8.95073L13.1161 12.8838L9.18306 16.8168C8.93898 17.0609 8.93898 17.4567 9.18306 17.7007C9.42714 17.9448 9.82286 17.9448 10.0669 17.7007L14 13.7677L15 12.8838L14 11.9999Z"
            fill={fill}
          />
        </svg>
      )}
      {size === 16 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
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
            d="M6.47125 4L5.53125 4.94L8.58458 8L5.53125 11.06L6.47125 12L10.4713 8L6.47125 4Z"
            fill={fill}
          />
        </svg>
      )}
    </>
  );
};

export default RightIcon;
