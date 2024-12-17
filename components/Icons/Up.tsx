"use client";

import { iconPropsInterface } from "@/interfaces";

const UpIcon: React.FC<iconPropsInterface> = ({
  size = 8,
  className,
  fill = "#1976D2",
  onClick,
}) => {
  return (
    <>
      {size === 8 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="6"
          viewBox="0 0 8 6"
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
            d="M8 5.5L4 0.5L-2.18557e-07 5.5L1.45597 5.5L4 2.26818L6.54403 5.5L8 5.5Z"
            fill={fill}
          />
        </svg>
      )}
      {size === 10 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="6"
          viewBox="0 0 10 6"
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
            d="M5.88388 1L9.81694 4.93306C10.061 5.17714 10.061 5.57286 9.81694 5.81694C9.57286 6.06102 9.17714 6.06102 8.93306 5.81694L5 1.88388L1.06694 5.81694C0.822864 6.06102 0.427136 6.06102 0.183059 5.81694C-0.0610192 5.57286 -0.0610192 5.17714 0.183059 4.93306L4.11612 1L5 -2.18557e-07L5.88388 1Z"
            fill={fill}
          />
        </svg>
      )}
      {size === 20 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.37465 14.1377L9.99965 8.5127L15.6247 14.1377L16.9505 12.8119L9.99965 5.86104L3.04883 12.8119L4.37465 14.1377Z"
            fill={fill}
          />
        </svg>
      )}
    </>
  );
};

export default UpIcon;
